// 21-Point Hand Pose Kinematics, Classifier, and Canvas Renderer

export const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring finger
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky finger
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm knuckle base connections
  [5, 9], [9, 13], [13, 17]
];

// Euclidean distance between two 2D/3D points
export function distance(p1, p2) {
  if (!p1 || !p2) return 0;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Real-Time Gesture Classifier from 21 Landmarks
export function classifyHandGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return { id: 'unknown', gloss: 'DETECTING...', confidence: 60 };
  }

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbMcp = landmarks[2];
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const indexMcp = landmarks[5];
  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];

  // Palm scale reference
  const palmScale = distance(wrist, landmarks[9]) || 100;

  // Check finger extension based on wrist-to-tip vs wrist-to-pip distance
  const isExtended = (tip, pip) => distance(wrist, tip) > distance(wrist, pip) * 1.15;

  const indexExt = isExtended(indexTip, indexPip);
  const middleExt = isExtended(middleTip, middlePip);
  const ringExt = isExtended(ringTip, ringPip);
  const pinkyExt = isExtended(pinkyTip, pinkyPip);

  // Thumb extension (relative to palm and index base)
  const thumbExt = distance(wrist, thumbTip) > distance(wrist, thumbMcp) * 1.25 &&
                   distance(thumbTip, indexMcp) > palmScale * 0.35;

  // Check if thumb & index are touching (OK or C sign)
  const thumbIndexDist = distance(thumbTip, indexTip);
  const isTouchingThumbIndex = thumbIndexDist < palmScale * 0.28;

  // Count total extended fingers
  const count = (indexExt ? 1 : 0) + (middleExt ? 1 : 0) + (ringExt ? 1 : 0) + (pinkyExt ? 1 : 0);

  // 1. I LOVE YOU: Thumb, Index, Pinky extended; Middle and Ring folded
  if (thumbExt && indexExt && !middleExt && !ringExt && pinkyExt) {
    return { id: 'i-love-you', gloss: 'I LOVE YOU', confidence: 99.4 };
  }

  // 2. OK SIGN: Thumb & Index touching, Middle, Ring, Pinky extended
  if (isTouchingThumbIndex && middleExt && ringExt && pinkyExt) {
    return { id: 'ok', gloss: 'OK', confidence: 98.6 };
  }

  // 3. CALL ME / SHAKA / Y: Thumb & Pinky extended, others curled
  if (thumbExt && !indexExt && !middleExt && !ringExt && pinkyExt) {
    return { id: 'call-me', gloss: 'CALL ME / Y', confidence: 98.9 };
  }

  // 4. PEACE / V SIGN / 2: Index & Middle up, Ring & Pinky closed
  if (!thumbExt && indexExt && middleExt && !ringExt && !pinkyExt) {
    return { id: 'peace', gloss: 'PEACE / V', confidence: 99.1 };
  }

  // 5. LETTER L: Thumb & Index at 90 deg, others closed
  if (thumbExt && indexExt && !middleExt && !ringExt && !pinkyExt) {
    return { id: 'letter-l', gloss: 'L', confidence: 99.2 };
  }

  // 6. THUMBS UP (GOOD): Thumb up, all others curled, thumb tip above wrist
  if (thumbExt && count === 0 && thumbTip.y < wrist.y) {
    return { id: 'thumbs-up', gloss: 'GOOD / THUMBS UP', confidence: 98.7 };
  }

  // 7. POINT / ONE: Index only extended
  if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    return { id: 'point', gloss: 'ONE / POINT', confidence: 99.0 };
  }

  // 8. WATER / THREE: Index, Middle, Ring extended, Pinky closed
  if (indexExt && middleExt && ringExt && !pinkyExt) {
    return { id: 'water', gloss: 'WATER / 3', confidence: 98.1 };
  }

  // 9. FOUR / LETTER B: 4 fingers extended, thumb folded
  if (!thumbExt && indexExt && middleExt && ringExt && pinkyExt) {
    return { id: 'letter-b', gloss: 'B / FOUR', confidence: 98.8 };
  }

  // 10. HELLO / OPEN HAND (FIVE): All 5 fingers extended wide
  if (thumbExt && indexExt && middleExt && ringExt && pinkyExt) {
    return { id: 'hello', gloss: 'HELLO / OPEN HAND', confidence: 99.2 };
  }

  // 11. CLOSED FIST / YES / A: All 5 fingers curled
  if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
    return { id: 'yes', gloss: 'YES / FIST', confidence: 98.5 };
  }

  return { id: 'gesture', gloss: 'TRACKING GESTURE', confidence: 94.0 };
}

// Generates landmark coordinates based on gesture configuration and kinematic micro-movements
export function generateHandLandmarks(signId, time, width = 640, height = 480) {
  const cx = width / 2;
  const cy = height / 2 + 30;
  const scale = Math.min(width, height) * 0.35;
  const jitterX = Math.sin(time * 0.003) * 3;
  const jitterY = Math.cos(time * 0.004) * 3;

  // Base palm configuration
  const wrist = { x: cx + jitterX, y: cy + scale * 0.7 + jitterY, z: 0 };
  const baseKnuckles = [
    { x: cx - scale * 0.4 + jitterX, y: cy + scale * 0.15 + jitterY }, // thumb base (1)
    { x: cx - scale * 0.28, y: cy - scale * 0.05 }, // index base (5)
    { x: cx - scale * 0.05, y: cy - scale * 0.12 }, // middle base (9)
    { x: cx + scale * 0.16, y: cy - scale * 0.08 }, // ring base (13)
    { x: cx + scale * 0.34, y: cy + scale * 0.02 }  // pinky base (17)
  ];

  // Specific hand posture adjustments based on signId
  let thumbFold = 0.3;
  let indexFold = 0.0;
  let middleFold = 0.0;
  let ringFold = 0.0;
  let pinkyFold = 0.0;

  if (signId === 'yes' || signId === 'letter-a' || signId === 'fist') {
    thumbFold = 0.8;
    indexFold = 1.0;
    middleFold = 1.0;
    ringFold = 1.0;
    pinkyFold = 1.0;
  } else if (signId === 'peace' || signId === 'letter-v' || signId === 'num-2') {
    thumbFold = 0.9;
    indexFold = 0.0;
    middleFold = 0.0;
    ringFold = 1.0;
    pinkyFold = 1.0;
  } else if (signId === 'i-love-you') {
    thumbFold = 0.0;
    indexFold = 0.0;
    middleFold = 1.0;
    ringFold = 1.0;
    pinkyFold = 0.0;
  } else if (signId === 'letter-l') {
    thumbFold = 0.0;
    indexFold = 0.0;
    middleFold = 1.0;
    ringFold = 1.0;
    pinkyFold = 1.0;
  } else if (signId === 'letter-b' || signId === 'num-4') {
    thumbFold = 1.0;
    indexFold = 0.0;
    middleFold = 0.0;
    ringFold = 0.0;
    pinkyFold = 0.0;
  } else if (signId === 'call-me' || signId === 'letter-y') {
    thumbFold = 0.0;
    indexFold = 1.0;
    middleFold = 1.0;
    ringFold = 1.0;
    pinkyFold = 0.0;
  } else if (signId === 'point' || signId === 'num-1') {
    thumbFold = 0.8;
    indexFold = 0.0;
    middleFold = 1.0;
    ringFold = 1.0;
    pinkyFold = 1.0;
  } else if (signId === 'thumbs-up') {
    thumbFold = 0.0;
    indexFold = 1.0;
    middleFold = 1.0;
    ringFold = 1.0;
    pinkyFold = 1.0;
  } else if (signId === 'ok') {
    thumbFold = 0.5;
    indexFold = 0.5;
    middleFold = 0.0;
    ringFold = 0.0;
    pinkyFold = 0.0;
  } else if (signId === 'water' || signId === 'num-3') {
    thumbFold = 0.9;
    indexFold = 0.0;
    middleFold = 0.0;
    ringFold = 0.0;
    pinkyFold = 1.0;
  }

  const landmarks = [];
  landmarks[0] = wrist;

  // Thumb points (1 to 4)
  const thumbAngle = thumbFold > 0.5 ? 0.8 : -0.6;
  const thumbExt = 1 - thumbFold * 0.6;
  landmarks[1] = baseKnuckles[0];
  landmarks[2] = { x: baseKnuckles[0].x - scale * 0.15 * thumbExt, y: baseKnuckles[0].y - scale * 0.15 * thumbExt };
  landmarks[3] = { x: landmarks[2].x - scale * 0.12 * thumbExt + Math.sin(thumbAngle) * 8, y: landmarks[2].y - scale * 0.12 * thumbExt };
  landmarks[4] = { x: landmarks[3].x - scale * 0.1 * thumbExt, y: landmarks[3].y - scale * 0.1 * thumbExt };

  // Helper for 3 joints on 4 main fingers
  const buildFinger = (baseIdx, startPoint, dx, length, fold) => {
    const ext = 1 - fold * 0.75;
    const curlY = fold * scale * 0.35;
    const p1 = { x: startPoint.x + dx * 0.3, y: startPoint.y - length * 0.35 * ext + curlY * 0.3 };
    const p2 = { x: startPoint.x + dx * 0.6, y: p1.y - length * 0.35 * ext + curlY * 0.6 };
    const tip = { x: startPoint.x + dx * 0.85, y: p2.y - length * 0.3 * ext + curlY };
    landmarks[baseIdx] = startPoint;
    landmarks[baseIdx + 1] = p1;
    landmarks[baseIdx + 2] = p2;
    landmarks[baseIdx + 3] = tip;
  };

  // Index (5..8)
  buildFinger(5, baseKnuckles[1], -scale * 0.06, scale * 0.75, indexFold);
  // Middle (9..12)
  buildFinger(9, baseKnuckles[2], 0, scale * 0.82, middleFold);
  // Ring (13..16)
  buildFinger(13, baseKnuckles[3], scale * 0.05, scale * 0.74, ringFold);
  // Pinky (17..20)
  buildFinger(17, baseKnuckles[4], scale * 0.14, scale * 0.6, pinkyFold);

  return landmarks;
}

// Draw the holographic neural mesh onto a canvas context
export function drawHandLandmarks(ctx, landmarks, signLabel = '', confidence = 98.4) {
  if (!landmarks || landmarks.length < 21) return;

  // Draw glowing skeletal connections
  ctx.save();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#06b6d4'; // Cyan neon
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 12;

  for (const [start, end] of HAND_CONNECTIONS) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  // Draw secondary pulse connections
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#a855f7'; // Purple neon
  for (const [start, end] of HAND_CONNECTIONS) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  // Draw joint nodes
  landmarks.forEach((p, index) => {
    ctx.beginPath();
    const isTip = [4, 8, 12, 16, 20].includes(index);
    const radius = isTip ? 7 : 4.5;

    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    if (isTip) {
      ctx.fillStyle = '#10b981'; // Emerald glowing tips
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 16;
    } else if (index === 0) {
      ctx.fillStyle = '#f43f5e'; // Rose wrist anchor
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 16;
    } else {
      ctx.fillStyle = '#38bdf8'; // Cyan joint
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 10;
    }
    ctx.fill();

    // Outer node ring for fingertips
    if (isTip) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // Calculate bounding box for HUD overlay
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  landmarks.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const pad = 24;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;

  // Draw HUD bounding box brackets
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  const bracketLen = 22;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(minX, minY + bracketLen);
  ctx.lineTo(minX, minY);
  ctx.lineTo(minX + bracketLen, minY);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(maxX - bracketLen, minY);
  ctx.lineTo(maxX, minY);
  ctx.lineTo(maxX, minY + bracketLen);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(minX, maxY - bracketLen);
  ctx.lineTo(minX, maxY);
  ctx.lineTo(minX + bracketLen, maxY);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(maxX - bracketLen, maxY);
  ctx.lineTo(maxX, maxY);
  ctx.lineTo(maxX, maxY - bracketLen);
  ctx.stroke();

  // HUD Tracking Tag
  if (signLabel) {
    ctx.font = 'bold 12px ui-monospace, monospace';
    const tagText = `[ NEURAL LOCK: ${signLabel.toUpperCase()} | ${confidence.toFixed(1)}% ]`;
    const textWidth = ctx.measureText(tagText).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(minX, minY - 26, textWidth + 16, 22);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(minX, minY - 26, textWidth + 16, 22);

    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 0;
    ctx.fillText(tagText, minX + 8, minY - 10);
  }

  ctx.restore();
}
