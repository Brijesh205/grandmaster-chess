// Grandmaster Chess - 3D WebGL Engine (Three.js)
// Natural Table Seated Perspective, Medium Studio Lighting, Wooden Table Environment,
// Scaled FIDE Staunton 3D pieces with soft shadows and no blowout.

class Chess3D {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('threeCanvasContainer');
    this.wrapper = document.getElementById('chess3DWrapper');
    this.board2DWrapper = document.getElementById('boardWrapper');

    this.active = false;
    this.initialized = false;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // 3D Objects
    this.boardGroup = null;
    this.tableGroup = null;
    this.squareMeshes = []; // 8x8 array of square meshes
    this.pieceMeshes = {};  // keyed by "r,c"
    this.legalRings = [];   // glowing 3D move indicator meshes
    this.selected3DPiece = null;
    this.hoveredSquare = null;

    // Raycasting
    this.raycaster = null;
    this.mouse = null;

    // Camera animation target
    this.cameraTargetPos = null;

    // Materials & Geometries cache
    this.materials = {};
    this.geometries = {};

    // Style Settings (Solid Opaque Pieces)
    this.currentStyle = (typeof getPieceStyle === 'function') ? getPieceStyle() : 'neo';
    this.glassEnvMap = null;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, 3D WebGL will use CSS 3D fallback.');
      return;
    }

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f18);

    // 2. Camera - Natural Table Seated View (Pitch ~50° down at board)
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(0, 22, 19);

    // 3. Renderer with ACESFilmic Tone Mapping (prevents white blowout)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls with Natural Table Orbit Limits
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.maxPolarAngle = Math.PI / 2.35; // Keeps camera above table level
      this.controls.minDistance = 12;
      this.controls.maxDistance = 42;
      this.controls.target.set(0, 0.5, 0); // Focus on center of chessboard
    }

    // 5. Medium Studio Lighting (balanced, soft, visible curves)
    this.setupLighting();

    // 6. Generate Procedural Studio Reflection Map for Crystal Facets
    this.glassEnvMap = this.createGlassEnvMap();

    // 7. Materials & Geometries
    this.initMaterials();
    this.initGeometries();

    // 8. Build Table and Chess Board
    this.buildTableAndBoard();

    // 9. Raycaster for 3D interactions
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupInteractionListeners();
    this.setupCameraPresets();
    this.setup3DStyleControls();

    window.addEventListener('resize', () => this.handleResize());

    this.initialized = true;

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // Balanced Medium Studio Lighting (Zero white clipping)
  setupLighting() {
    // 1. Soft Warm Ambient Fill Light (prevents pitch-black shadows)
    const ambientLight = new THREE.AmbientLight(0xfef3c7, 0.52);
    this.scene.add(ambientLight);

    // 2. Main Studio Directional Key Light with Soft Shadows
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 0.85);
    keyLight.position.set(10, 26, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 80;
    keyLight.shadow.camera.left = -16;
    keyLight.shadow.camera.right = 16;
    keyLight.shadow.camera.top = 16;
    keyLight.shadow.camera.bottom = -16;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 2.5;
    this.scene.add(keyLight);

    // 3. Subtle Cool Fill Light from opposite angle (adds contour depth)
    const fillLight = new THREE.DirectionalLight(0xb0c4de, 0.32);
    fillLight.position.set(-12, 18, -12);
    this.scene.add(fillLight);

    // 4. Overhead Table Lamp (Warm cozy point light over the center)
    const tableLamp = new THREE.PointLight(0xffedd5, 0.35, 45, 1.6);
    tableLamp.position.set(0, 16, 0);
    this.scene.add(tableLamp);

    // 5. Crystal Facet Sparkle Accent Lights (adds brilliant gleams to crystal cuts)
    const crystalSparkle1 = new THREE.PointLight(0xe0f2fe, 0.75, 40);
    crystalSparkle1.position.set(8, 14, 10);
    this.scene.add(crystalSparkle1);

    const crystalSparkle2 = new THREE.PointLight(0xfef08a, 0.5, 40);
    crystalSparkle2.position.set(-8, 12, -8);
    this.scene.add(crystalSparkle2);
  }

  // Procedural Studio Reflection Map for Crystal Facets
  createGlassEnvMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dark studio gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.2, '#64748b');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(0.8, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Studio softbox highlights for sparkling crystal facets
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(60, 40, 80, 80);
    ctx.fillRect(320, 50, 100, 70);
    ctx.fillRect(190, 120, 60, 40);

    // Rim lighting sparkles
    ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.fillRect(150, 30, 40, 50);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.fillRect(430, 40, 40, 50);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }

  // Solid Polished Jewel / Enamel Material Generator (100% Solid & Opaque, No Transparency!)
  createCrystalMaterial(config) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: config.color !== undefined ? config.color : 0x0284c7,
      transparent: false, // 100% Solid & Opaque (No transparency!)
      opacity: 1.0,       // Full opacity
      depthWrite: true,   // Full z-buffer depth writing
      depthTest: true,
      roughness: config.roughness !== undefined ? config.roughness : 0.12,
      metalness: config.metalness !== undefined ? config.metalness : 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: config.clearcoatRoughness !== undefined ? config.clearcoatRoughness : 0.06,
      ior: 1.52,
      reflectivity: 0.9,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(config.specularColor !== undefined ? config.specularColor : 0xffffff),
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.0,
      side: THREE.FrontSide
    });

    if (this.glassEnvMap) {
      mat.envMap = this.glassEnvMap;
      mat.envMapIntensity = 1.1;
    }

    return mat;
  }

  // Vibrant Solid Gemstone & Lacquer Materials (100% Solid & Opaque)
  applyCrystalMaterials(style = this.currentStyle) {
    if (style === 'emerald') {
      // Vivid Solid Emerald Green & Golden Amber
      this.materials.whitePiece = this.createCrystalMaterial({
        color: 0x059669,          // Rich Solid Emerald Green
        specularColor: 0xffffff,
        roughness: 0.12,
        metalness: 0.15
      });

      this.materials.blackPiece = this.createCrystalMaterial({
        color: 0xd97706,          // Rich Solid Golden Amber
        specularColor: 0xffffff,
        roughness: 0.12,
        metalness: 0.15
      });
    } else if (style === 'rainbow') {
      // Base fallbacks for Rainbow mode
      this.materials.whitePiece = this.createCrystalMaterial({
        color: 0x0284c7,
        specularColor: 0xffffff,
        roughness: 0.12,
        metalness: 0.15
      });
      this.materials.blackPiece = this.createCrystalMaterial({
        color: 0xe11d48,
        specularColor: 0xffffff,
        roughness: 0.12,
        metalness: 0.15
      });
    } else {
      // Default 'crystal' & 'cyber': Solid Electric Sapphire Blue & Fiery Ruby Red (Fully Solid & Opaque)
      this.materials.whitePiece = this.createCrystalMaterial({
        color: 0x0284c7,          // Rich Solid Electric Sapphire Blue
        specularColor: 0xffffff,  // Sparkling diamond facet glints
        roughness: 0.12,          // Ultra-smooth diamond polish
        metalness: 0.15
      });

      this.materials.blackPiece = this.createCrystalMaterial({
        color: 0xe11d48,          // Rich Solid Fiery Ruby Crimson
        specularColor: 0xffffff,  // Sparkling diamond facet glints
        roughness: 0.12,
        metalness: 0.15
      });
    }
  }

  initMaterials() {
    // 3D Board Tiles (Polished Reflective Tournament Green & Warm Buff)
    this.materials.tileLight = new THREE.MeshStandardMaterial({
      color: 0xede8d0, // Warm cream buff
      roughness: 0.28,
      metalness: 0.08
    });

    this.materials.tileDark = new THREE.MeshStandardMaterial({
      color: 0x608044, // Rich tournament emerald green
      roughness: 0.28,
      metalness: 0.08
    });

    // Chessboard Pedestal
    this.materials.boardPedestal = new THREE.MeshStandardMaterial({
      color: 0x24160e, // Polished dark walnut wood
      roughness: 0.45,
      metalness: 0.08
    });

    this.materials.goldTrim = new THREE.MeshStandardMaterial({
      color: 0xd4a359, // Gold / brass inlay
      roughness: 0.3,
      metalness: 0.65
    });

    // Realistic Wooden Table
    this.materials.tableWood = new THREE.MeshStandardMaterial({
      color: 0x3d2314, // Rich warm mahogany wood
      roughness: 0.48,
      metalness: 0.06
    });

    this.materials.tableInlay = new THREE.MeshStandardMaterial({
      color: 0xb8860b, // Brass inlay line on table
      roughness: 0.35,
      metalness: 0.55
    });

    // Room Floor (Soft dark parquet ambience)
    this.materials.roomFloor = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.8,
      metalness: 0.1
    });

    // Rainbow Gemstone Palette (Each piece type is an individual solid polished gemstone)
    const makeGem = (color, spec = 0xffffff) => {
      return this.createCrystalMaterial({
        color: color,
        specularColor: spec,
        roughness: 0.12,
        metalness: 0.15
      });
    };

    this.materials.rainbowPieces = {
      w: {
        k: makeGem(0xfbbf24, 0xffffff), // Golden Imperial Topaz King
        q: makeGem(0xa855f7, 0xffffff), // Royal Purple Amethyst Queen
        r: makeGem(0xef4444, 0xffffff), // Fiery Ruby Rooks
        b: makeGem(0x0ea5e9, 0xffffff), // Ocean Sapphire Bishops
        n: makeGem(0x10b981, 0xffffff), // Emerald Jade Knights
        p: makeGem(0x06b6d4, 0xffffff)  // Aquamarine Pawns
      },
      b: {
        k: makeGem(0xf59e0b, 0xffffff), // Sunburst Citrine King
        q: makeGem(0xec4899, 0xffffff), // Vivid Rose Tourmaline Queen
        r: makeGem(0xd946ef, 0xffffff), // Radiant Orchid Amethyst Rooks
        b: makeGem(0x6366f1, 0xffffff), // Deep Indigo Tanzanite Bishops
        n: makeGem(0x14b8a6, 0xffffff), // Teal Turquoise Knights
        p: makeGem(0xf43f5e, 0xffffff)  // Crimson Garnet Pawns
      }
    };

    // Pieces: Initialize with current piece style
    this.setMaterialStyle(this.currentStyle);

    // Move Indicator Ring (Glowing Emerald)
    this.materials.moveRing = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.8
    });

    // Capture Indicator Ring (Glowing Crimson)
    this.materials.captureRing = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.85
    });
  }

  // Correctly Scaled FIDE Staunton Piece Geometries
  // Tile is 1.45. Pieces have base radius 0.42 - 0.54 (diameter 0.84 - 1.08, ~70% square occupancy).
  initGeometries() {
    const makeLathe = (pointsData) => {
      const pts = pointsData.map(([x, y]) => new THREE.Vector2(x, y));
      return new THREE.LatheGeometry(pts, 32);
    };

    // 1. Pawn (Base radius: 0.42, Height: 1.35)
    this.geometries.p = makeLathe([
      [0, 0], [0.42, 0], [0.42, 0.08], [0.36, 0.15], [0.3, 0.25],
      [0.17, 0.55], [0.14, 0.85], [0.22, 0.92], [0.16, 0.98],
      [0.26, 1.15], [0.22, 1.35], [0, 1.35]
    ]);

    // 2. Rook (Base radius: 0.48, Height: 1.65)
    this.geometries.r = makeLathe([
      [0, 0], [0.48, 0], [0.48, 0.1], [0.42, 0.18], [0.34, 0.3],
      [0.26, 0.7], [0.25, 1.1], [0.34, 1.25], [0.38, 1.5],
      [0.32, 1.5], [0.32, 1.65], [0.26, 1.65], [0, 1.65]
    ]);

    // 3. Bishop (Base radius: 0.48, Height: 2.05)
    this.geometries.b = makeLathe([
      [0, 0], [0.48, 0], [0.48, 0.1], [0.42, 0.18], [0.34, 0.3],
      [0.22, 0.75], [0.2, 1.1], [0.32, 1.25], [0.33, 1.5],
      [0.26, 1.75], [0.08, 1.95], [0.11, 2.05], [0, 2.08]
    ]);

    // 4. Queen (Base radius: 0.52, Height: 2.3)
    this.geometries.q = makeLathe([
      [0, 0], [0.52, 0], [0.52, 0.12], [0.45, 0.2], [0.36, 0.32],
      [0.25, 0.8], [0.22, 1.3], [0.36, 1.5], [0.42, 1.9],
      [0.32, 2.05], [0.1, 2.18], [0.14, 2.3], [0, 2.3]
    ]);

    // 5. King (Base radius: 0.54, Body height: 2.38 + Cross: 0.52 = 2.9)
    this.geometries.k = makeLathe([
      [0, 0], [0.54, 0], [0.54, 0.12], [0.47, 0.22], [0.38, 0.35],
      [0.26, 0.9], [0.24, 1.4], [0.38, 1.7], [0.43, 2.1],
      [0.34, 2.25], [0.18, 2.38], [0, 2.38]
    ]);

    // King 3D Cross Attachment
    const crossShape = new THREE.Shape();
    crossShape.moveTo(-0.06, 0);
    crossShape.lineTo(-0.06, 0.32);
    crossShape.lineTo(-0.18, 0.32);
    crossShape.lineTo(-0.18, 0.44);
    crossShape.lineTo(-0.06, 0.44);
    crossShape.lineTo(-0.06, 0.58);
    crossShape.lineTo(0.06, 0.58);
    crossShape.lineTo(0.06, 0.44);
    crossShape.lineTo(0.18, 0.44);
    crossShape.lineTo(0.18, 0.32);
    crossShape.lineTo(0.06, 0.32);
    crossShape.lineTo(0.06, 0);
    crossShape.closePath();
    this.geometries.kingCross = new THREE.ExtrudeGeometry(crossShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015 });

    // 6. Knight (Base radius: 0.48, Scaled horse head)
    this.geometries.knightBase = makeLathe([
      [0, 0], [0.48, 0], [0.48, 0.1], [0.42, 0.18], [0.35, 0.28], [0.32, 0.45], [0, 0.45]
    ]);

    const horseShape = new THREE.Shape();
    horseShape.moveTo(-0.3, 0);
    horseShape.lineTo(0.3, 0);
    horseShape.lineTo(0.32, 0.6);
    horseShape.lineTo(0.18, 1.2);
    horseShape.lineTo(0.22, 1.45); // ear
    horseShape.lineTo(0.13, 1.3);
    horseShape.lineTo(0.04, 1.15);
    horseShape.lineTo(-0.21, 1.05); // snout
    horseShape.lineTo(-0.3, 0.8);  // chin
    horseShape.lineTo(-0.12, 0.65); // neck curve
    horseShape.lineTo(-0.26, 0.25);
    horseShape.closePath();

    this.geometries.n = new THREE.ExtrudeGeometry(horseShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelThickness: 0.04,
      bevelSize: 0.03
    });
    this.geometries.n.center();

    // 3D Move Landing Rings
    this.geometries.moveRing = new THREE.RingGeometry(0.15, 0.32, 32);
    this.geometries.moveRing.rotateX(-Math.PI / 2);

    this.geometries.captureRing = new THREE.RingGeometry(0.48, 0.62, 32);
    this.geometries.captureRing.rotateX(-Math.PI / 2);
  }

  // Builds the Chessboard on top of a Wooden Table
  buildTableAndBoard() {
    this.tableGroup = new THREE.Group();
    this.scene.add(this.tableGroup);

    // 1. Room Floor Plane Underneath
    const floorGeo = new THREE.PlaneGeometry(90, 90);
    const floorMesh = new THREE.Mesh(floorGeo, this.materials.roomFloor);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -14.5;
    floorMesh.receiveShadow = true;
    this.tableGroup.add(floorMesh);

    // 2. Wooden Table Top Surface (25 x 25 units)
    const tableTopGeo = new THREE.BoxGeometry(26, 0.8, 26);
    const tableTopMesh = new THREE.Mesh(tableTopGeo, this.materials.tableWood);
    tableTopMesh.position.y = -0.85;
    tableTopMesh.receiveShadow = true;
    this.tableGroup.add(tableTopMesh);

    // 3. Gold/Brass Table Inlay Border
    const tableInlayGeo = new THREE.BoxGeometry(26.15, 0.06, 26.15);
    const tableInlayMesh = new THREE.Mesh(tableInlayGeo, this.materials.tableInlay);
    tableInlayMesh.position.y = -0.55;
    this.tableGroup.add(tableInlayMesh);

    // 4. Four Wooden Table Legs
    const legGeo = new THREE.CylinderGeometry(0.55, 0.38, 13.5, 16);
    const legPositions = [
      [-11, -7.6, -11],
      [11, -7.6, -11],
      [-11, -7.6, 11],
      [11, -7.6, 11]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.materials.tableWood);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      leg.receiveShadow = true;
      this.tableGroup.add(leg);
    });

    // 5. Chessboard Pedestal (Dark Walnut Base sitting on the table)
    this.boardGroup = new THREE.Group();
    this.scene.add(this.boardGroup);

    const baseGeo = new THREE.BoxGeometry(13.2, 0.7, 13.2);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.boardPedestal);
    baseMesh.position.y = -0.38;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    this.boardGroup.add(baseMesh);

    // Gold Pedestal Trim
    const trimGeo = new THREE.BoxGeometry(13.35, 0.08, 13.35);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.goldTrim);
    trimMesh.position.y = -0.04;
    this.boardGroup.add(trimMesh);

    // 6. 64 Individual 3D Board Squares
    // Coordinate mapping: r = 0..7 (rank 8 to 1), c = 0..7 (file a to h)
    this.squareMeshes = Array(8).fill(null).map(() => Array(8).fill(null));
    const tileSize = 1.45;
    const tileGeo = new THREE.BoxGeometry(tileSize - 0.02, 0.12, tileSize - 0.02);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        const mat = isLight ? this.materials.tileLight.clone() : this.materials.tileDark.clone();

        const square = new THREE.Mesh(tileGeo, mat);
        const x = (c - 3.5) * tileSize;
        const z = (r - 3.5) * tileSize;

        square.position.set(x, 0.06, z);
        square.receiveShadow = true;
        square.userData = { r, c, defaultColor: mat.color.getHex() };

        this.boardGroup.add(square);
        this.squareMeshes[r][c] = square;
      }
    }
  }

  // Convert board coordinate (r, c) to 3D world (x, y, z)
  coordsToWorld(r, c) {
    const tileSize = 1.45;
    const x = (c - 3.5) * tileSize;
    const z = (r - 3.5) * tileSize;
    return new THREE.Vector3(x, 0.12, z);
  }

  // --- 3D Pieces Rendering & Synchronization ---
  syncFromEngine(engine) {
    if (!this.initialized) return;

    // Clear existing piece meshes
    for (const key in this.pieceMeshes) {
      const mesh = this.pieceMeshes[key];
      this.scene.remove(mesh);
    }
    this.pieceMeshes = {};
    this.clearLegalRings();

    // Spawn 3D pieces based on engine state
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = engine.board[r][c];
        if (!piece) continue;

        const pieceMesh = this.createPieceMesh(piece.color, piece.type);
        const worldPos = this.coordsToWorld(r, c);
        pieceMesh.position.copy(worldPos);

        // Orient Knights towards opponent
        if (piece.type === 'n') {
          pieceMesh.rotation.y = piece.color === 'w' ? 0 : Math.PI;
        }

        pieceMesh.userData = { r, c, color: piece.color, type: piece.type };
        this.scene.add(pieceMesh);
        this.pieceMeshes[`${r},${c}`] = pieceMesh;
      }
    }
  }

  createPieceMesh(color, type) {
    let mat = color === 'w' ? this.materials.whitePiece : this.materials.blackPiece;
    if (this.currentStyle === 'rainbow' && this.materials.rainbowPieces && this.materials.rainbowPieces[color]) {
      mat = this.materials.rainbowPieces[color][type] || mat;
    }

    const group = new THREE.Group();

    if (type === 'n') {
      // Knight composite: Lathe base + Extruded horse head
      const baseMesh = new THREE.Mesh(this.geometries.knightBase, mat);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      const headMesh = new THREE.Mesh(this.geometries.n, mat);
      headMesh.position.set(0, 0.95, 0);
      headMesh.castShadow = true;
      headMesh.receiveShadow = true;
      group.add(headMesh);
    } else if (type === 'k') {
      // King composite: Lathe body + 3D Cross on top
      const bodyMesh = new THREE.Mesh(this.geometries.k, mat);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      group.add(bodyMesh);

      const crossMesh = new THREE.Mesh(this.geometries.kingCross, mat);
      crossMesh.position.set(0, 2.38, -0.04);
      crossMesh.castShadow = true;
      crossMesh.receiveShadow = true;
      group.add(crossMesh);
    } else {
      // Single Lathe Piece (Pawn, Rook, Bishop, Queen)
      const geo = this.geometries[type] || this.geometries.p;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }

    // Ensure all solid piece meshes cast dynamic shadows
    group.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return group;
  }

  // --- Interaction: 3D Raycasting, Click to Select & Move ---
  setupInteractionListeners() {
    const canvas = this.renderer.domElement;

    // Mouse Move (hover highlight)
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.handleHover();
    });

    // Mouse Click (selection and move execution)
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.handleClick();
    });
  }

  handleHover() {
    if (!this.active || !this.raycaster) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const squareObjects = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        squareObjects.push(this.squareMeshes[r][c]);
      }
    }

    const intersects = this.raycaster.intersectObjects(squareObjects);
    if (intersects.length > 0) {
      const target = intersects[0].object;
      if (this.hoveredSquare && this.hoveredSquare !== target) {
        this.hoveredSquare.material.emissive.setHex(0x000000);
      }
      this.hoveredSquare = target;
      target.material.emissive.setHex(0x1e293b);
    } else if (this.hoveredSquare) {
      this.hoveredSquare.material.emissive.setHex(0x000000);
      this.hoveredSquare = null;
    }
  }

  handleClick() {
    if (!this.active || !this.raycaster) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const squareObjects = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        squareObjects.push(this.squareMeshes[r][c]);
      }
    }

    const intersects = this.raycaster.intersectObjects(squareObjects);
    if (intersects.length === 0) return;

    const clickedSquare = intersects[0].object;
    const { r, c } = clickedSquare.userData;

    // Check if player clicked a destination for selected piece
    if (this.selected3DPiece) {
      const from = { r: this.selected3DPiece.r, c: this.selected3DPiece.c };
      const to = { r, c };

      if (from.r === to.r && from.c === to.c) {
        this.deselectPiece();
        return;
      }

      // Check if move is legal
      const legalMoves = this.app.engine.getLegalMoves(from);
      const isLegal = legalMoves.some(m => m.to.r === to.r && m.to.c === to.c);

      if (isLegal) {
        this.deselectPiece();
        this.app.attemptMove(from, to);
        return;
      }
    }

    // Try selecting piece on clicked square
    const piece = this.app.engine.board[r][c];
    if (piece && this.app.canPlayerMove(piece.color)) {
      this.selectPiece(r, c);
    } else {
      this.deselectPiece();
    }
  }

  selectPiece(r, c) {
    this.deselectPiece();

    const mesh = this.pieceMeshes[`${r},${c}`];
    if (!mesh) return;

    this.selected3DPiece = { r, c, mesh, origY: mesh.position.y };
    mesh.position.y += 0.4; // Soft lift in 3D

    // Render glowing 3D legal move rings on valid squares
    const legalMoves = this.app.engine.getLegalMoves({ r, c });
    this.showLegalRings(legalMoves);
  }

  deselectPiece() {
    if (this.selected3DPiece) {
      this.selected3DPiece.mesh.position.y = this.selected3DPiece.origY;
      this.selected3DPiece = null;
    }
    this.clearLegalRings();
  }

  showLegalRings(moves) {
    this.clearLegalRings();

    moves.forEach(m => {
      const isCapture = !!this.app.engine.board[m.to.r][m.to.c] || m.isEnPassant;
      const geo = isCapture ? this.geometries.captureRing : this.geometries.moveRing;
      const mat = isCapture ? this.materials.captureRing : this.materials.moveRing;

      const ring = new THREE.Mesh(geo, mat);
      const worldPos = this.coordsToWorld(m.to.r, m.to.c);
      ring.position.set(worldPos.x, 0.13, worldPos.z);
      this.scene.add(ring);
      this.legalRings.push(ring);
    });
  }

  clearLegalRings() {
    this.legalRings.forEach(r => this.scene.remove(r));
    this.legalRings = [];
  }

  // --- Natural Table Camera Presets ---
  setupCameraPresets() {
    const presets = [
      { id: 'btnCamWhite', pos: [0, 22, 19] },
      { id: 'btnCamBlack', pos: [0, 22, -19] },
      { id: 'btnCamAngle', pos: [16, 21, 16] },
      { id: 'btnCamTop', pos: [0, 28, 0.1] },
      { id: 'btnCamReset', pos: [0, 22, 19], target: [0, 0.5, 0] }
    ];

    presets.forEach(({ id, pos, target }) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-3d-cam').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setCameraTarget(pos[0], pos[1], pos[2]);
        if (target && this.controls) {
          this.controls.target.set(target[0], target[1], target[2]);
        }
      });
    });
  }

  setCameraPreset(name) {
    const camMap = {
      reset: { pos: [0, 22, 19], target: [0, 0.5, 0], id: 'btnCamReset' },
      white: { pos: [0, 22, 19], target: [0, 0.5, 0], id: 'btnCamWhite' },
      black: { pos: [0, 22, -19], target: [0, 0.5, 0], id: 'btnCamBlack' },
      angle: { pos: [16, 21, 16], target: [0, 0.5, 0], id: 'btnCamAngle' },
      top: { pos: [0, 28, 0.1], target: [0, 0.5, 0], id: 'btnCamTop' }
    };
    const c = camMap[name] || camMap.reset;
    document.querySelectorAll('.btn-3d-cam').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(c.id);
    if (activeBtn) activeBtn.classList.add('active');

    this.setCameraTarget(c.pos[0], c.pos[1], c.pos[2]);
    if (this.controls && c.target) {
      this.controls.target.set(c.target[0], c.target[1], c.target[2]);
    }
  }

  setCameraTarget(x, y, z) {
    this.cameraTargetPos = new THREE.Vector3(x, y, z);
  }

  // --- Animation & Render Loop ---
  animate() {
    requestAnimationFrame(this.animate);

    if (!this.active) return;

    // Smooth camera transition when preset clicked
    if (this.cameraTargetPos) {
      this.camera.position.lerp(this.cameraTargetPos, 0.08);
      if (this.camera.position.distanceTo(this.cameraTargetPos) < 0.1) {
        this.cameraTargetPos = null;
      }
    }

    // Pulse legal move rings
    if (this.legalRings.length > 0) {
      const t = Date.now() * 0.005;
      const s = 1 + Math.sin(t) * 0.08;
      this.legalRings.forEach(ring => ring.scale.set(s, s, s));
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    if (!this.renderer || !this.camera || !this.wrapper) return;
    const width = this.wrapper.clientWidth || 600;
    const height = this.wrapper.clientHeight || 600;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setMaterialStyle(styleName) {
    this.currentStyle = styleName || 'neo';

    if (this.currentStyle === 'wood') {
      this.materials.whitePiece = new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.45,
        metalness: 0.05
      });
      this.materials.blackPiece = new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.42,
        metalness: 0.08
      });
    } else if (this.currentStyle === 'neo') {
      this.materials.whitePiece = new THREE.MeshPhysicalMaterial({
        color: 0xf8fafc,
        roughness: 0.22,
        metalness: 0.06,
        clearcoat: 0.7,
        clearcoatRoughness: 0.08,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
      this.materials.blackPiece = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        roughness: 0.2,
        metalness: 0.12,
        clearcoat: 0.7,
        clearcoatRoughness: 0.08,
        transparent: false,
        opacity: 1.0,
        depthWrite: true
      });
    } else if (this.currentStyle === 'emerald') {
      // Solid Emerald & Golden Amber
      this.applyCrystalMaterials('emerald');
    } else if (this.currentStyle === 'rainbow') {
      // Solid Multi-gem Gemstone Army
      this.applyCrystalMaterials('rainbow');
    } else {
      // Default: Solid Sapphire Blue & Fiery Ruby Red
      this.applyCrystalMaterials('crystal');
    }

    // Sync UI pill buttons
    this.syncStylePillButtons(this.currentStyle);

    if (this.app && this.app.engine) {
      this.syncFromEngine(this.app.engine);
    }
  }

  // Bind 3D floating bar style buttons
  setup3DStyleControls() {
    const styleMap = [
      { id: 'btnStyleCrystal', style: 'crystal' },
      { id: 'btnStyleEmerald', style: 'emerald' },
      { id: 'btnStyleRainbow', style: 'rainbow' },
      { id: 'btnStyleNeo', style: 'neo' },
      { id: 'btnStyleWood', style: 'wood' }
    ];

    styleMap.forEach(({ id, style }) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (typeof setPieceStyle === 'function') {
          setPieceStyle(style);
        }
        const select = document.getElementById('pieceStyleSelect');
        if (select) select.value = style;
        this.setMaterialStyle(style);
      });
    });
  }

  syncStylePillButtons(styleName) {
    document.querySelectorAll('#controls3DTopOverlay .btn-3d-pill').forEach(b => b.classList.remove('active'));
    const btnMap = {
      crystal: 'btnStyleCrystal',
      emerald: 'btnStyleEmerald',
      rainbow: 'btnStyleRainbow',
      cyber: 'btnStyleCrystal',
      neo: 'btnStyleNeo',
      wood: 'btnStyleWood'
    };
    const targetBtn = document.getElementById(btnMap[styleName] || 'btnStyleNeo');
    if (targetBtn) targetBtn.classList.add('active');
  }

  // --- Toggle 2D / 3D Mode ---
  toggleView(enable3D) {
    this.active = enable3D !== undefined ? enable3D : !this.active;

    if (this.active) {
      this.board2DWrapper.style.display = 'none';
      this.wrapper.style.display = 'flex';
      this.handleResize();
      if (typeof getPieceStyle === 'function') {
        this.setMaterialStyle(getPieceStyle());
      } else {
        this.syncFromEngine(this.app.engine);
      }

      // Auto position camera to natural table seated view based on player orientation
      if (this.app.boardOrientation === 'b') {
        this.camera.position.set(0, 22, -19);
      } else {
        this.camera.position.set(0, 22, 19);
      }
      if (this.controls) this.controls.target.set(0, 0.5, 0);
    } else {
      this.wrapper.style.display = 'none';
      this.board2DWrapper.style.display = 'flex';
      this.app.render();
    }

    return this.active;
  }
}

window.Chess3D = Chess3D;
