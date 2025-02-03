# KetchBoat.vue
<script setup lang="ts">
import {
  Vector3, Vector2, MeshStandardMaterial, Shape, Path,
  CatmullRomCurve3, BufferGeometry, Float32BufferAttribute,
  DoubleSide, ExtrudeGeometry, BoxGeometry, CylinderGeometry,
  LatheGeometry, PlaneGeometry
} from "three";
import {ref, onMounted} from "vue";

const props = defineProps<{ position: Vector3 }>();

// Vessel dimensions
const LOA = 14; // Length overall
const LWL = 12; // Waterline length
const BEAM = 4.2; // Maximum beam
const DRAFT = 2; // Draft with keel
const FREEBOARD = 1.5; // Height above waterline
// Real-world inspired dimensions (in relative units)
const HULL_LENGTH = 12;
const HULL_BEAM = 3.6; // Maximum beam (width)
const HULL_DEPTH = 2.2;
const MAIN_MAST_HEIGHT = HULL_LENGTH * 1.2; // Typically around 120% of hull length
const MIZZEN_MAST_HEIGHT = MAIN_MAST_HEIGHT * 0.7; // Typically 65-75% of main mast


// Create hull points with proper sections
const createHullPoints = () => {
  const points = [];
  const sections = 40;
  const pointsPerSection = 20;

  for (let i = 0; i <= sections; i++) {
    const z = (i / sections - 0.5) * LOA;
    const t = i / sections;

    const sectionBeam = BEAM * Math.sin(Math.PI * t) *
        (1 - 0.8 * Math.pow(2 * t - 1, 4));

    const bowFlair = Math.pow(Math.max(0, 0.3 - t), 2) * 2;
    const sternTaper = Math.pow(Math.max(0, t - 0.7), 2) * 1.5;
    const deadrise = Math.min(0.8, Math.pow(Math.abs(t - 0.5), 0.5)) * 0.5;

    for (let j = 0; j <= pointsPerSection; j++) {
      const a = (j / pointsPerSection) * Math.PI;

      let x = Math.sin(a) * sectionBeam * 0.5;
      let y = Math.cos(a) * DRAFT;

      if (t < 0.3) {
        const bowShape = Math.pow(t / 0.3, 0.5);
        x *= bowShape;
        x += (0.3 - t) * Math.sin(a) * bowFlair;
      }

      if (t > 0.7) {
        const sternShape = Math.pow((1 - t) / 0.3, 0.5);
        x *= sternShape;
        x *= (1 - sternTaper);
      }

      y += Math.abs(x) * deadrise;

      if (y > 0) {
        x *= 1 - (y / FREEBOARD) * 0.15;
      }

      points.push(new Vector3(x, y, z));
    }
  }

  return points;
};

// Create hull faces
const createHullIndices = (sections: number, pointsPerSection: number) => {
  const indices = [];

  for (let i = 0; i < sections; i++) {
    for (let j = 0; j < pointsPerSection; j++) {
      const a = i * (pointsPerSection + 1) + j;
      const b = a + 1;
      const c = (i + 1) * (pointsPerSection + 1) + j;
      const d = c + 1;

      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  return indices;
};

// Create hull geometry
const createHullGeometry = () => {
  const points = createHullPoints();
  const indices = createHullIndices(40, 20);

  const geometry = new BufferGeometry();

  const positions = new Float32Array(points.length * 3);
  points.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
  });

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};

// Materials
const hullMaterial = new MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.6,
  metalness: 0.2,
  envMapIntensity: 1
});

const keelMaterial = new MeshStandardMaterial({
  color: 0x2a2a2a,
  roughness: 0.5,
  metalness: 0.3
});

const teakMaterial = new MeshStandardMaterial({
  color: 0x8B7355,
  roughness: 0.9,
  metalness: 0.1
});

// Create realistic keel
const createKeelGeometry = () => {
  const shape = new Shape();

  // NACA 0012 airfoil profile for hydrodynamic efficiency
  shape.moveTo(0, 0);
  shape.bezierCurveTo(
      DRAFT * 0.3, DRAFT * 0.1,
      DRAFT * 0.6, DRAFT * 0.4,
      DRAFT, DRAFT
  );
  shape.lineTo(0, DRAFT);

  const extrudeSettings = {
    steps: 1,
    depth: HULL_LENGTH * 0.4,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.1,
    bevelSegments: 5
  };

  return new ExtrudeGeometry(shape, extrudeSettings);
};

// Generate geometries
const hullGeometry = createHullGeometry();
const keelGeometry = createKeelGeometry();


// Create running rigging
const createRunningRigging = () => {
  return [
    // Main Halyard
    {
      points: [
        new Vector3(0, FREEBOARD + LOA * 1.3, -LOA * 0.1),
        new Vector3(0.1, FREEBOARD + LOA * 1.2, -LOA * 0.1),
        new Vector3(0.15, FREEBOARD + 0.5, -LOA * 0.15)
      ],
      color: 0x303030
    },
    // Main Sheet
    {
      points: [
        new Vector3(BEAM * 0.3, FREEBOARD + 2, -LOA * 0.1),
        new Vector3(BEAM * 0.2, FREEBOARD + 0.5, LOA * 0.1),
        new Vector3(BEAM * 0.3, FREEBOARD + 0.3, LOA * 0.15)
      ],
      color: 0x404040
    },
    // Mizzen Halyard
    {
      points: [
        new Vector3(0, FREEBOARD + LOA * 0.9, LOA * 0.3),
        new Vector3(0.1, FREEBOARD + LOA * 0.8, LOA * 0.3),
        new Vector3(0.15, FREEBOARD + 0.5, LOA * 0.25)
      ],
      color: 0x303030
    }
  ];
};

// Additional geometries for deck structures
const createDeckHouse = () => {
  const shape = new Shape();
  const width = BEAM * 0.65;
  const length = LOA * 0.35;

  // Curved deck house top
  shape.moveTo(-width / 2, -length / 2);
  shape.bezierCurveTo(
      -width / 2, length / 3,
      -width / 2, length / 3,
      -width / 3, length / 2
  );
  shape.lineTo(width / 3, length / 2);
  shape.bezierCurveTo(
      width / 2, length / 3,
      width / 2, length / 3,
      width / 2, -length / 2
  );
  shape.lineTo(-width / 2, -length / 2);

  return new ExtrudeGeometry(shape, {
    depth: 1.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 4
  });
};

const sailMaterial = new MeshStandardMaterial({
  color: 0xFFFAF0,
  roughness: 0.75,
  metalness: 0.1,
  side: DoubleSide,
  transparent: true,
  opacity: 0.92
});

const brightworkMaterial = new MeshStandardMaterial({
  color: 0x8B4513,
  roughness: 0.6,
  metalness: 0.2
});

const metalMaterial = new MeshStandardMaterial({
  color: 0x808080,
  roughness: 0.3,
  metalness: 0.8
});
const createCockpit = () => {
  const shape = new Shape();
  const width = BEAM * 0.4;
  const length = LOA * 0.2;

  shape.moveTo(-width / 2, -length / 2);
  shape.lineTo(-width / 2, length / 2);
  shape.bezierCurveTo(
      -width / 2, length / 2 + 0.3,
      width / 2, length / 2 + 0.3,
      width / 2, length / 2
  );
  shape.lineTo(width / 2, -length / 2);
  shape.bezierCurveTo(
      width / 2, -length / 2 - 0.3,
      -width / 2, -length / 2 - 0.3,
      -width / 2, -length / 2
  );

  return new ExtrudeGeometry(shape, {
    depth: 0.8,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2
  });
};

// Create detailed mast geometry with proper taper and fittings
const createMastGeometry = (height: number, baseWidth: number) => {
  const points = [];
  const segments = 20;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const radius = baseWidth * (1 - t * 0.4); // Proper taper
    const y = height * t;

    // Create mast section with proper shape
    for (let a = 0; a <= Math.PI * 2; a += Math.PI / 8) {
      points.push(new Vector3(
          Math.cos(a) * radius,
          y,
          Math.sin(a) * radius
      ));
    }
  }

  const geometry = new BufferGeometry();
  const vertices = new Float32Array(points.length * 3);
  points.forEach((p, i) => {
    vertices[i * 3] = p.x;
    vertices[i * 3 + 1] = p.y;
    vertices[i * 3 + 2] = p.z;
  });
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  return geometry;
};

// Create realistic sail geometry with proper shape and draft
const createSailGeometry = (height: number, footLength: number, maxDraft: number) => {
  const points = [];
  const segments = 20;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = height * t;

    // Calculate draft position and amount
    const draftPos = 0.4; // 40% forward
    const draft = maxDraft * Math.sin(Math.PI * t) * (1 - t * 0.3);

    for (let j = 0; j <= segments; j++) {
      const x = (j / segments) * footLength;
      const z = draft * Math.sin(Math.PI * (x / footLength) * draftPos);
      points.push(new Vector3(x, y, z));
    }
  }

  const geometry = new BufferGeometry();
  const vertices = new Float32Array(points.length * 3);
  points.forEach((p, i) => {
    vertices[i * 3] = p.x;
    vertices[i * 3 + 1] = p.y;
    vertices[i * 3 + 2] = p.z;
  });
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  return geometry;
};

const riggingMaterial = new MeshStandardMaterial({
  color: 0x202020,
  roughness: 0.4,
  metalness: 0.7
});

const teakDeckMaterial = new MeshStandardMaterial({
  color: 0x8B7355, // Weathered teak color
  roughness: 0.9,
  metalness: 0.1
});

const mastMaterial = new MeshStandardMaterial({
  color: 0x8B4513,
  roughness: 0.8,
  metalness: 0.1
});

// Create realistic boom with proper proportions
const createBoomGeometry = (length: number) => {
  return new CylinderGeometry(0.08, 0.12, length, 12);
};

// Create standing rigging geometry
const createStandingRigging = () => {
  const geometry = new BufferGeometry();
  const positions = new Float32Array([
    0, 0, 0,
    0, 1, 0
  ]);
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return geometry;
};

// Generate geometries
const mainBoomGeometry = createBoomGeometry(HULL_BEAM * 1.2);
const mizzenBoomGeometry = createBoomGeometry(HULL_BEAM * 0.9);
const riggingGeometry = createStandingRigging();
const runningRigging = createRunningRigging()
const deckHouseGeometry = createDeckHouse();
const cockpitGeometry = createCockpit();
const mainMastGeometry = createMastGeometry(LOA * 1.3, 0.15);
const mizzenMastGeometry = createMastGeometry(LOA * 0.9, 0.12);
const mainSailGeometry = createSailGeometry(LOA * 1.2, BEAM * 1.1, 1.2);
const mizzenSailGeometry = createSailGeometry(LOA * 0.8, BEAM * 0.8, 0.9);
</script>

<template>
  <TresGroup :position="position">
    <!-- Hull Assembly -->
    <TresGroup>
      <!-- Main Hull -->
      <TresMesh
          :geometry="hullGeometry"
          :material="hullMaterial"
          :position="[0, FREEBOARD, 0]"
      />

      <!-- Keel -->
      <TresMesh
          :geometry="keelGeometry"
          :material="hullMaterial"
          :position="[0, -DRAFT/2, 0]"
      />

      <!-- Deck -->
      <TresMesh
          :geometry="new BoxGeometry(HULL_LENGTH * 0.8, 0.1, HULL_BEAM * 0.8)"
          :material="teakDeckMaterial"
          :position="[0, FREEBOARD + 0.05, 0]"
      />

      <!-- Coach Roof -->
      <TresMesh
          :geometry="new BoxGeometry(HULL_LENGTH * 0.3, 0.8, HULL_BEAM * 0.6)"
          :material="teakDeckMaterial"
          :position="[0, FREEBOARD + 0.5, 0]"
      />
    </TresGroup>

    <!-- Masts and Spars -->
    <TresGroup>
      <!-- Main Mast -->
      <TresMesh
          :geometry="mainMastGeometry"
          :material="mastMaterial"
          :position="[-HULL_LENGTH * 0.15, FREEBOARD + MAIN_MAST_HEIGHT/2, 0]"
      />

      <!-- Main Boom -->
      <TresMesh
          :geometry="mainBoomGeometry"
          :material="mastMaterial"
          :position="[-HULL_LENGTH * 0.15, FREEBOARD + 2, 0]"
          :rotation="[0, 0, Math.PI * -0.15]"
      />

      <!-- Mizzen Mast -->
      <TresMesh
          :geometry="mizzenMastGeometry"
          :material="mastMaterial"
          :position="[HULL_LENGTH * 0.25, FREEBOARD + MIZZEN_MAST_HEIGHT/2, 0]"
      />

      <!-- Mizzen Boom -->
      <TresMesh
          :geometry="mizzenBoomGeometry"
          :material="mastMaterial"
          :position="[HULL_LENGTH * 0.25, FREEBOARD + 1.5, 0]"
          :rotation="[0, 0, Math.PI * -0.12]"
      />
    </TresGroup>

    <!-- Sails -->
    <TresGroup>
      <!-- Main Sail -->
      <TresMesh
          :geometry="new PlaneGeometry(HULL_BEAM * 1.2, MAIN_MAST_HEIGHT * 0.8)"
          :material="sailMaterial"
          :position="[-HULL_LENGTH * 0.1, FREEBOARD + MAIN_MAST_HEIGHT * 0.5, 0]"
          :rotation="[0, Math.PI * 0.2, Math.PI * -0.05]"
      />

      <!-- Mizzen Sail -->
      <TresMesh
          :geometry="new PlaneGeometry(HULL_BEAM * 0.9, MIZZEN_MAST_HEIGHT * 0.75)"
          :material="sailMaterial"
          :position="[HULL_LENGTH * 0.3, FREEBOARD + MIZZEN_MAST_HEIGHT * 0.45, 0]"
          :rotation="[0, Math.PI * 0.2, Math.PI * -0.05]"
      />
    </TresGroup>

    <!-- Standing Rigging -->
    <TresGroup>
      <!-- Main Mast Forestay -->
      <TresLineSegments
          :geometry="riggingGeometry"
          :material="metalMaterial"
          :position="[-HULL_LENGTH * 0.15, FREEBOARD, HULL_BEAM * 0.3]"
          :scale="[1, MAIN_MAST_HEIGHT, 1]"
          :rotation="[0, 0, Math.PI * 0.15]"
      />

      <!-- Main Mast Backstay -->
      <TresLineSegments
          :geometry="riggingGeometry"
          :material="metalMaterial"
          :position="[-HULL_LENGTH * 0.15, FREEBOARD, -HULL_BEAM * 0.3]"
          :scale="[1, MAIN_MAST_HEIGHT, 1]"
          :rotation="[0, 0, Math.PI * -0.15]"
      />

      <!-- Mizzen Stays -->
      <TresLineSegments
          v-for="angle in [-0.12, 0.12]"
          :key="angle"
          :geometry="riggingGeometry"
          :material="metalMaterial"
          :position="[HULL_LENGTH * 0.25, FREEBOARD, 0]"
          :scale="[1, MIZZEN_MAST_HEIGHT, 1]"
          :rotation="[0, 0, Math.PI * angle]"
      />
    </TresGroup>
    <!-- Hull Assembly -->
    <TresGroup>
      <!-- Main Hull -->
      <TresGroup>
        <!-- Main Hull and Keel -->
        <TresMesh
            :geometry="hullGeometry"
            :material="hullMaterial"
        />
        <TresMesh
            :geometry="keelGeometry"
            :material="keelMaterial"
            :position="[0, -DRAFT * 0.8, 0]"
            :rotation="[Math.PI/2, 0, 0]"
        />

        <!-- Deck Structures -->
        <TresMesh
            :geometry="deckHouseGeometry"
            :material="brightworkMaterial"
            :position="[0, FREEBOARD, -LOA * 0.1]"
        />

        <TresMesh
            :geometry="cockpitGeometry"
            :material="brightworkMaterial"
            :position="[0, FREEBOARD, LOA * 0.2]"
        />
      </TresGroup>

      <!-- Keel -->
      <TresMesh
          :geometry="keelGeometry"
          :material="keelMaterial"
          :position="[0, -DRAFT * 0.8, 0]"
          :rotation="[Math.PI/2, 0, 0]"
      />

      <!-- Deck -->
      <TresMesh
          :geometry="new BoxGeometry(BEAM * 0.8, 0.1, LOA * 0.8)"
          :material="brightworkMaterial"
          :position="[0, FREEBOARD + 0.05, 0]"
      />
    </TresGroup>

    <!-- Cabin and Cockpit -->
    <TresGroup :position="[0, FREEBOARD, 0]">
      <!-- Main Cabin -->
      <TresMesh
          :geometry="new BoxGeometry(BEAM * 0.6, 1.2, LOA * 0.3)"
          :material="brightworkMaterial"
          :position="[0, 0.6, -LOA * 0.1]"
      />

      <!-- Cockpit -->
      <TresMesh
          :geometry="new BoxGeometry(BEAM * 0.5, 0.8, LOA * 0.2)"
          :material="brightworkMaterial"
          :position="[0, 0.4, LOA * 0.2]"
      />
    </TresGroup>

    <!-- Masts -->
    <TresGroup>
      <!-- Main Mast -->
      <TresMesh
          :geometry="new CylinderGeometry(0.1, 0.15, LOA * 1.3, 16)"
          :material="brightworkMaterial"
          :position="[0, FREEBOARD + LOA * 0.65, -LOA * 0.1]"
      />

      <!-- Mizzen Mast -->
      <TresMesh
          :geometry="new CylinderGeometry(0.08, 0.12, LOA * 0.9, 16)"
          :material="brightworkMaterial"
          :position="[0, FREEBOARD + LOA * 0.45, LOA * 0.3]"
      />
    </TresGroup>

    <!-- Enhanced Sails -->
    <TresGroup>
      <!-- Main Sail -->
      <TresMesh
          :geometry="mainSailGeometry"
          :material="sailMaterial"
          :position="[0, FREEBOARD + 2, -LOA * 0.1]"
          :rotation="[0, Math.PI * 0.15, Math.PI * 0.02]"
      />

      <!-- Mizzen Sail -->
      <TresMesh
          :geometry="mizzenSailGeometry"
          :material="sailMaterial"
          :position="[0, FREEBOARD + 2, LOA * 0.3]"
          :rotation="[0, Math.PI * 0.12, Math.PI * 0.01]"
      />
    </TresGroup>

    <!-- Running Rigging -->
    <TresGroup>
      <template v-for="(line, index) in runningRigging" :key="index">
        <TresLine
            :points="line.points"
            :material="new MeshStandardMaterial({
          color: line.color,
          roughness: 0.4,
          metalness: 0.7
        })"
        />
      </template>
    </TresGroup>

    <!-- Add slide track on masts -->
    <TresGroup>
      <TresMesh
          v-for="pos in [
        { z: -LOA * 0.1, h: LOA * 1.2 }, // Main mast
        { z: LOA * 0.3, h: LOA * 0.8 }   // Mizzen mast
      ]"
          :key="pos.z"
          :geometry="new BoxGeometry(0.02, pos.h, 0.02)"
          :material="metalMaterial"
          :position="[0.06, FREEBOARD + pos.h/2, pos.z]"
      />
    </TresGroup>

    <!-- Running Rigging -->
    <TresGroup>
      <template v-for="(line, index) in runningRigging" :key="index">
        <TresLine
            :points="line.points"
            :material="new MeshStandardMaterial({
            color: line.color,
            roughness: 0.4,
            metalness: 0.7
          })"
        />
      </template>
    </TresGroup>

    <!-- Deck hardware -->
    <TresGroup :position="[0, FREEBOARD, 0]">
      <!-- Cleats -->
      <TresGroup>
        <TresMesh
            v-for="z in [-LOA * 0.4, -LOA * 0.2, 0, LOA * 0.2]"
            :key="z"
            :geometry="new BoxGeometry(0.15, 0.08, 0.3)"
            :material="metalMaterial"
            :position="[BEAM * 0.35, 0.04, z]"
        />
      </TresGroup>

      <!-- Winches -->
      <TresGroup>
        <TresMesh
            v-for="pos in [
            [-BEAM * 0.3, LOA * 0.15],
            [BEAM * 0.3, LOA * 0.15],
            [-BEAM * 0.3, -LOA * 0.15],
            [BEAM * 0.3, -LOA * 0.15]
          ]"
            :key="pos.join()"
            :geometry="new CylinderGeometry(0.1, 0.12, 0.2, 16)"
            :material="metalMaterial"
            :position="[pos[0], 0.1, pos[1]]"
        />
      </TresGroup>
    </TresGroup>
  </TresGroup>
</template>

<style scoped>
</style>