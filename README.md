🛡️ Sentinel-Forensics

Sentinel-Forensics is a deepfake detection system built to determine whether an image or video is real or manipulated, while also explaining why that decision was made.

Instead of acting like a black box, the system highlights which facial regions show signs of manipulation, making the result more transparent and easier to trust.


---

What this project does

Accepts image and video uploads

Classifies content as REAL or FAKE

Provides a confidence score for each prediction

Performs region-wise forensic analysis (eyes, mouth, face edges, background)

Identifies the dominant suspicious region

Displays results through a clean, user-friendly web interface

Runs inference only when a user uploads media



---

How the pipeline works

1. User uploads an image or video through the frontend


2. Backend extracts frames (for videos) and detects faces


3. Faces are cropped and normalized


4. Each face is passed through a deepfake detection model


5. A forensic post-processing layer analyzes regional inconsistencies


6. The system returns:

Verdict (REAL / FAKE)

Confidence score

Region-wise risk breakdown





---

Tech Stack

Frontend

React — component-based UI

TypeScript — type-safe frontend logic

Tailwind CSS — responsive and clean styling

Fetch API / Axios — backend communication

Modular components for uploads, results, and forensic insights



---

Backend

FastAPI (Python) — high-performance REST API

Uvicorn — ASGI server

Pydantic — request/response validation

CORS middleware — smooth frontend-backend integration

Dedicated endpoints for:

Media upload

Inference execution

Forensic result formatting




---

Machine Learning & Forensics

PyTorch — deep learning inference

CNN-based deepfake detection model

OpenCV — face detection, cropping, and video frame extraction

Frame-wise analysis for videos

Heatmap-based forensic scoring

Region-level aggregation (eyes, mouth, facial edges, background)



---

Data & Processing

Face-centric preprocessing pipeline

Combination of real and fake samples from public deepfake datasets

Frame sampling to balance accuracy and performance

Lightweight inference design to reduce hardware dependency



---

Why Sentinel-Forensics?

Most deepfake detection tools provide only a label without context.

Sentinel-Forensics focuses on explainability and trust, helping users understand where manipulation is likely happening instead of blindly accepting a prediction.


---

Current Status

Core detection pipeline implemented

End-to-end image analysis working

Frontend and backend fully integrated

Video analysis currently frame-based and improving


This is an evolving prototype, and accuracy will improve with more data and training.


---

Team

Built by a team of undergraduate engineering students with interests in:

Artificial Intelligence & Machine Learning

Digital Forensics

Cybersecurity

Full-stack Development



---

Future Improvements

Training on newer, higher-quality deepfake datasets

Improved video-level temporal consistency checks

Faster inference on low-end systems

More detailed forensic explanations
