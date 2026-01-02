import cv2
import numpy as np

def visualize_prediction(
    image_path,
    cam,
    pred_label,     # 0 = FAKE, 1 = REAL
    confidence,     # float 0–1
    save_path
):
    # ---------------- Load image ----------------
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w, _ = img.shape

    # ---------------- Resize CAM ----------------
    cam = cv2.resize(cam, (w, h))

    # ---------------- Normalize (robust) ----------------
    cam = np.maximum(cam, 0)
    cam = cam / (np.percentile(cam, 99) + 1e-8)
    cam = np.clip(cam, 0, 1)

    # ---------------- Class-aware threshold ----------------
    # FAKE → stronger highlight
    # REAL → subtle highlight
    if pred_label == 1:   # REAL
        threshold = np.percentile(cam, 92)
    else:                # FAKE
        threshold = np.percentile(cam, 85)

    cam_mask = cam.copy()
    cam_mask[cam_mask < threshold] = 0

    # ---------------- Heatmap ----------------
    heatmap = np.uint8(255 * cam_mask)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_TURBO)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    # ---------------- Overlay (VERY SOFT) ----------------
    overlay = cv2.addWeighted(img, 0.90, heatmap, 0.10, 0)

    # =====================================================
    # UI BANNER (READABLE ON ALL IMAGE SIZES)
    # =====================================================
    banner_h = max(22, h // 11)
    cv2.rectangle(overlay, (0, 0), (w, banner_h), (0, 0, 0), -1)

    label = "REAL" if pred_label == 1 else "FAKE"
    conf_text = f"{confidence * 100:.1f}%"

    # Badge color
    badge_color = (0, 200, 0) if pred_label == 1 else (0, 0, 200)

    # Adaptive text size
    font_scale = max(0.5, h / 340)
    thickness = 1 if h < 300 else 2

    # Measure text
    (lw, lh), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)
    (cw, ch), _ = cv2.getTextSize(conf_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)

    # ---- Label badge ----
    cv2.rectangle(
        overlay,
        (6, 4),
        (6 + lw + 14, banner_h - 4),
        badge_color,
        -1
    )

    cv2.putText(
        overlay,
        label,
        (13, banner_h - 8),
        cv2.FONT_HERSHEY_SIMPLEX,
        font_scale,
        (255, 255, 255),
        thickness,
        cv2.LINE_AA
    )

    # ---- Confidence (white, always readable) ----
    cv2.putText(
        overlay,
        conf_text,
        (20 + lw + 20, banner_h - 8),
        cv2.FONT_HERSHEY_SIMPLEX,
        font_scale,
        (255, 255, 255),
        thickness,
        cv2.LINE_AA
    )

    # ---------------- Save ----------------
    overlay = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
    cv2.imwrite(save_path, overlay)
