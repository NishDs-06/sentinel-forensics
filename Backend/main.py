from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import cv2

from Backend.forensic_explain import forensic_explain
from Backend.gen_heatmaps import generate_heatmap

# --------------------------------------------------
# App
# --------------------------------------------------
app = FastAPI(title="TruthLens Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Health
# --------------------------------------------------
@app.get("/")
def root():
    return {"status": "TruthLens backend running"}

# --------------------------------------------------
# 🔥 UPLOAD → ANALYZE ENDPOINT
# --------------------------------------------------
@app.post("/analyze-upload")
async def analyze_uploaded_image(file: UploadFile = File(...)):
    os.makedirs("Backend/uploads", exist_ok=True)

    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    image_path = f"Backend/uploads/{filename}"

    # Save uploaded file
    with open(image_path, "wb") as f:
        f.write(await file.read())

    # 1️⃣ Generate heatmap
    heatmap_path = generate_heatmap(image_path)

    # 2️⃣ Forensic analysis
    heatmap = cv2.imread(heatmap_path, cv2.IMREAD_GRAYSCALE)
    forensic = forensic_explain(heatmap)
    scores = forensic["region_scores"]

    # 3️⃣ Explainable verdict logic
    mouth = scores.get("mouth", 0)
    eyes = scores.get("eyes", 0)
    avg_score = sum(scores.values()) / len(scores)

    if mouth > 0.30 or eyes > 0.30:
        verdict = "FAKE"
    elif avg_score < 0.20:
        verdict = "REAL"
    else:
        verdict = "SUSPICIOUS"

    confidence = round(max(mouth, eyes, avg_score), 2)
    dominant_region = max(scores, key=scores.get)

    return {
        "verdict": verdict,
        "confidence": confidence,
        "dominant_region": dominant_region,
        "forensic": forensic,
    }
