// Grandmaster Chess - Main Client Controller
// Handles UI rendering, interactions, timers, AI moves, sounds, and multiplayer sync.

class ChessApp {
  constructor() {
    this.engine = new ChessEngine();
    this.ai = new ChessAI();
    this.audio = window.chessAudio;

    // Game Mode & Settings
    this.gameMode = 'ai'; // 'ai' | 'local' | 'online'
    this.aiDifficulty = 3; // 1: Novice, 2: Casual, 3: Club, 4: Master
    this.playerColor = 'w'; // 'w' | 'b' | 'random'
    this.boardOrientation = 'w'; // 'w' or 'b' at bottom
    this.autoFlipLocal = false;

    // Time Control Settings (in seconds)
    this.initialTime = 600; // 10 minutes default
    this.increment = 0;
    this.timers = { w: 600, b: 600 };
    this.clockInterval = null;
    this.clockRunning = false;

    // Selection & Drag State
    this.selectedSquare = null;
    this.legalMovesFromSelected = [];
    this.draggedPiece = null;
    this.dragGhost = null;
    this.isDragging = false;
    this.pendingPromotion = null; // { from, to }

    // Hint & Review
    this.activeHint = null;
    this.viewingHistoryIndex = -1; // -1 means viewing live position

    // Online Multiplayer
    this.socket = null;
    this.roomCode = null;
    // 3D View State
    this.is3D = false;
    this.chess3D = null;

    this.initDOM();
    this.initSocket();
    this.initEventListeners();
    this.startNewGame();
  }

  initDOM() {
    this.boardEl = document.getElementById('chessBoard');
    this.boardWrapper = document.getElementById('boardWrapper');

    // Initialize 3D Engine
    if (typeof Chess3D !== 'undefined') {
      try {
        this.chess3D = new Chess3D(this);
      } catch (e) {
        console.warn('Could not initialize 3D WebGL engine:', e);
      }
    }

    // Clocks & Player Cards
    this.topClockEl = document.getElementById('topClock');
    this.bottomClockEl = document.getElementById('bottomClock');
    this.topPlayerCard = document.getElementById('topPlayerCard');
    this.bottomPlayerCard = document.getElementById('bottomPlayerCard');
    this.topPlayerName = document.getElementById('topPlayerName');
    this.bottomPlayerName = document.getElementById('bottomPlayerName');
    this.topPlayerAvatar = document.getElementById('topPlayerAvatar');
    this.bottomPlayerAvatar = document.getElementById('bottomPlayerAvatar');
    this.topPlayerBadge = document.getElementById('topPlayerBadge');
    this.bottomPlayerBadge = document.getElementById('bottomPlayerBadge');
    this.topCapturedRack = document.getElementById('topCapturedRack');
    this.bottomCapturedRack = document.getElementById('bottomCapturedRack');
    this.topMaterialDiff = document.getElementById('topMaterialDiff');
    this.bottomMaterialDiff = document.getElementById('bottomMaterialDiff');

    // Eval Bar
    this.evalBarBlack = document.getElementById('evalBarBlack');
    this.evalBarScore = document.getElementById('evalBarScore');

    // Moves List
    this.movesListEl = document.getElementById('movesList');
    this.movesTableContainer = document.getElementById('movesTableContainer');

    // Modals
    this.promotionModal = document.getElementById('promotionModal');
    this.promoPiecesGrid = document.getElementById('promoPiecesGrid');
    this.gameOverModal = document.getElementById('gameOverModal');
    this.gameOverTitle = document.getElementById('gameOverTitle');
    this.gameOverDesc = document.getElementById('gameOverDesc');
    this.toastContainer = document.getElementById('toastContainer');
  }

  initSocket() {
    if (typeof io !== 'undefined' && !window.__socketIoUnavailable) {
      try {
        this.socket = io();

        this.socket.on('connect', () => {
          console.log('Connected to Chess Multiplayer server');
        });

        this.socket.on('room_created', (data) => {
          this.roomCode = data.roomCode;
          this.onlineRole = data.role; // 'w'
          this.setupOnlineRoomUI();
          this.showToast(`Room created: ${this.roomCode}. Waiting for opponent...`);
        });

        this.socket.on('room_joined', (data) => {
          this.roomCode = data.roomCode;
          this.onlineRole = data.role;
          this.setupOnlineRoomUI();
          this.showToast(`Joined room: ${this.roomCode} as ${data.role === 'w' ? 'White' : data.role === 'b' ? 'Black' : 'Spectator'}`);
        });

        this.socket.on('game_start', (data) => {
          this.showToast('Game Started! Good luck.');
          this.engine.reset();
          if (data.initialTime) {
            this.initialTime = data.initialTime;
            this.increment = data.increment || 0;
            this.timers = { w: this.initialTime, b: this.initialTime };
          }
          this.boardOrientation = this.onlineRole === 'b' ? 'b' : 'w';
          this.startClocks();
          this.render();
        });

        this.socket.on('opponent_move', (data) => {
          const moveResult = this.engine.makeMove(data.move);
          if (moveResult) {
            this.handleMoveAudioAndEffects(moveResult);
            if (data.timers) {
              this.timers = data.timers;
            }
            this.render();
            this.checkGameStatus();
          }
        });

        this.socket.on('chat_broadcast', (msg) => {
          this.appendChatMessage(msg.sender, msg.text, msg.isSelf);
        });

        this.socket.on('player_disconnected', () => {
          this.showToast('Opponent disconnected.');
        });

        this.socket.on('error_msg', (msg) => {
          this.showToast(msg);
        });
      } catch (err) {
        console.warn('Socket.IO connection failed, running offline mode:', err);
      }
    }
  }

  initEventListeners() {
    // Mode switcher tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(targetTab)?.classList.add('active');

        if (targetTab === 'tab-ai') {
          this.gameMode = 'ai';
          document.getElementById('appModeBadge').textContent = 'VS AI';
        } else if (targetTab === 'tab-local') {
          this.gameMode = 'local';
          document.getElementById('appModeBadge').textContent = 'PASS & PLAY';
        } else if (targetTab === 'tab-online') {
          this.gameMode = 'online';
          document.getElementById('appModeBadge').textContent = 'ONLINE ROOM';
        }
        this.updatePlayerCardsHeader();
      });
    });

    // Theme selector (Navbar)
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }

    // Piece Style selector (Navbar)
    const pieceStyleSelect = document.getElementById('pieceStyleSelect');
    if (pieceStyleSelect) {
      if (typeof getPieceStyle === 'function') {
        pieceStyleSelect.value = getPieceStyle();
      }
      pieceStyleSelect.addEventListener('change', (e) => {
        this.setPieceStyleOption(e.target.value);
      });
    }

    // Audio Mute Toggle (Navbar)
    const btnSoundToggle = document.getElementById('btnSoundToggle');
    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        this.toggleSoundOption();
      });
    }

    // 2D / 3D Mode Toggle (Navbar)
    const btnToggle3D = document.getElementById('btnToggle3D');
    if (btnToggle3D) {
      btnToggle3D.addEventListener('click', () => {
        this.toggle3DView();
      });
    }

    // Flip Board Button (Navbar)
    document.getElementById('btnFlipBoard')?.addEventListener('click', () => {
      this.flipBoard();
    });

    // Setup Sidebar Board & Display Options
    this.setupSidebarOptions();

    // Setup Move To Navigation Controls
    this.setupMoveToNavigation();

    // AI Difficulty buttons
    document.querySelectorAll('#aiLevelGroup .option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#aiLevelGroup .option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.aiDifficulty = parseInt(btn.getAttribute('data-level'), 10);
        this.updatePlayerCardsHeader();
        this.showToast(`AI Difficulty set to Level ${this.aiDifficulty}`);
      });
    });

    // Play As Side buttons (Immediate match start & AI move if Black)
    document.querySelectorAll('#sideSelectGroup .side-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#sideSelectGroup .side-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.playerColor = btn.getAttribute('data-side');
        this.startNewGame();
        const sideName = this.playerColor === 'w' ? 'White' : (this.playerColor === 'b' ? 'Black' : 'Random');
        this.showToast(`Starting new match playing as ${sideName}${this.playerColor === 'b' ? '. AI makes opening move.' : ''}`);
      });
    });

    // Time Control buttons
    document.querySelectorAll('#timeControlGroup .option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#timeControlGroup .option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.initialTime = parseInt(btn.getAttribute('data-time'), 10);
        this.increment = parseInt(btn.getAttribute('data-inc'), 10);
        this.timers = { w: this.initialTime, b: this.initialTime };
        this.updateClockDisplays();
      });
    });

    // In-Game Action Buttons
    document.getElementById('btnNewGame').addEventListener('click', () => {
      this.startNewGame();
    });

    document.getElementById('btnUndoMove').addEventListener('click', () => {
      this.handleUndo();
    });

    document.getElementById('btnHint').addEventListener('click', () => {
      this.showBestMoveHint();
    });

    document.getElementById('btnResign').addEventListener('click', () => {
      this.handleResign();
    });

    // Notation actions (Copy FEN / PGN)
    document.getElementById('btnCopyFen').addEventListener('click', () => {
      const fen = this.engine.generateFen();
      navigator.clipboard?.writeText(fen);
      this.showToast('FEN copied to clipboard!');
    });

    document.getElementById('btnCopyPgn').addEventListener('click', () => {
      const pgn = this.engine.exportPGN();
      navigator.clipboard?.writeText(pgn);
      this.showToast('PGN copied to clipboard!');
    });

    // Online Room Actions
    document.getElementById('btnCreateRoom')?.addEventListener('click', () => {
      if (!this.socket) {
        this.showToast('Multiplayer server not active. Please start server via "npm start"');
        return;
      }
      this.socket.emit('create_room', {
        initialTime: this.initialTime,
        increment: this.increment
      });
    });

    document.getElementById('btnJoinRoom')?.addEventListener('click', () => {
      const code = document.getElementById('roomCodeInput').value.trim().toUpperCase();
      if (!code) {
        this.showToast('Please enter a room code');
        return;
      }
      if (!this.socket) {
        this.showToast('Multiplayer server not active. Please start server via "npm start"');
        return;
      }
      this.socket.emit('join_room', { roomCode: code });
    });

    document.getElementById('btnCopyRoomLink')?.addEventListener('click', () => {
      if (!this.roomCode) return;
      const shareUrl = `${window.location.origin}?room=${this.roomCode}`;
      navigator.clipboard?.writeText(shareUrl);
      this.showToast('Room link copied to clipboard!');
    });

    // Chat Form
    document.getElementById('chatForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text || !this.socket || !this.roomCode) return;

      this.socket.emit('chat_message', { roomCode: this.roomCode, text });
      this.appendChatMessage('You', text, true);
      input.value = '';
    });

    // Modals
    document.getElementById('btnModalNewGame')?.addEventListener('click', () => {
      this.gameOverModal.classList.remove('open');
      this.startNewGame();
    });

    document.getElementById('btnModalClose')?.addEventListener('click', () => {
      this.gameOverModal.classList.remove('open');
    });

    // Check URL parameters for direct room joining (?room=ABCD)
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      document.querySelector('.tab-btn[data-tab="tab-online"]')?.click();
      document.getElementById('roomCodeInput').value = roomParam;
      setTimeout(() => {
        document.getElementById('btnJoinRoom')?.click();
      }, 500);
    }
  }

  startNewGame() {
    this.engine.reset();
    this.selectedSquare = null;
    this.legalMovesFromSelected = [];
    this.activeHint = null;
    this.viewingHistoryIndex = -1;
    this.stopClocks();

    // Determine colors
    if (this.gameMode === 'ai') {
      let chosen = this.playerColor;
      if (chosen === 'random') {
        chosen = Math.random() < 0.5 ? 'w' : 'b';
      }
      this.boardOrientation = chosen;
    } else {
      this.boardOrientation = 'w';
    }

    // Reset Clocks
    this.timers = { w: this.initialTime, b: this.initialTime };
    this.updateClockDisplays();
    if (this.initialTime > 0) {
      this.startClocks();
    }

    this.updatePlayerCardsHeader();
    this.render();
    this.updateMoveNavButtons();

    // Sync 3D perspective to player side
    if (this.is3D && this.chess3D) {
      if (this.boardOrientation === 'b') {
        this.chess3D.setCameraTarget(0, 22, -19);
      } else {
        this.chess3D.setCameraTarget(0, 22, 19);
      }
      this.chess3D.syncFromEngine(this.engine);
    }

    // If AI is playing White, trigger first move
    if (this.gameMode === 'ai' && this.boardOrientation === 'b') {
      setTimeout(() => this.triggerAIMove(), 500);
    }
  }

  updatePlayerCardsHeader() {
    const isOrientationWhite = this.boardOrientation === 'w';

    if (this.gameMode === 'ai') {
      const aiLvlNames = { 1: 'Novice (800)', 2: 'Casual (1200)', 3: 'Club (1600)', 4: 'Master (2000)' };
      if (isOrientationWhite) {
        this.bottomPlayerName.textContent = 'You (White)';
        this.bottomPlayerBadge.textContent = 'HUMAN';
        this.bottomPlayerAvatar.textContent = '👤';

        this.topPlayerName.textContent = 'Stockfish AI';
        this.topPlayerBadge.textContent = `LVL ${this.aiDifficulty}`;
        this.topPlayerAvatar.textContent = '🤖';
      } else {
        this.bottomPlayerName.textContent = 'You (Black)';
        this.bottomPlayerBadge.textContent = 'HUMAN';
        this.bottomPlayerAvatar.textContent = '👤';

        this.topPlayerName.textContent = 'Stockfish AI';
        this.topPlayerBadge.textContent = `LVL ${this.aiDifficulty}`;
        this.topPlayerAvatar.textContent = '🤖';
      }
    } else if (this.gameMode === 'local') {
      if (isOrientationWhite) {
        this.bottomPlayerName.textContent = 'White Player';
        this.bottomPlayerBadge.textContent = 'WHITE';
        this.bottomPlayerAvatar.textContent = '⚪';

        this.topPlayerName.textContent = 'Black Player';
        this.topPlayerBadge.textContent = 'BLACK';
        this.topPlayerAvatar.textContent = '⚫';
      } else {
        this.bottomPlayerName.textContent = 'Black Player';
        this.bottomPlayerBadge.textContent = 'BLACK';
        this.bottomPlayerAvatar.textContent = '⚫';

        this.topPlayerName.textContent = 'White Player';
        this.topPlayerBadge.textContent = 'WHITE';
        this.topPlayerAvatar.textContent = '⚪';
      }
    } else if (this.gameMode === 'online') {
      if (this.onlineRole === 'w') {
        this.bottomPlayerName.textContent = 'You (White)';
        this.bottomPlayerBadge.textContent = 'WHITE';
        this.topPlayerName.textContent = 'Opponent';
        this.topPlayerBadge.textContent = 'BLACK';
      } else if (this.onlineRole === 'b') {
        this.bottomPlayerName.textContent = 'You (Black)';
        this.bottomPlayerBadge.textContent = 'BLACK';
        this.topPlayerName.textContent = 'Opponent';
        this.topPlayerBadge.textContent = 'WHITE';
      } else {
        this.bottomPlayerName.textContent = 'White';
        this.topPlayerName.textContent = 'Black';
      }
    }
  }

  setupOnlineRoomUI() {
    document.getElementById('onlineDisconnectedSection').style.display = 'none';
    const connSec = document.getElementById('onlineConnectedSection');
    connSec.style.display = 'flex';
    document.getElementById('currentRoomCodeDisplay').textContent = this.roomCode;
  }

  appendChatMessage(sender, text, isSelf) {
    const container = document.getElementById('chatMessages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isSelf ? 'mine' : ''}`;
    bubble.innerHTML = `<span class="chat-sender">${escapeHtml(sender)}:</span> ${escapeHtml(text)}`;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  // --- Board & UI Rendering ---
  render() {
    this.renderBoard();
    this.renderEvaluationBar();
    this.renderCapturedPieces();
    this.renderMoveHistory();
    this.updateActiveTurnCard();
    this.updateMoveNavButtons();

    if (this.is3D && this.chess3D) {
      if (this.viewingHistoryIndex !== -1) {
        const histData = this.engine.getBoardAtHistoryIndex(this.viewingHistoryIndex);
        this.chess3D.syncFromEngine({ board: histData.board });
      } else {
        this.chess3D.syncFromEngine(this.engine);
      }
    }
  }

  renderBoard() {
    this.boardEl.innerHTML = '';
    const isFlipped = this.boardOrientation === 'b';

    let displayBoard = this.engine.board;
    let displayLastMove = this.engine.moveHistory[this.engine.moveHistory.length - 1];
    let displayKingPos = null;

    if (this.viewingHistoryIndex !== -1) {
      const histData = this.engine.getBoardAtHistoryIndex(this.viewingHistoryIndex);
      displayBoard = histData.board;
      displayLastMove = histData.lastMove;
      const histEngine = new ChessEngine();
      histEngine.loadFen(histData.fen);
      const histTurn = histEngine.turn;
      displayKingPos = histEngine.isCheck(histTurn) ? histEngine.findKing(histTurn) : null;
    } else {
      const currentTurn = this.engine.turn;
      const inCheck = this.engine.isCheck(currentTurn);
      displayKingPos = inCheck ? this.engine.findKing(currentTurn) : null;
    }

    for (let displayRow = 0; displayRow < 8; displayRow++) {
      for (let displayCol = 0; displayCol < 8; displayCol++) {
        // Map display coordinate to board index based on orientation
        const r = isFlipped ? 7 - displayRow : displayRow;
        const c = isFlipped ? 7 - displayCol : displayCol;

        const squareEl = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        squareEl.className = `square ${isLight ? 'light' : 'dark'}`;
        squareEl.dataset.r = r;
        squareEl.dataset.c = c;

        // Coordinates annotation inside corner squares
        if (displayCol === 0) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'coord-rank';
          rankLabel.textContent = 8 - r;
          squareEl.appendChild(rankLabel);
        }
        if (displayRow === 7) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'coord-file';
          fileLabel.textContent = String.fromCharCode(97 + c);
          squareEl.appendChild(fileLabel);
        }

        // Selection highlight
        if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
          squareEl.classList.add('selected');
        }

        // Last move origin & destination highlights
        if (displayLastMove) {
          if (displayLastMove.from.r === r && displayLastMove.from.c === c) {
            squareEl.classList.add('last-move-from');
          }
          if (displayLastMove.to.r === r && displayLastMove.to.c === c) {
            squareEl.classList.add('last-move-to');
          }
        }

        // Best Move Hint highlight (only when live)
        if (this.activeHint && this.viewingHistoryIndex === -1) {
          if ((this.activeHint.from.r === r && this.activeHint.from.c === c) ||
              (this.activeHint.to.r === r && this.activeHint.to.c === c)) {
            squareEl.classList.add('hint-move');
          }
        }

        // King in check red pulse
        if (displayKingPos && displayKingPos.r === r && displayKingPos.c === c) {
          squareEl.classList.add('in-check');
        }

        // Legal move markers for selected piece (only when live)
        if (this.viewingHistoryIndex === -1) {
          const legalMove = this.legalMovesFromSelected.find(m => m.to.r === r && m.to.c === c);
          if (legalMove) {
            const targetPiece = displayBoard[r][c];
            if (targetPiece || legalMove.isEnPassant) {
              const ring = document.createElement('div');
              ring.className = 'capture-ring';
              squareEl.appendChild(ring);
            } else {
              const dot = document.createElement('div');
              dot.className = 'move-dot';
              squareEl.appendChild(dot);
            }
          }
        }

        // Piece rendering
        const piece = displayBoard[r][c];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'chess-piece';
          pieceEl.innerHTML = getPieceSvg(piece.color, piece.type);
          squareEl.appendChild(pieceEl);

          // Setup interaction handlers (Click & Drag)
          this.attachPieceInteractions(pieceEl, r, c, piece);
        }

        // Square click listener
        squareEl.addEventListener('click', (e) => this.handleSquareClick(r, c));

        this.boardEl.appendChild(squareEl);
      }
    }
  }

  // --- Interaction: Drag & Drop + Click to Move ---
  attachPieceInteractions(pieceEl, r, c, piece) {
    // Only allow interactions if it's the player's turn to move!
    if (!this.canPlayerMove(piece.color)) return;

    // Mouse Drag
    pieceEl.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left click only
      this.startDragging(e.clientX, e.clientY, r, c, pieceEl, piece);
      e.stopPropagation();
    });

    // Touch Drag (Mobile friendly)
    pieceEl.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.startDragging(touch.clientX, touch.clientY, r, c, pieceEl, piece);
      e.stopPropagation();
    }, { passive: false });
  }

  canPlayerMove(color) {
    if (this.engine.turn !== color) return false;

    if (this.gameMode === 'ai') {
      // In AI mode, player only moves their assigned color
      return color === this.boardOrientation;
    }
    if (this.gameMode === 'online') {
      // In online mode, player only moves their assigned role
      return color === this.onlineRole;
    }
    // In local mode, both players can move on their turns
    return true;
  }

  startDragging(clientX, clientY, r, c, pieceEl, piece) {
    if (this.viewingHistoryIndex !== -1) {
      this.moveToLivePosition();
      this.showToast('Returned to current live move.');
      return;
    }

    this.isDragging = true;
    this.selectedSquare = { r, c };
    this.legalMovesFromSelected = this.engine.getLegalMoves({ r, c });
    this.activeHint = null;

    // Create ghost element following cursor
    const ghost = document.createElement('div');
    ghost.className = 'dragged-piece-ghost';
    ghost.innerHTML = getPieceSvg(piece.color, piece.type);
    ghost.style.left = `${clientX}px`;
    ghost.style.top = `${clientY}px`;
    document.body.appendChild(ghost);
    this.dragGhost = ghost;

    pieceEl.parentElement.classList.add('is-dragging-source');

    const moveHandler = (moveEvent) => {
      const x = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const y = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      if (this.dragGhost && x && y) {
        this.dragGhost.style.left = `${x}px`;
        this.dragGhost.style.top = `${y}px`;
      }
    };

    const upHandler = (upEvent) => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);

      if (this.dragGhost) {
        this.dragGhost.remove();
        this.dragGhost = null;
      }
      pieceEl.parentElement.classList.remove('is-dragging-source');
      this.isDragging = false;

      // Identify square under release
      const x = upEvent.clientX || (upEvent.changedTouches && upEvent.changedTouches[0].clientX);
      const y = upEvent.clientY || (upEvent.changedTouches && upEvent.changedTouches[0].clientY);
      if (x && y) {
        const elemUnder = document.elementFromPoint(x, y);
        const targetSquareEl = elemUnder ? elemUnder.closest('.square') : null;
        if (targetSquareEl) {
          const targetR = parseInt(targetSquareEl.dataset.r, 10);
          const targetC = parseInt(targetSquareEl.dataset.c, 10);
          this.attemptMove({ r, c }, { r: targetR, c: targetC });
          return;
        }
      }

      this.render();
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', upHandler);

    this.render();
  }

  handleSquareClick(r, c) {
    if (this.isDragging) return;

    if (this.viewingHistoryIndex !== -1) {
      this.moveToLivePosition();
      this.showToast('Returned to current live move.');
      return;
    }

    const clickedPiece = this.engine.board[r][c];

    // If already selected a piece and clicking on a destination square
    if (this.selectedSquare) {
      if (this.selectedSquare.r === r && this.selectedSquare.c === c) {
        // Deselect on re-clicking selected square
        this.selectedSquare = null;
        this.legalMovesFromSelected = [];
        this.render();
        return;
      }

      // Try making move to clicked square
      const isLegal = this.legalMovesFromSelected.some(m => m.to.r === r && m.to.c === c);
      if (isLegal) {
        this.attemptMove(this.selectedSquare, { r, c });
        return;
      }
    }

    // Select piece if it belongs to current player
    if (clickedPiece && this.canPlayerMove(clickedPiece.color)) {
      this.selectedSquare = { r, c };
      this.legalMovesFromSelected = this.engine.getLegalMoves({ r, c });
      this.activeHint = null;
      this.render();
    } else {
      this.selectedSquare = null;
      this.legalMovesFromSelected = [];
      this.render();
    }
  }

  attemptMove(from, to) {
    const piece = this.engine.board[from.r][from.c];
    if (!piece) return;

    // Check for Pawn Promotion
    const isPromo = piece.type === 'p' && ((piece.color === 'w' && to.r === 0) || (piece.color === 'b' && to.r === 7));
    if (isPromo) {
      // Show Promotion Modal
      this.pendingPromotion = { from, to, color: piece.color };
      this.showPromotionDialog(piece.color);
      return;
    }

    this.executeMove({ from, to });
  }

  showPromotionDialog(color) {
    this.promoPiecesGrid.innerHTML = '';
    const choices = [
      { type: 'q', label: 'Queen' },
      { type: 'n', label: 'Knight' },
      { type: 'r', label: 'Rook' },
      { type: 'b', label: 'Bishop' }
    ];

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'promo-piece-btn';
      btn.innerHTML = `${getPieceSvg(color, ch.type)}<span>${ch.label}</span>`;
      btn.addEventListener('click', () => {
        this.promotionModal.classList.remove('open');
        if (this.pendingPromotion) {
          const { from, to } = this.pendingPromotion;
          this.executeMove({ from, to, promotion: ch.type });
          this.pendingPromotion = null;
        }
      });
      this.promoPiecesGrid.appendChild(btn);
    });

    this.promotionModal.classList.add('open');
  }

  executeMove(moveInput) {
    const moveResult = this.engine.makeMove(moveInput);
    if (!moveResult) {
      this.audio.playIllegal();
      this.selectedSquare = null;
      this.legalMovesFromSelected = [];
      this.render();
      return;
    }

    // Apply clock increment to player who just moved
    const movedColor = moveResult.piece.color;
    if (this.increment > 0 && this.timers[movedColor] > 0) {
      this.timers[movedColor] += this.increment;
    }

    this.handleMoveAudioAndEffects(moveResult);

    // Reset selection & hint
    this.selectedSquare = null;
    this.legalMovesFromSelected = [];
    this.activeHint = null;

    // Emit to socket if online
    if (this.gameMode === 'online' && this.socket && this.roomCode) {
      this.socket.emit('make_move', {
        roomCode: this.roomCode,
        move: moveInput,
        timers: this.timers
      });
    }

    // Auto-flip for Pass & Play if enabled
    if (this.gameMode === 'local' && this.autoFlipLocal) {
      this.boardOrientation = this.engine.turn;
      this.updatePlayerCardsHeader();
    }

    this.render();
    const gameEnded = this.checkGameStatus();

    // Trigger AI move if in AI mode and game is still ongoing
    if (!gameEnded && this.gameMode === 'ai' && this.engine.turn !== this.boardOrientation) {
      setTimeout(() => this.triggerAIMove(), 350 + Math.random() * 200);
    }
  }

  handleMoveAudioAndEffects(moveResult) {
    if (moveResult.promotion) {
      this.audio.playPromote();
    } else if (moveResult.isCastle) {
      this.audio.playCastle();
    } else if (moveResult.captured) {
      this.audio.playCapture();
    } else {
      this.audio.playMove();
    }

    if (this.engine.isCheck(this.engine.turn)) {
      setTimeout(() => this.audio.playCheck(), 120);
    }
  }

  triggerAIMove() {
    if (this.engine.isGameOver().over) return;

    // Subtle AI thinking animation
    const aiMove = this.ai.getBestMove(this.engine, this.aiDifficulty);
    if (aiMove) {
      this.executeMove(aiMove);
    }
  }

  handleUndo() {
    if (this.gameMode === 'online') {
      this.showToast('Undo is not available in online multiplayer.');
      return;
    }

    if (this.gameMode === 'ai') {
      // In vs AI mode, undo both the AI's move and the player's last move
      if (this.engine.moveHistory.length >= 2) {
        this.engine.undo();
        this.engine.undo();
        this.audio.playMove();
        this.render();
      } else if (this.engine.moveHistory.length === 1 && this.engine.turn !== this.boardOrientation) {
        this.engine.undo();
        this.audio.playMove();
        this.render();
      }
    } else {
      // In local mode, undo 1 move
      if (this.engine.moveHistory.length > 0) {
        this.engine.undo();
        this.audio.playMove();
        this.render();
      }
    }
  }

  showBestMoveHint() {
    if (this.engine.isGameOver().over) return;
    const best = this.ai.getBestMove(this.engine, 4);
    if (best) {
      this.activeHint = best;
      const fromSq = ChessEngine.coordsToSquare(best.from.r, best.from.c);
      const toSq = ChessEngine.coordsToSquare(best.to.r, best.to.c);
      this.showToast(`Hint: Consider playing ${fromSq} to ${toSq}`);
      this.render();
    }
  }

  handleResign() {
    const current = this.engine.turn;
    const winner = current === 'w' ? 'Black' : 'White';
    this.stopClocks();
    this.audio.playGameOver();
    this.showGameOverModal('Resignation', `${winner} wins by resignation!`);
  }

  checkGameStatus() {
    const status = this.engine.isGameOver();
    if (status.over) {
      this.stopClocks();
      this.audio.playGameOver();
      let title = 'Game Over';
      if (status.result === 'checkmate') {
        title = status.winner === 'w' ? 'White Wins!' : 'Black Wins!';
      } else if (status.result === 'stalemate') {
        title = 'Draw by Stalemate';
      } else {
        title = 'Game Drawn';
      }
      this.showGameOverModal(title, status.reason);
      return true;
    }
    return false;
  }

  showGameOverModal(title, desc) {
    this.gameOverTitle.textContent = title;
    this.gameOverDesc.textContent = desc;
    this.gameOverModal.classList.add('open');
  }

  // --- Real-time Evaluation Bar ---
  renderEvaluationBar() {
    const score = this.ai.evaluate(this.engine);
    // Score in centipawns. Convert to winning percentage via sigmoid
    // 0 -> 50%, +400 -> ~75%, -400 -> ~25%
    const winProbWhite = 1 / (1 + Math.exp(-score / 350));
    const whiteHeightPercent = Math.max(5, Math.min(95, winProbWhite * 100));
    const blackHeightPercent = 100 - whiteHeightPercent;

    this.evalBarBlack.style.height = `${blackHeightPercent}%`;

    const scoreInPawns = (score / 100).toFixed(1);
    const scoreText = score >= 0 ? `+${scoreInPawns}` : `${scoreInPawns}`;
    this.evalBarScore.textContent = Math.abs(score) > 10000 ? (score > 0 ? '+M' : '-M') : scoreText;
    this.evalBarScore.style.top = `calc(${blackHeightPercent}% - 10px)`;
    this.evalBarScore.className = `eval-bar-score ${score < 0 ? 'black-favored' : ''}`;
  }

  // --- Captured Pieces & Material Advantage ---
  renderCapturedPieces() {
    const isFlipped = this.boardOrientation === 'b';
    const topColor = isFlipped ? 'w' : 'b';
    const bottomColor = isFlipped ? 'b' : 'w';

    // Captured by White & Black
    const capByTop = this.engine.capturedPieces[topColor];
    const capByBottom = this.engine.capturedPieces[bottomColor];

    this.topCapturedRack.innerHTML = capByTop.map(p =>
      `<span class="captured-piece-mini">${getPieceSvg(p.color, p.type)}</span>`
    ).join('');

    this.bottomCapturedRack.innerHTML = capByBottom.map(p =>
      `<span class="captured-piece-mini">${getPieceSvg(p.color, p.type)}</span>`
    ).join('');

    // Material Balance tally
    const balance = this.engine.getMaterialBalance(); // positive = white advantage
    const topAdvantage = isFlipped ? balance : -balance;
    const bottomAdvantage = isFlipped ? -balance : balance;

    this.topMaterialDiff.textContent = topAdvantage > 0 ? `+${topAdvantage}` : '';
    this.bottomMaterialDiff.textContent = bottomAdvantage > 0 ? `+${bottomAdvantage}` : '';
  }

  // --- Move Notation History Table ---
  renderMoveHistory() {
    this.movesListEl.innerHTML = '';
    const history = this.engine.moveHistory;

    for (let i = 0; i < history.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = history[i];
      const blackMove = history[i + 1];

      const row = document.createElement('div');
      row.className = 'move-row';

      const numEl = document.createElement('span');
      numEl.className = 'move-num';
      numEl.textContent = `${moveNum}.`;
      row.appendChild(numEl);

      const whiteEl = document.createElement('span');
      whiteEl.className = 'move-cell';
      whiteEl.textContent = whiteMove.san;
      const isWhiteCurrent = (this.viewingHistoryIndex === i) || (this.viewingHistoryIndex === -1 && i === history.length - 1);
      if (isWhiteCurrent) {
        whiteEl.classList.add('current-move');
      }
      whiteEl.addEventListener('click', () => {
        this.moveToHistoryIndex(i);
      });
      row.appendChild(whiteEl);

      if (blackMove) {
        const blackEl = document.createElement('span');
        blackEl.className = 'move-cell';
        blackEl.textContent = blackMove.san;
        const isBlackCurrent = (this.viewingHistoryIndex === i + 1) || (this.viewingHistoryIndex === -1 && i + 1 === history.length - 1);
        if (isBlackCurrent) {
          blackEl.classList.add('current-move');
        }
        blackEl.addEventListener('click', () => {
          this.moveToHistoryIndex(i + 1);
        });
        row.appendChild(blackEl);
      }

      this.movesListEl.appendChild(row);
    }

    // Auto-scroll moves list to bottom if on live position
    if (this.viewingHistoryIndex === -1) {
      this.movesTableContainer.scrollTop = this.movesTableContainer.scrollHeight;
    }
    this.updateMoveNavButtons();
  }

  // --- Sidebar Customization Options & Handlers ---
  setTheme(theme) {
    document.body.setAttribute('data-board-theme', theme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = theme;
    document.querySelectorAll('#optThemeChips .theme-chip').forEach(chip => {
      chip.classList.toggle('selected', chip.getAttribute('data-theme') === theme);
    });
    this.showToast(`Board Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
  }

  setPieceStyleOption(style) {
    if (typeof setPieceStyle === 'function') {
      setPieceStyle(style);
    }
    const pieceStyleSelect = document.getElementById('pieceStyleSelect');
    if (pieceStyleSelect) pieceStyleSelect.value = style;

    document.querySelectorAll('#optPieceChips .piece-chip').forEach(chip => {
      chip.classList.toggle('selected', chip.getAttribute('data-style') === style);
    });

    if (this.chess3D && typeof this.chess3D.setMaterialStyle === 'function') {
      this.chess3D.setMaterialStyle(style);
    }
    this.render();
    this.showToast(`Piece Style: ${style}`);
  }

  toggleSoundOption() {
    const isMuted = this.audio.toggleMute();
    const soundIconOn = document.getElementById('soundIconOn');
    const soundIconOff = document.getElementById('soundIconOff');
    const soundLabel = document.getElementById('soundLabel');
    if (soundIconOn) soundIconOn.style.display = isMuted ? 'none' : 'block';
    if (soundIconOff) soundIconOff.style.display = isMuted ? 'block' : 'none';
    if (soundLabel) soundLabel.textContent = isMuted ? 'Muted' : 'Sound';

    const optSoundText = document.getElementById('optSoundText');
    if (optSoundText) optSoundText.textContent = isMuted ? 'Sound: Off' : 'Sound: On';
    this.showToast(isMuted ? 'Sound muted' : 'Sound enabled');
  }

  set3DView(enable3D) {
    this.is3D = enable3D;
    const btnToggle3D = document.getElementById('btnToggle3D');
    if (btnToggle3D) {
      btnToggle3D.classList.toggle('active-3d', this.is3D);
      const label = document.getElementById('labelMode3D');
      if (label) label.textContent = this.is3D ? '2D View' : '3D View';
    }

    const btnOpt2D = document.getElementById('btnOpt2D');
    const btnOpt3D = document.getElementById('btnOpt3D');
    if (btnOpt2D && btnOpt3D) {
      btnOpt2D.classList.toggle('selected', !this.is3D);
      btnOpt3D.classList.toggle('selected', this.is3D);
    }

    const optCameraRow = document.getElementById('optCameraRow');
    if (optCameraRow) {
      optCameraRow.style.display = this.is3D ? 'flex' : 'none';
    }

    if (this.chess3D && this.chess3D.initialized) {
      this.chess3D.toggleView(this.is3D);
    } else {
      this.boardWrapper.classList.toggle('board-3d-isometric', this.is3D);
    }
    this.showToast(this.is3D ? 'Switched to 3D View! Drag to rotate, scroll to zoom.' : 'Switched to 2D View.');
  }

  toggle3DView() {
    this.set3DView(!this.is3D);
  }

  flipBoard() {
    this.boardOrientation = this.boardOrientation === 'w' ? 'b' : 'w';
    if (this.is3D && this.chess3D) {
      if (this.boardOrientation === 'b') {
        this.chess3D.setCameraTarget(0, 22, -19);
      } else {
        this.chess3D.setCameraTarget(0, 22, 19);
      }
    }
    this.updatePlayerCardsHeader();
    this.render();
    this.showToast(`Board flipped to ${this.boardOrientation === 'w' ? 'White' : 'Black'}`);
  }

  setupSidebarOptions() {
    // 2D vs 3D Option Buttons
    document.getElementById('btnOpt2D')?.addEventListener('click', () => {
      this.set3DView(false);
    });
    document.getElementById('btnOpt3D')?.addEventListener('click', () => {
      this.set3DView(true);
    });

    // Theme Chips
    document.querySelectorAll('#optThemeChips .theme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const theme = chip.getAttribute('data-theme');
        this.setTheme(theme);
      });
    });

    // Piece Style Chips
    document.querySelectorAll('#optPieceChips .piece-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const style = chip.getAttribute('data-style');
        this.setPieceStyleOption(style);
      });
    });

    // Quick Preferences Buttons
    document.getElementById('btnOptFlipBoard')?.addEventListener('click', () => {
      this.flipBoard();
    });
    document.getElementById('btnOptSound')?.addEventListener('click', () => {
      this.toggleSoundOption();
    });

    // 3D Camera Preset Buttons
    document.querySelectorAll('#optCameraPresets .option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#optCameraPresets .option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const camPreset = btn.getAttribute('data-cam');
        if (this.chess3D && typeof this.chess3D.setCameraPreset === 'function') {
          this.chess3D.setCameraPreset(camPreset);
        }
      });
    });
  }

  // --- Move To History Navigation ---
  setupMoveToNavigation() {
    document.getElementById('btnNavFirst')?.addEventListener('click', () => {
      this.moveToHistoryIndex(-1);
    });

    document.getElementById('btnNavPrev')?.addEventListener('click', () => {
      const currentIdx = this.viewingHistoryIndex === -1 ? this.engine.moveHistory.length - 1 : this.viewingHistoryIndex;
      this.moveToHistoryIndex(currentIdx - 1);
    });

    document.getElementById('btnNavNext')?.addEventListener('click', () => {
      const currentIdx = this.viewingHistoryIndex === -1 ? this.engine.moveHistory.length - 1 : this.viewingHistoryIndex;
      this.moveToHistoryIndex(currentIdx + 1);
    });

    document.getElementById('btnNavLast')?.addEventListener('click', () => {
      this.moveToLivePosition();
    });

    document.getElementById('btnLiveResume')?.addEventListener('click', () => {
      this.moveToLivePosition();
    });

    // Keyboard navigation (Arrow keys)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (this.engine.moveHistory.length === 0) return;

      const currentIdx = this.viewingHistoryIndex === -1 ? this.engine.moveHistory.length - 1 : this.viewingHistoryIndex;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.moveToHistoryIndex(currentIdx - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.moveToHistoryIndex(currentIdx + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.moveToHistoryIndex(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.moveToLivePosition();
      }
    });
  }

  moveToHistoryIndex(index) {
    const maxIdx = this.engine.moveHistory.length - 1;
    if (maxIdx < 0) return;

    let target = Math.max(-1, Math.min(index, maxIdx));

    if (target === maxIdx) {
      this.viewingHistoryIndex = -1;
    } else {
      this.viewingHistoryIndex = target;
    }

    this.selectedSquare = null;
    this.legalMovesFromSelected = [];
    this.render();

    if (this.chess3D && this.chess3D.active) {
      const histData = this.engine.getBoardAtHistoryIndex(this.viewingHistoryIndex);
      this.chess3D.syncFromEngine({ board: histData.board });
    }

    this.renderMoveHistory();
    this.updateMoveNavButtons();
  }

  moveToLivePosition() {
    this.viewingHistoryIndex = -1;
    this.render();
    if (this.chess3D && this.chess3D.active) {
      this.chess3D.syncFromEngine(this.engine);
    }
    this.renderMoveHistory();
    this.updateMoveNavButtons();
  }

  updateMoveNavButtons() {
    const historyLen = this.engine.moveHistory.length;
    const currentView = this.viewingHistoryIndex === -1 ? historyLen - 1 : this.viewingHistoryIndex;

    const btnNavFirst = document.getElementById('btnNavFirst');
    const btnNavPrev = document.getElementById('btnNavPrev');
    const btnNavNext = document.getElementById('btnNavNext');
    const btnNavLast = document.getElementById('btnNavLast');
    const btnLiveResume = document.getElementById('btnLiveResume');
    const historyStepBadge = document.getElementById('historyStepBadge');

    if (!btnNavFirst) return;

    if (historyLen === 0) {
      btnNavFirst.disabled = true;
      btnNavPrev.disabled = true;
      btnNavNext.disabled = true;
      btnNavLast.disabled = true;
      if (btnLiveResume) btnLiveResume.style.display = 'none';
      if (historyStepBadge) historyStepBadge.style.display = 'none';
      return;
    }

    const isAtStart = currentView <= -1;
    const isAtLatest = (this.viewingHistoryIndex === -1) || (currentView >= historyLen - 1);

    btnNavFirst.disabled = isAtStart;
    btnNavPrev.disabled = isAtStart;
    btnNavNext.disabled = isAtLatest;
    btnNavLast.disabled = isAtLatest;

    if (!isAtLatest) {
      if (btnLiveResume) btnLiveResume.style.display = 'inline-flex';
      if (historyStepBadge) {
        historyStepBadge.style.display = 'inline-block';
        if (currentView === -1) {
          historyStepBadge.textContent = 'Start Position';
        } else {
          const moveNum = Math.floor(currentView / 2) + 1;
          const colorName = currentView % 2 === 0 ? 'White' : 'Black';
          const moveSan = this.engine.moveHistory[currentView].san;
          historyStepBadge.textContent = `Move ${moveNum} (${colorName}: ${moveSan})`;
        }
      }
    } else {
      if (btnLiveResume) btnLiveResume.style.display = 'none';
      if (historyStepBadge) historyStepBadge.style.display = 'none';
    }
  }

  // --- Chess Clocks ---
  startClocks() {
    this.stopClocks();
    if (this.initialTime <= 0) return; // untimed

    this.clockRunning = true;
    this.clockInterval = setInterval(() => {
      if (!this.clockRunning) return;
      const turn = this.engine.turn;
      if (this.timers[turn] > 0) {
        this.timers[turn]--;
        this.updateClockDisplays();
        if (this.timers[turn] <= 0) {
          this.handleTimeout(turn);
        }
      }
    }, 1000);
  }

  stopClocks() {
    this.clockRunning = false;
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  handleTimeout(timeoutColor) {
    this.stopClocks();
    this.audio.playGameOver();
    const winner = timeoutColor === 'w' ? 'Black' : 'White';
    this.showGameOverModal('Time Out', `${winner} wins on time!`);
  }

  updateClockDisplays() {
    if (this.initialTime <= 0) {
      this.topClockEl.textContent = '∞';
      this.bottomClockEl.textContent = '∞';
      return;
    }

    const isFlipped = this.boardOrientation === 'b';
    const topTime = isFlipped ? this.timers.w : this.timers.b;
    const bottomTime = isFlipped ? this.timers.b : this.timers.w;

    this.topClockEl.textContent = this.formatTime(topTime);
    this.bottomClockEl.textContent = this.formatTime(bottomTime);

    // Low time visual pulsation warning (< 30s)
    this.topClockEl.classList.toggle('low-time', topTime > 0 && topTime <= 30);
    this.bottomClockEl.classList.toggle('low-time', bottomTime > 0 && bottomTime <= 30);
  }

  updateActiveTurnCard() {
    const isFlipped = this.boardOrientation === 'b';
    const currentTurn = this.engine.turn;

    const isBottomTurn = (currentTurn === 'w' && !isFlipped) || (currentTurn === 'b' && isFlipped);

    this.bottomPlayerCard.classList.toggle('active-turn', isBottomTurn);
    this.topPlayerCard.classList.toggle('active-turn', !isBottomTurn);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.chessApp = new ChessApp();
});
