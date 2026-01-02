import numpy as np
import cv2

# --------------------------------------------------
# 1. Normalize heatmap to 0–1
# --------------------------------------------------
def normalize_heatmap(heatmap: np.ndarray) -> np.ndarray:
    if heatmap.ndim == 3:
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2GRAY)

    heatmap = heatmap.astype(np.float32)
    heatmap -= heatmap.min()
    heatmap /= (heatmap.max() + 1e-8)

    return heatmap


# --------------------------------------------------
# 2. Split heatmap into forensic regions
# --------------------------------------------------
def split_regions(heatmap: np.ndarray) -> dict:
    H, W = heatmap.shape

    regions = {
        "eyes": heatmap[int(0.2*H):int(0.4*H), int(0.2*W):int(0.8*W)],
        "mouth": heatmap[int(0.6*H):int(0.8*H), int(0.3*W):int(0.7*W)],
        "face_edges": np.concatenate(
            [
                heatmap[:, :int(0.1*W)],
                heatmap[:, int(0.9*W):]
            ],
            axis=1
        ),
        "background": heatmap[:int(0.1*H), :]
    }

    return regions


# --------------------------------------------------
# 3. Compute attention score per region
# --------------------------------------------------
def compute_region_scores(regions: dict) -> dict:
    scores = {}
    for region, values in regions.items():
        scores[region] = round(float(np.mean(values)), 3)
    return scores


# --------------------------------------------------
# 4. Convert scores to forensic interpretation
# --------------------------------------------------
def interpret_scores(scores: dict) -> dict:
    interpretation = {}

    for region, score in scores.items():
        if score >= 0.6:
            interpretation[region] = {
                "risk": "high",
                "description": "Strong manipulation indicators detected"
            }
        elif score >= 0.3:
            interpretation[region] = {
                "risk": "medium",
                "description": "Possible artifact presence"
            }
        else:
            interpretation[region] = {
                "risk": "low",
                "description": "Region appears visually natural"
            }

    return interpretation


# --------------------------------------------------
# 5. MASTER FUNCTION — STEP 3 PIPELINE
# --------------------------------------------------
def forensic_explain(heatmap: np.ndarray) -> dict:
    heatmap = normalize_heatmap(heatmap)
    regions = split_regions(heatmap)
    scores = compute_region_scores(regions)
    explanation = interpret_scores(scores)

    return {
        "step": 3,
        "type": "post-heatmap forensic analysis",
        "region_scores": scores,
        "forensic_explanation": explanation
    }


# --------------------------------------------------
# 6. TEST RUN (optional)
# --------------------------------------------------
if __name__ == "__main__":
    import cv2
    import os
    from pprint import pprint

    heatmap_path = "heatmaps/frame_0157.png"

    assert os.path.exists(heatmap_path), "❌ Heatmap file not found"

    heatmap = cv2.imread(heatmap_path, cv2.IMREAD_GRAYSCALE)
    assert heatmap is not None, "❌ Heatmap could not be loaded"

    output = forensic_explain(heatmap)
    pprint(output)

