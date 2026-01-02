import os
import cv2
import torch
from mtcnn.mtcnn import MTCNN

FRAMES_DIR = "Backend/data_frames"
OUT_DIR = "data_images"

os.makedirs(f"{OUT_DIR}/real", exist_ok=True)
os.makedirs(f"{OUT_DIR}/fake", exist_ok=True)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"\n🟢 Using device: {device}\n")

detector = MTCNN()

MIN_SIZE = 120  # <-- prevents empty conv output


def process_split(split):
    src_dir = os.path.join(FRAMES_DIR, split)

    if not os.path.exists(src_dir):
        print(f"⚠ Skipping — folder missing:", src_dir)
        return

    print(f"\n🚀 Processing {split.upper()} frames...\n")

    count = 0

    for root, _, files in os.walk(src_dir):
            for f in files:
                if not f.lower().endswith((".png", ".jpg", ".jpeg")):
                    continue

                in_path = os.path.join(root, f)

                img = cv2.imread(in_path)
                if img is None:
                    continue

                # skip tiny images (caused crash)
                if img.shape[0] < MIN_SIZE or img.shape[1] < MIN_SIZE:
                    continue

                # resize down for stability (optional)
                if max(img.shape[:2]) > 720:
                    scale = 720 / max(img.shape[:2])
                    img = cv2.resize(img, None, fx=scale, fy=scale)

                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

                try:
                    results = detector.detect_faces(img_rgb)
                except Exception as e:
                    continue

                if len(results) == 0:
                    continue

                # take strongest face
                x, y, w, h = results[0]["box"]

                x, y = max(0, x), max(0, y)
                crop = img[y:y+h, x:x+w]

                if crop.size == 0:
                    continue

                out_path = os.path.join(
                    OUT_DIR, split, os.path.basename(in_path)
                )

                cv2.imwrite(out_path, crop)
                count += 1

                if count % 50 == 0:
                    print(f"✔ Saved {count} faces in {split}")

    print(f"\n✅ Done — saved {count} faces in {split}\n")


process_split("real")
process_split("fake")

print("\n🎯 Face extraction complete\n")
