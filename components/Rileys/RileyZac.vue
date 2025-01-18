<template>
  <svg
      viewBox="0 0 800 800"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      ref="svg"
  >
    <!-- Background -->
    <circle cx="400" cy="400" r="400" fill="white"/>

    <!-- Generate multiple rings of zigzag patterns -->
    <g v-for="(ring, index) in 12" :key="index">
      <path
          :d="generateZigzagRing(400, 400, (12-index)*30, 360, 60-(index*3), index)"
          fill="none"
          stroke="black"
          stroke-width="3"
          :style="{
          transform: `rotate(${getRotation(index)}deg)`,
          transformOrigin: '400px 400px'
        }"
      />
    </g>

    <!-- Center dot -->
    <circle cx="400" cy="400" r="8" fill="white"/>
  </svg>
</template>

<script>
export default {
  data() {
    return {
      rotation: 0,
      animationFrameId: null,
      mouseX: 400,
      mouseY: 400,
      isMouseOver: false
    }
  },
  methods: {
    handleMouseMove(event) {
      const svgRect = this.$refs.svg.getBoundingClientRect();
      const scaleX = 800 / svgRect.width;
      const scaleY = 800 / svgRect.height;

      this.mouseX = (event.clientX - svgRect.left) * scaleX;
      this.mouseY = (event.clientY - svgRect.top) * scaleY;
      this.isMouseOver = true;
    },
    handleMouseLeave() {
      this.isMouseOver = false;
    },
    distanceFromMouse(x, y) {
      const dx = x - this.mouseX;
      const dy = y - this.mouseY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    generateZigzagRing(cx, cy, radius, segments, zigzagCount, ringIndex) {
      let path = '';
      const angleStep = 360 / segments;
      const zigzagAngleStep = 360 / zigzagCount;

      for (let i = 0; i <= segments; i++) {
        const angle = (i * angleStep) * (Math.PI / 180);
        let baseRadius = radius + ((i % 2) * 10) +
            Math.sin(i * zigzagAngleStep * (Math.PI / 180)) * 5;

        // Calculate point position
        let x = cx + baseRadius * Math.cos(angle);
        let y = cy + baseRadius * Math.sin(angle);

        // Apply warping if mouse is over
        if (this.isMouseOver) {
          const dist = this.distanceFromMouse(x, y);
          const maxDist = 100; // Radius of influence
          if (dist < maxDist) {
            const warpFactor = (1 - (dist / maxDist)) * 30; // Max 30px displacement
            const toMouseX = (this.mouseX - x) / dist;
            const toMouseY = (this.mouseY - y) / dist;
            x += toMouseX * warpFactor;
            y += toMouseY * warpFactor;
          }
        }

        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }

      return path;
    },
    getRotation(index) {
      const direction = index % 2 === 0 ? 1 : -1;
      const speedFactor = 1 / (1 + index * 0.5);
      return this.rotation * direction * speedFactor;
    },
    startAnimation() {
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        this.rotation = (progress * 0.01) % 360;

        this.animationFrameId = requestAnimationFrame(animate);
      }

      this.animationFrameId = requestAnimationFrame(animate);
    },
    stopAnimation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    this.stopAnimation();
  }
}
</script>