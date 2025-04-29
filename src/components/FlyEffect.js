import React, { useEffect, useState, useRef } from "react";
import "../styles/FlyEffect.css";

const images = [
  require("../Images/Fly/ai.png"),
  require("../Images/Fly/angular.png"),
  require("../Images/Fly/cpfoods.png"),
  require("../Images/Fly/cpgroup.png"),
  require("../Images/Fly/css.png"),
  require("../Images/Fly/gosell.png"),
  require("../Images/Fly/html.png"),
  require("../Images/Fly/js.png"),
  require("../Images/Fly/mediastep.png"),
  require("../Images/Fly/mongo.png"),
  require("../Images/Fly/node.png"),
  require("../Images/Fly/pr.png"),
  require("../Images/Fly/ps.png"),
  require("../Images/Fly/React.webp"),
  require("../Images/Fly/sql.png"),
  require("../Images/Fly/tailwind.png"),
];

const FlyEffect = ({ containerId }) => {
  const [flies, setFlies] = useState([]);
  const fliesRef = useRef([]);
  const containerRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const createFly = (containerWidth, containerHeight) => {
      const image = images[Math.floor(Math.random() * images.length)];
      const sizeChance = Math.random();
      let size;
      if (sizeChance < 0.7) {
        size = Math.random() * 30 + 20; // 20 to 50 px
      } else {
        size = Math.random() * 50 + 50; // 50 to 100 px
      }
      const left = Math.random() * (containerWidth - size);
      const top = Math.random() * (containerHeight - size);
      const vx = (Math.random() - 0.5) * 1.5;
      const vy = (Math.random() - 0.5) * 1.5;
      const rotation = Math.random() * 360;
      const rotationSpeed = (Math.random() - 0.5) * 4; // degrees per frame
      return { image, size, left, top, vx, vy, rotation, rotationSpeed };
    };

    let containerWidth = window.innerWidth;
    let containerHeight = window.innerHeight * 0.8;

    if (containerId) {
      const containerElement = document.getElementById(containerId);
      if (containerElement) {
        const rect = containerElement.getBoundingClientRect();
        containerWidth = rect.width;
        containerHeight = rect.height;
      }
    }

    const initialFlies = [];
    for (let i = 0; i < 40; i++) {
      initialFlies.push(createFly(containerWidth, containerHeight));
    }
    setFlies(initialFlies);
    fliesRef.current = initialFlies;
  }, [containerId]);

  useEffect(() => {
    const updatePositions = () => {
      let containerWidth = window.innerWidth;
      let containerHeight = window.innerHeight * 0.8;

      if (containerId) {
        const containerElement = document.getElementById(containerId);
        if (containerElement) {
          const rect = containerElement.getBoundingClientRect();
          containerWidth = rect.width;
          containerHeight = rect.height;
        }
      }

      fliesRef.current.forEach((fly, index) => {
        let newLeft = fly.left + fly.vx;
        let newTop = fly.top + fly.vy;
        let newVx = fly.vx;
        let newVy = fly.vy;

        if (newLeft <= 0) {
          newLeft = 0;
          newVx = -newVx;
        } else if (newLeft + fly.size >= containerWidth) {
          newLeft = containerWidth - fly.size;
          newVx = -newVx;
        }

        if (newTop <= 0) {
          newTop = 0;
          newVy = -newVy;
        } else if (newTop + fly.size >= containerHeight) {
          newTop = containerHeight - fly.size;
          newVy = -newVy;
        }

        fly.left = newLeft;
        fly.top = newTop;
        fly.vx = newVx;
        fly.vy = newVy;

        const img = containerRef.current.children[index];
        if (img) {
          img.style.left = `${newLeft}px`;
          img.style.top = `${newTop}px`;
          img.style.transform = `rotate(${fly.rotation}deg)`;
        }

        // Update rotation
        fly.rotation += fly.rotationSpeed;
        if (fly.rotation >= 360) fly.rotation -= 360;
        else if (fly.rotation < 0) fly.rotation += 360;
      });

      animationFrameId.current = requestAnimationFrame(updatePositions);
    };

    animationFrameId.current = requestAnimationFrame(updatePositions);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [flies, containerId]);

  // Set containerRef div size and position to match container element
  const [containerStyle, setContainerStyle] = useState({});

  useEffect(() => {
    if (containerId) {
      const containerElement = document.getElementById(containerId);
      if (containerElement) {
        const rect = containerElement.getBoundingClientRect();
        setContainerStyle({
          position: "absolute",
          top: 0,
          left: 0,
          width: rect.width,
          height: rect.height,
          pointerEvents: "none",
          overflow: "hidden",
        });
      }
    }
  }, [containerId]);

  return (
    <div ref={containerRef} className="fly-container" style={containerStyle}>
      {flies.map(({ image, size, left, top }, index) => (
        <img
          key={index}
          src={image}
          alt=""
          className="fly-image"
          style={{
            position: "absolute",
            top: top,
            left: left,
            width: size,
            height: size,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

export default FlyEffect;
