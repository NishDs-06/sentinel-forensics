import os
import torch
import timm
import numpy as np
from torch import nn, optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from sklearn.metrics import accuracy_score, classification_report

DATA_DIR = "dataset_split"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print("\n🟢 Training on:", DEVICE)

BATCH_SIZE = 16
IMG_SIZE = 224
EPOCHS = 15


# ------------ Data Augmentation (compression + blur + jitter) -------- #

train_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomApply([
        transforms.GaussianBlur(3)
    ], p=0.3),
    transforms.RandomApply([
        transforms.ColorJitter(.2,.2,.2,.1)
    ], p=0.3),
    transforms.RandomApply([
        transforms.Resize(256),
        transforms.Resize((IMG_SIZE, IMG_SIZE))
    ], p=0.3),
    transforms.ToTensor()
])

test_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor()
])


# ------------ Load Dataset ---------------- #

train_ds = datasets.ImageFolder(f"{DATA_DIR}/train", transform=train_tf)
val_ds   = datasets.ImageFolder(f"{DATA_DIR}/val",   transform=test_tf)
test_ds  = datasets.ImageFolder(f"{DATA_DIR}/test",  transform=test_tf)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
val_loader   = DataLoader(val_ds, batch_size=BATCH_SIZE)
test_loader  = DataLoader(test_ds, batch_size=BATCH_SIZE)

class_names = train_ds.classes
print("\nClasses:", class_names)


# ------------ Model (EfficientNet-B0) ------------ #

model = timm.create_model("efficientnet_b0", pretrained=True, num_classes=2)

# freeze backbone
for name, param in model.named_parameters():
    if "classifier" not in name:
        param.requires_grad = False

model = model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3)


# ------------ Train Loop (mixed precision) ------------ #

scaler = torch.cuda.amp.GradScaler(enabled=(DEVICE=="cuda"))

def evaluate(loader):
    model.eval()
    preds, labels = [], []

    with torch.no_grad():
        for x,y in loader:
            x,y = x.to(DEVICE), y.to(DEVICE)
            with torch.cuda.amp.autocast(enabled=(DEVICE=="cuda")):
                out = model(x)
            preds += out.argmax(1).cpu().tolist()
            labels += y.cpu().tolist()

    acc = accuracy_score(labels, preds)
    return acc


best_val = 0

for epoch in range(EPOCHS):
    model.train()

    for x,y in train_loader:
        x,y = x.to(DEVICE), y.to(DEVICE)

        optimizer.zero_grad()

        with torch.cuda.amp.autocast(enabled=(DEVICE=="cuda")):
            out = model(x)
            loss = criterion(out, y)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()

    val_acc = evaluate(val_loader)

    print(f"Epoch {epoch+1}/{EPOCHS} — val acc: {val_acc:.3f}")

    if val_acc > best_val:
        best_val = val_acc
        torch.save(model.state_dict(), "best_model.pt")
        print("✔ Saved checkpoint")


# ------------ Evaluate on Test Set ------------ #

model.load_state_dict(torch.load("best_model.pt"))
test_acc = evaluate(test_loader)

print("\n🎯 Test Accuracy:", round(test_acc,3))

y_true, y_pred = [], []

with torch.no_grad():
    for x,y in test_loader:
        x,y = x.to(DEVICE), y.to(DEVICE)
        out = model(x)
        y_true += y.cpu().tolist()
        y_pred += out.argmax(1).cpu().tolist()

print("\n", classification_report(y_true, y_pred, target_names=class_names))
