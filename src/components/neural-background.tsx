"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes: Node[] = [];
    const nodeCount = 100;
    const connectionDistance = 150;
    const colors = [
      "rgba(139, 92, 246, 0.5)", // violet
      "rgba(99, 102, 241, 0.5)", // indigo
      "rgba(59, 130, 246, 0.5)", // blue
    ];

    // Initialize nodes with different sizes and colors
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.min(
          Math.max(Math.random() * window.innerWidth, 0),
          window.innerWidth
        ),
        y: Math.min(
          Math.max(Math.random() * window.innerHeight, 0),
          window.innerHeight
        ),
        vx: Math.min(Math.max((Math.random() - 0.5) * 0.5, -2), 2),
        vy: Math.min(Math.max((Math.random() - 0.5) * 0.5, -2), 2),
        radius: Math.min(Math.max(Math.random() * 2 + 1, 0.1), 3),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrame: number;

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node) => {
        // Move towards mouse with spring physics
        const dx = springX.get() - node.x;
        const dy = springY.get() - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          node.vx += (dx / dist) * 0.02;
          node.vy += (dy / dist) * 0.02;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls with damping
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -0.8;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -0.8;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }

        // Apply friction
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Clamp velocities to prevent unstable behavior
        node.vx = Math.min(Math.max(node.vx, -2), 2);
        node.vy = Math.min(Math.max(node.vy, -2), 2);
      });

      // Draw connections with gradient
      nodes.forEach((nodeA) => {
        nodes.forEach((nodeB) => {
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const gradient = ctx.createLinearGradient(
              nodeA.x,
              nodeA.y,
              nodeB.x,
              nodeB.y
            );
            gradient.addColorStop(0, nodeA.color);
            gradient.addColorStop(1, nodeB.color);

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(0.1, 1 - distance / connectionDistance);
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes with glow effect
      nodes.forEach((node) => {
        // Validate coordinates and radius to ensure they are finite numbers
        if (
          !Number.isFinite(node.x) ||
          !Number.isFinite(node.y) ||
          !Number.isFinite(node.radius)
        ) {
          return; // Skip invalid nodes
        }

        ctx.beginPath();

        // Clamp values to prevent edge cases
        const x = Math.max(0, Math.min(canvas.width, node.x));
        const y = Math.max(0, Math.min(canvas.height, node.y));
        const radius = Math.max(0.1, Math.min(10, node.radius));

        try {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
          gradient.addColorStop(0, node.color);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
          ctx.fill();
        } catch {
          // Fallback to solid color if gradient creation fails
          ctx.fillStyle = node.color;
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [springX, springY]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    />
  );
}
