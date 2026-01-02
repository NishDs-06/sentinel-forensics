import os
import cv2
import torch
import numpy as np
from PIL import Image
from torchvision import transforms
import timm

# --------------------------------------------------
# CONFIG
# --------------------------------------------------
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_efficientnet.pth")
HEATMAP_DIR = os.path.join(BASE_DIR, "Backend", "heatmaps")

os.makedirs(HEATMAP_DIR, exist_ok=True)

# --------------------------------------------------
# LOAD MODEL (MATCH CHECKPOINT EXACTLY)
# --------------------------------------------------
model = timm.create_model(
    "efficientnet_b0",
    pretrained=False,
    num_classes=2   # 🔴 THIS IS THE FIX
)

state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(state_dict)     # ✅ NO ERRORS NOW
model.to(DEVICE)
model.eval()

# --------------------------------------------------
# TRANSFORMS
# --------------------------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# --------------------------------------------------
# HEATMAP GENERATION (GRADIENT SALIENCY)
# --------------------------------------------------
def generate_heatmap(image_path: str) -> str:
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(DEVICE)
    input_tensor.requires_grad_(True)

    # Forward
    output = model(input_tensor)

    # Backward from strongest class
    class_idx = output.argmax(dim=1)
    score = output[0, class_idx]
    score.backward()

    # Gradient saliency
    gradients = input_tensor.grad.abs().mean(dim=1)[0]
    heatmap = gradients.detach().cpu().numpy()

    # Normalize
    heatmap -= heatmap.min()
    heatmap /= (heatmap.max() + 1e-8)
    heatmap = (heatmap * 255).astype(np.uint8)

    # Resize to original image size
    heatmap = cv2.resize(heatmap, image.size)

    # Save
    filename = os.path.basename(image_path)
    heatmap_path = os.path.join(HEATMAP_DIR, filename)
    cv2.imwrite(heatmap_path, heatmap)

    return heatmap_path
