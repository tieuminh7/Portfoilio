import React, { useRef, useEffect, useState } from "react";

const importAll = (r) => r.keys().map(r);

const bannerImages = importAll(
  require.context("../Images/Banner", false, /\.(png|jpe?g|svg)$/)
);

const ImageParticleEffect = ({
  width = 300,
  particleSize = 6,
  displayDuration = 4000,
  reverseEffect = false,
  alphaMultiplier = 3,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particles = useRef([]);
  const phase = useRef("holdBeforeAssembling");
  const phaseStartTime = useRef(0);
  const [height, setHeight] = useState(300);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageSrc, setImageSrc] = useState(bannerImages[0]);

  useEffect(() => {
    if (containerRef.current) {
      const { clientHeight } = containerRef.current;
      setHeight(clientHeight);
    }
  }, []);

  useEffect(() => {
    if (!height) return;

    let animationRunning = true;
    phase.current = "holdBeforeAssembling";
    phaseStartTime.current = 0;
    particles.current = [];

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext("2d");
      offCtx.drawImage(img, 0, 0, width, height);

      const imageData = offCtx.getImageData(0, 0, width, height);
      const data = imageData.data;

      particles.current = [];
      for (let y = 0; y < height; y += particleSize) {
        for (let x = 0; x < width; x += particleSize) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a > 128) {
            particles.current.push({
              x: Math.random() * width,
              y: Math.random() * height,
              targetX: x,
              targetY: y,
              r,
              g,
              b,
              a,
              vx: 0,
              vy: 0,
              dispersingTargetX: Math.random() * width,
              dispersingTargetY: Math.random() * height,
            });
          }
        }
      }

      const ease = 0.1;
      let fadeOutProgress = 0;
      let idleProgress = 0;

      const animate = (timestamp) => {
        if (!animationRunning) return;
        ctx.clearRect(0, 0, width, height);

        if (!phaseStartTime.current) phaseStartTime.current = timestamp;
        const elapsed = timestamp - phaseStartTime.current;

        const holdDuration = 4000;
        const assemblingDuration = 8000;
        const fadeOutDuration = 2000;
        const idleDuration = 1000;

        if (!reverseEffect) {
          if (phase.current === "holdBeforeAssembling") {
            if (elapsed > holdDuration) {
              phase.current = "assembling";
              phaseStartTime.current = timestamp;
            }
          } else if (phase.current === "assembling") {
            if (elapsed > assemblingDuration) {
              phase.current = "holdAfterAssembling";
              phaseStartTime.current = timestamp;
            }
          } else if (phase.current === "holdAfterAssembling") {
            // Start fadeout immediately after assembling completes
            if (elapsed > 0) {
              phase.current = "fadeOut";
              phaseStartTime.current = timestamp;
              fadeOutProgress = 0;
            }
          } else if (phase.current === "fadeOut") {
            fadeOutProgress = Math.min(elapsed / fadeOutDuration, 1);
            if (fadeOutProgress >= 1) {
              // Switch to next image immediately at start of idle phase
              setCurrentImageIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % bannerImages.length;
                setImageSrc(bannerImages[nextIndex]);
                return nextIndex;
              });
              phase.current = "idle";
              phaseStartTime.current = timestamp;
              idleProgress = 0;
            }
          } else if (phase.current === "idle") {
            idleProgress = Math.min(elapsed / idleDuration, 1);
            if (idleProgress >= 1) {
              phase.current = "holdBeforeAssembling";
              phaseStartTime.current = timestamp;
              particles.current.forEach((p) => {
                p.dispersingTargetX = Math.random() * width;
                p.dispersingTargetY = Math.random() * height;
              });
            }
          } else if (phase.current === "dispersing") {
            if (elapsed > assemblingDuration) {
              phase.current = "delayAfterDispersing";
              phaseStartTime.current = timestamp;
            }
          } else if (phase.current === "delayAfterDispersing") {
            if (elapsed > 2000) {
              phase.current = "holdBeforeAssembling";
              phaseStartTime.current = timestamp;
              particles.current.forEach((p) => {
                p.dispersingTargetX = Math.random() * width;
                p.dispersingTargetY = Math.random() * height;
              });
            }
          }
        } else {
          if (phase.current === "dispersing") {
            if (elapsed > assemblingDuration) {
              phase.current = "holdAfterAssembling";
              phaseStartTime.current = timestamp;
            }
          } else if (phase.current === "holdAfterAssembling") {
            if (elapsed > holdDuration) {
              phase.current = "assembling";
              phaseStartTime.current = timestamp;
            }
          } else if (phase.current === "assembling") {
            if (elapsed > assemblingDuration) {
              phase.current = "holdBeforeAssembling";
              phaseStartTime.current = timestamp;
            }
          } else if (phase.current === "holdBeforeAssembling") {
            if (elapsed > holdDuration) {
              phase.current = "dispersing";
              phaseStartTime.current = timestamp;
              particles.current.forEach((p) => {
                p.dispersingTargetX = Math.random() * width;
                p.dispersingTargetY = Math.random() * height;
              });
            }
          }
        }

        if (phase.current === "idle") {
          ctx.clearRect(0, 0, width, height);
        } else {
          particles.current.forEach((p) => {
            let dx, dy;
            if (
              phase.current === "dispersing" ||
              phase.current === "holdBeforeAssembling"
            ) {
              dx =
                p.dispersingTargetX +
                Math.sin(timestamp / 1000 + p.x) * 5 -
                p.x;
              dy =
                p.dispersingTargetY +
                Math.cos(timestamp / 1000 + p.y) * 5 -
                p.y;
              p.vx += dx * (ease * 0.1);
              p.vy += dy * (ease * 0.1);
            } else {
              dx = p.targetX - p.x;
              dy = p.targetY - p.y;
              p.vx += dx * (ease * 0.03);
              p.vy += dy * (ease * 0.03);
            }
            p.vx *= 0.8;
            p.vy *= 0.8;

            p.vx *= 0.8;
            p.vy *= 0.8;

            p.x += p.vx;
            p.y += p.vy;

            let alpha = Math.min((p.a / 255) * alphaMultiplier, 1);
            if (phase.current === "fadeOut") {
              alpha = alpha * (1 - fadeOutProgress);
            }
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, particleSize / 2, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        animationFrameId.current = requestAnimationFrame(animate);
      };

      animationFrameId.current = requestAnimationFrame(animate);

      return () => {
        animationRunning = false;
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    };
  }, [imageSrc, width, height, particleSize, displayDuration, reverseEffect]);

  return (
    <div
      className="about-image"
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: "block" }}
      />
    </div>
  );
};

export default ImageParticleEffect;
