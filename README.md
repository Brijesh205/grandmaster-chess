# ♟️ Grandmaster Chess

An aesthetic, state-of-the-art Chess game built with **Node.js**, **HTML5**, and **CSS3**. Features a powerful **Minimax AI with Alpha-Beta Pruning**, real-time **multiplayer rooms via Socket.IO**, live **dynamic evaluation bar**, **FIDE chess rules engine**, and **Web Audio sound synthesis**.

![Grandmaster Chess Preview](https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

### 🎮 Game Modes
- **Play vs AI (Single Player)**: Play against a smart chess engine with 4 distinct skill levels:
  - **Level 1 (Novice ~800 ELO)**: Casual, forgiving, occasional blunders.
  - **Level 2 (Casual ~1200 ELO)**: Positional awareness and basic tactical vision.
  - **Level 3 (Club Player ~1600 ELO)**: Minimax with alpha-beta pruning & piece-square tables.
  - **Level 4 (Master ~2000 ELO)**: Deep search with quiescence search on captures, center control, and king safety.
- **Pass & Play (Local 2-Player)**: Play locally on the same computer/tablet with optional auto-flip board.
- **Online Multiplayer (Real-Time)**:
  - Create custom private rooms with shareable 6-digit codes.
  - Real-time move synchronization powered by **Socket.IO**.
  - In-game room chat.
  - Spectator support.

### 📐 Official FIDE Chess Rules
- **Pawn Special Moves**: 2-square initial move, en passant capture, pawn promotion selection dialog (Queen, Knight, Rook, Bishop).
- **Castling**: Kingside ($O-O$) and Queenside ($O-O-O$) with full checks validation (cannot castle out of, through, or into check).
- **Check & Checkmate**: Dramatic animated red radial pulse on the king square and game over banner.
- **Draw Conditions**: Stalemate, Insufficient Material ($K$ vs $K$, $K+B$ vs $K$, $K+N$ vs $K$, same-color bishop endings), 50-move rule, and Threefold Repetition detection.
- **Clocks & Time Controls**: Bullet (1m), Blitz (3+2), Rapid (10m), and Untimed with low-time warning pulsation ($< 30s$).

### 🧊 Full 3D WebGL Chess Mode (Three.js)
- **Interactive 3D Board**: Seamlessly switch between 2D and 3D view with one click on the "3D View" button.
- **3D Procedural Staunton Pieces**: Pure procedural geometries (Lathe & Extrusion) with zero external 3D file loading lag.
- **360° Free Camera Controls**: Left-click & drag to orbit, scroll to zoom, right-click to pan.
- **Camera Presets**: Instant camera snapping for White Perspective, Black Perspective, 3D Isometric Angle, and Overhead.
- **3D Move Highlights**: Glowing 3D indicator rings float above legal destination squares.
- **Realistic Lighting**: Studio key light with real-time soft shadows, ambient lighting, and rim highlights.

### 🎨 Visual & Audio Polish
- **Multiple Piece Styles**: Switch between **💎 Crystal Glass** (Optical Diamond & Smoked Obsidian), **Neo Modern**, **Woodcraft Artisanal**, and **Cyber Neon**.
- **4 Premium Board Themes**:
  - 🌿 *Emerald Tournament* (Classic chess club green & warm cream)
  - 🌌 *Midnight Slate* (Deep slate navy & ice silver)
  - 🪵 *Royal Walnut* (Polished walnut wood & maple)
  - ⚡ *Cyber Neon* (Obsidian dark & electric cyan/rose)
- **Live Dynamic Evaluation Bar**: Vertical real-time evaluation gauge calculating advantage dynamically.
- **Web Audio Sound Synthesizer**: Zero external MP3 file dependencies! Procedurally synthesizes authentic wooden piece clicks, capture snaps, check chimes, promotion fanfares, and castling slides using the Web Audio API.
- **PGN & FEN Tools**: One-click copy for FEN position strings and Standard Algebraic Notation (SAN) PGN game records.
- **Interactive Move Navigation**: Click any past move in the history table to review previous board states.

---

## 🚀 Quick Start Guide

### Option 1: Running with Node.js (Full Multiplayer & Dev Server)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. Open your browser at **[http://localhost:3000](http://localhost:3000)**.

### Option 2: Running Standalone (No Node installation needed for Single Player / Local)

Simply open `public/index.html` in any web browser (Chrome, Edge, Firefox, Safari). The game automatically detects offline mode and enables full Single Player (vs AI) and Pass & Play modes!

---

## 📁 Project Architecture

```
grandmaster-chess/
├── package.json               # Node.js project configuration and scripts
├── server.js                  # Express HTTP & Socket.IO multiplayer server
├── README.md                  # Documentation and guide
└── public/
    ├── index.html             # Semantic HTML5 chess interface
    ├── css/
    │   └── style.css          # Glassmorphic dark UI, themes, responsive CSS
    └── js/
        ├── pieces.js          # Vector SVG piece renderers
        ├── audio.js           # Procedural Web Audio API sound synthesizer
        ├── chess-engine.js    # FIDE rules, move generator, FEN & SAN parser
        ├── chess-ai.js        # Minimax, alpha-beta, quiescence & eval bar
        └── app.js             # Main game controller & socket client
```

---

## 🕹️ Controls & Shortcuts

| Action | Control |
|---|---|
| **Move Piece** | Click piece to select, then click destination, OR drag-and-drop piece |
| **Undo Move** | Click "Undo" button (available in vs AI & Local modes) |
| **Hint** | Click "Hint" to highlight the best engine move |
| **Flip Board** | Click "Flip" in the top navbar to reverse board perspective |
| **Mute Audio** | Click "Sound" in the top navbar to toggle sound effects |
| **Copy FEN / PGN** | Click "Copy FEN" or "Copy PGN" in the Move History panel |
