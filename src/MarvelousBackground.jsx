import React, { useEffect, useRef } from 'react';

const MarvelousBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 1. Starfield
    const stars = Array(300).fill().map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random()
    }));

    // 2. Wireframe Earth Settings
    let rotation = 0;

    // 3. Flocking Birds (Boids)
    const boids = Array(60).fill().map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }));

    // 4. Shooting Stars
    const shootingStars = [];
    const createShootingStar = () => {
      if (Math.random() > 0.97) { // 3% chance per frame
        shootingStars.push({
          x: Math.random() * width * 1.5,
          y: 0,
          length: Math.random() * 100 + 40,
          speed: Math.random() * 15 + 10,
          opacity: 1
        });
      }
    };

    const updateAndDraw = () => {
      // Clear with dark slate background
      ctx.fillStyle = '#020617'; 
      ctx.fillRect(0, 0, width, height);

      // --- Draw Starfield ---
      stars.forEach(star => {
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = width;
          star.y = Math.random() * height;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Draw Mouse Constellation ---
      ctx.lineWidth = 0.5;
      stars.forEach(star => {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 150) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
        }
      });

      // --- Draw Shooting Stars ---
      createShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x -= ss.speed;
        ss.y += ss.speed;
        ss.opacity -= 0.02;
        
        if (ss.opacity <= 0 || ss.x < 0 || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }
        
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x + ss.length, ss.y - ss.length);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x + ss.length, ss.y - ss.length);
        ctx.stroke();
      }

      // --- Draw Wireframe Earth ---
      const globeCenter = { x: width * 0.75, y: height * 0.5 };
      const globeRadius = Math.min(width, height) * 0.35;
      
      rotation += 0.002;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)'; // Cyan with low opacity
      ctx.lineWidth = 1;
      
      const numLatitudes = 16;
      const numLongitudes = 32;
      
      // Horizontal rings (Latitudes)
      for (let i = 0; i <= numLatitudes; i++) {
        const lat = Math.PI * i / numLatitudes;
        ctx.beginPath();
        for (let j = 0; j <= numLongitudes; j++) {
          const lon = 2 * Math.PI * j / numLongitudes + rotation;
          const x3d = globeRadius * Math.sin(lat) * Math.cos(lon);
          const y3d = globeRadius * Math.cos(lat);
          const z3d = globeRadius * Math.sin(lat) * Math.sin(lon);
          
          const scale = 2000 / (2000 + z3d);
          const x2d = globeCenter.x + x3d * scale;
          const y2d = globeCenter.y + y3d * scale;
          
          if (j === 0) ctx.moveTo(x2d, y2d);
          else ctx.lineTo(x2d, y2d);
        }
        ctx.stroke();
      }

      // Vertical lines (Longitudes)
      for (let j = 0; j < numLongitudes; j++) {
        const lon = 2 * Math.PI * j / numLongitudes + rotation;
        ctx.beginPath();
        for (let i = 0; i <= numLatitudes; i++) {
          const lat = Math.PI * i / numLatitudes;
          const x3d = globeRadius * Math.sin(lat) * Math.cos(lon);
          const y3d = globeRadius * Math.cos(lat);
          const z3d = globeRadius * Math.sin(lat) * Math.sin(lon);
          
          const scale = 2000 / (2000 + z3d);
          const x2d = globeCenter.x + x3d * scale;
          const y2d = globeCenter.y + y3d * scale;
          
          if (i === 0) ctx.moveTo(x2d, y2d);
          else ctx.lineTo(x2d, y2d);
        }
        ctx.stroke();
      }

      // --- Draw Flocking Birds ---
      boids.forEach(boid => {
        let cx = 0, cy = 0, cvx = 0, cvy = 0;
        let numNeighbors = 0;

        boids.forEach(other => {
          if (boid !== other) {
            const dx = boid.x - other.x;
            const dy = boid.y - other.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 120) {
              cx += other.x; cy += other.y;
              cvx += other.vx; cvy += other.vy;
              numNeighbors++;
              
              // Separation
              if (dist < 40) {
                boid.vx += dx * 0.03;
                boid.vy += dy * 0.03;
              }
            }
          }
        });

        if (numNeighbors > 0) {
          // Cohesion
          cx /= numNeighbors; cy /= numNeighbors;
          boid.vx += (cx - boid.x) * 0.001;
          boid.vy += (cy - boid.y) * 0.001;
          
          // Alignment
          cvx /= numNeighbors; cvy /= numNeighbors;
          boid.vx += cvx * 0.03;
          boid.vy += cvy * 0.03;
        }

        // Mouse Avoidance
        const mouseDx = boid.x - mouseX;
        const mouseDy = boid.y - mouseY;
        const mouseDist = Math.sqrt(mouseDx*mouseDx + mouseDy*mouseDy);
        if (mouseDist < 150) {
          boid.vx += (mouseDx / mouseDist) * 0.4;
          boid.vy += (mouseDy / mouseDist) * 0.4;
        }

        // General drift to the right
        boid.vx += 0.02;

        // Speed limits
        const speed = Math.sqrt(boid.vx*boid.vx + boid.vy*boid.vy);
        const maxSpeed = 3.5;
        if (speed > maxSpeed) {
          boid.vx = (boid.vx / speed) * maxSpeed;
          boid.vy = (boid.vy / speed) * maxSpeed;
        }

        boid.x += boid.vx;
        boid.y += boid.vy;

        // Screen Wrap
        if (boid.x < -50) boid.x = width + 50;
        if (boid.x > width + 50) boid.x = -50;
        if (boid.y < -50) boid.y = height + 50;
        if (boid.y > height + 50) boid.y = -50;

        // Draw Bird (Triangle shape)
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);
        
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)'; // Cyan bird
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-6, 6);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-6, -6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none" 
      style={{ opacity: 0.8 }}
    />
  );
};

export default MarvelousBackground;
