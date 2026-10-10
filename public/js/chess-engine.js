// Comprehensive Standard Chess Engine
// Follows official FIDE rules: castling, en passant, promotion, check, checkmate, stalemate, draws

class ChessEngine {
  constructor(fen) {
    this.reset();
    if (fen) this.loadFen(fen);
  }

  reset() {
    // 8x8 board: row 0 is rank 8 (Black back rank), row 7 is rank 1 (White back rank)
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.turn = 'w'; // 'w' or 'b'
    this.castling = { wK: true, wQ: true, bK: true, bQ: true };
    this.enPassant = null; // { r, c } target square pawn skips over
    this.halfmoveClock = 0; // for 50-move rule
    this.fullmoveNumber = 1;
    this.moveHistory = [];
    this.positionHistory = []; // FEN snapshots for threefold repetition
    this.capturedPieces = { w: [], b: [] }; // captured BY white, captured BY black

    this.setupStartingPosition();
    this.recordPosition();
  }

  setupStartingPosition() {
    const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let c = 0; c < 8; c++) {
      this.board[0][c] = { color: 'b', type: backRank[c] };
      this.board[1][c] = { color: 'b', type: 'p' };
      this.board[6][c] = { color: 'w', type: 'p' };
      this.board[7][c] = { color: 'w', type: backRank[c] };
    }
  }

  // Deep clone state for search / verification
  clone() {
    const clone = new ChessEngine();
    clone.board = this.board.map(row => row.map(cell => cell ? { ...cell } : null));
    clone.turn = this.turn;
    clone.castling = { ...this.castling };
    clone.enPassant = this.enPassant ? { ...this.enPassant } : null;
    clone.halfmoveClock = this.halfmoveClock;
    clone.fullmoveNumber = this.fullmoveNumber;
    clone.moveHistory = [...this.moveHistory];
    clone.positionHistory = [...this.positionHistory];
    clone.capturedPieces = {
      w: [...this.capturedPieces.w],
      b: [...this.capturedPieces.b]
    };
    return clone;
  }

  getPiece(r, c) {
    if (r < 0 || r > 7 || c < 0 || c > 7) return null;
    return this.board[r][c];
  }

  static squareToCoords(square) {
    // e.g. "e4" -> { r: 4, c: 4 }
    const c = square.charCodeAt(0) - 97;
    const r = 8 - parseInt(square[1], 10);
    return { r, c };
  }

  static coordsToSquare(r, c) {
    // e.g. { r: 4, c: 4 } -> "e4"
    return String.fromCharCode(97 + c) + (8 - r);
  }

  findKing(color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.color === color && p.type === 'k') {
          return { r, c };
        }
      }
    }
    return null;
  }

  // Check if square (r, c) is attacked by opposing color
  isSquareAttacked(r, c, attackerColor) {
    // 1. Pawn attacks
    const pawnDir = attackerColor === 'w' ? 1 : -1; // pawns attack forwards from their perspective
    const pawnRow = r + pawnDir;
    for (const pawnCol of [c - 1, c + 1]) {
      if (pawnRow >= 0 && pawnRow < 8 && pawnCol >= 0 && pawnCol < 8) {
        const p = this.board[pawnRow][pawnCol];
        if (p && p.color === attackerColor && p.type === 'p') return true;
      }
    }

    // 2. Knight attacks
    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightOffsets) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = this.board[nr][nc];
        if (p && p.color === attackerColor && p.type === 'n') return true;
      }
    }

    // 3. Bishop & Queen diagonal attacks
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = this.board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'b' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 4. Rook & Queen orthogonal attacks
    const orthoDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of orthoDirs) {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = this.board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'r' || p.type === 'q')) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 5. King attacks (1 square away)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const p = this.board[nr][nc];
          if (p && p.color === attackerColor && p.type === 'k') return true;
        }
      }
    }

    return false;
  }

  isCheck(color = this.turn) {
    const king = this.findKing(color);
    if (!king) return false;
    const enemyColor = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(king.r, king.c, enemyColor);
  }

  // Generate pseudo-legal moves for a specific piece at (fromR, fromC)
  getPseudoMoves(fromR, fromC) {
    const piece = this.board[fromR][fromC];
    if (!piece) return [];
    const moves = [];
    const color = piece.color;
    const enemyColor = color === 'w' ? 'b' : 'w';

    switch (piece.type) {
      case 'p': {
        const forward = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        const promoRow = color === 'w' ? 0 : 7;

        // 1-step forward
        const r1 = fromR + forward;
        if (r1 >= 0 && r1 < 8 && !this.board[r1][fromC]) {
          if (r1 === promoRow) {
            ['q', 'r', 'b', 'n'].forEach(promo => {
              moves.push({ from: { r: fromR, c: fromC }, to: { r: r1, c: fromC }, promotion: promo });
            });
          } else {
            moves.push({ from: { r: fromR, c: fromC }, to: { r: r1, c: fromC } });
          }

          // 2-step forward from starting row
          const r2 = fromR + forward * 2;
          if (fromR === startRow && !this.board[r2][fromC]) {
            moves.push({ from: { r: fromR, c: fromC }, to: { r: r2, c: fromC } });
          }
        }

        // Diagonal captures
        for (const dc of [-1, 1]) {
          const toC = fromC + dc;
          if (toC >= 0 && toC < 8) {
            const target = this.board[r1][toC];
            if (target && target.color === enemyColor) {
              if (r1 === promoRow) {
                ['q', 'r', 'b', 'n'].forEach(promo => {
                  moves.push({ from: { r: fromR, c: fromC }, to: { r: r1, c: toC }, promotion: promo });
                });
              } else {
                moves.push({ from: { r: fromR, c: fromC }, to: { r: r1, c: toC } });
              }
            } else if (this.enPassant && this.enPassant.r === r1 && this.enPassant.c === toC) {
              // En passant capture
              moves.push({ from: { r: fromR, c: fromC }, to: { r: r1, c: toC }, isEnPassant: true });
            }
          }
        }
        break;
      }

      case 'n': {
        const knightJumps = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        for (const [dr, dc] of knightJumps) {
          const toR = fromR + dr, toC = fromC + dc;
          if (toR >= 0 && toR < 8 && toC >= 0 && toC < 8) {
            const target = this.board[toR][toC];
            if (!target || target.color !== color) {
              moves.push({ from: { r: fromR, c: fromC }, to: { r: toR, c: toC } });
            }
          }
        }
        break;
      }

      case 'b': {
        const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        this.addRayMoves(moves, fromR, fromC, dirs, color);
        break;
      }

      case 'r': {
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.addRayMoves(moves, fromR, fromC, dirs, color);
        break;
      }

      case 'q': {
        const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        this.addRayMoves(moves, fromR, fromC, dirs, color);
        break;
      }

      case 'k': {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const toR = fromR + dr, toC = fromC + dc;
            if (toR >= 0 && toR < 8 && toC >= 0 && toC < 8) {
              const target = this.board[toR][toC];
              if (!target || target.color !== color) {
                moves.push({ from: { r: fromR, c: fromC }, to: { r: toR, c: toC } });
              }
            }
          }
        }

        // Castling
        if (color === 'w' && fromR === 7 && fromC === 4) {
          // White Kingside (e1 -> g1)
          if (this.castling.wK && this.board[7][7]?.type === 'r' && !this.board[7][5] && !this.board[7][6]) {
            if (!this.isCheck('w') && !this.isSquareAttacked(7, 5, 'b') && !this.isSquareAttacked(7, 6, 'b')) {
              moves.push({ from: { r: 7, c: 4 }, to: { r: 7, c: 6 }, isCastle: 'K' });
            }
          }
          // White Queenside (e1 -> c1)
          if (this.castling.wQ && this.board[7][0]?.type === 'r' && !this.board[7][3] && !this.board[7][2] && !this.board[7][1]) {
            if (!this.isCheck('w') && !this.isSquareAttacked(7, 3, 'b') && !this.isSquareAttacked(7, 2, 'b')) {
              moves.push({ from: { r: 7, c: 4 }, to: { r: 7, c: 2 }, isCastle: 'Q' });
            }
          }
        } else if (color === 'b' && fromR === 0 && fromC === 4) {
          // Black Kingside (e8 -> g8)
          if (this.castling.bK && this.board[0][7]?.type === 'r' && !this.board[0][5] && !this.board[0][6]) {
            if (!this.isCheck('b') && !this.isSquareAttacked(0, 5, 'w') && !this.isSquareAttacked(0, 6, 'w')) {
              moves.push({ from: { r: 0, c: 4 }, to: { r: 0, c: 6 }, isCastle: 'k' });
            }
          }
          // Black Queenside (e8 -> c8)
          if (this.castling.bQ && this.board[0][0]?.type === 'r' && !this.board[0][3] && !this.board[0][2] && !this.board[0][1]) {
            if (!this.isCheck('b') && !this.isSquareAttacked(0, 3, 'w') && !this.isSquareAttacked(0, 2, 'w')) {
              moves.push({ from: { r: 0, c: 4 }, to: { r: 0, c: 2 }, isCastle: 'q' });
            }
          }
        }
        break;
      }
    }

    return moves;
  }

  addRayMoves(moves, fromR, fromC, dirs, color) {
    for (const [dr, dc] of dirs) {
      let toR = fromR + dr, toC = fromC + dc;
      while (toR >= 0 && toR < 8 && toC >= 0 && toC < 8) {
        const target = this.board[toR][toC];
        if (!target) {
          moves.push({ from: { r: fromR, c: fromC }, to: { r: toR, c: toC } });
        } else {
          if (target.color !== color) {
            moves.push({ from: { r: fromR, c: fromC }, to: { r: toR, c: toC } });
          }
          break;
        }
        toR += dr;
        toC += dc;
      }
    }
  }

  // Get all strictly legal moves for the current player
  getLegalMoves(filterFrom = null) {
    const legalMoves = [];
    const color = this.turn;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (filterFrom && (filterFrom.r !== r || filterFrom.c !== c)) continue;
        const p = this.board[r][c];
        if (!p || p.color !== color) continue;

        const candidateMoves = this.getPseudoMoves(r, c);
        for (const move of candidateMoves) {
          if (this.isMoveLegal(move)) {
            legalMoves.push(move);
          }
        }
      }
    }
    return legalMoves;
  }

  // Tests if making candidate move leaves current turn's king safe
  isMoveLegal(move) {
    const { from, to, isEnPassant, isCastle } = move;
    const movingPiece = this.board[from.r][from.c];
    const targetPiece = this.board[to.r][to.c];
    const color = movingPiece.color;

    // Apply move temporarily
    this.board[to.r][to.c] = movingPiece;
    this.board[from.r][from.c] = null;

    let epCaptured = null;
    if (isEnPassant) {
      const epPawnRow = from.r;
      epCaptured = this.board[epPawnRow][to.c];
      this.board[epPawnRow][to.c] = null;
    }

    let castleRook = null;
    if (isCastle) {
      if (isCastle === 'K') {
        castleRook = { from: { r: 7, c: 7 }, to: { r: 7, c: 5 } };
      } else if (isCastle === 'Q') {
        castleRook = { from: { r: 7, c: 0 }, to: { r: 7, c: 3 } };
      } else if (isCastle === 'k') {
        castleRook = { from: { r: 0, c: 7 }, to: { r: 0, c: 5 } };
      } else if (isCastle === 'q') {
        castleRook = { from: { r: 0, c: 0 }, to: { r: 0, c: 3 } };
      }
      this.board[castleRook.to.r][castleRook.to.c] = this.board[castleRook.from.r][castleRook.from.c];
      this.board[castleRook.from.r][castleRook.from.c] = null;
    }

    // Check if king is in check
    const inCheck = this.isCheck(color);

    // Revert move
    this.board[from.r][from.c] = movingPiece;
    this.board[to.r][to.c] = targetPiece;
    if (isEnPassant) {
      this.board[from.r][to.c] = epCaptured;
    }
    if (isCastle && castleRook) {
      this.board[castleRook.from.r][castleRook.from.c] = this.board[castleRook.to.r][castleRook.to.c];
      this.board[castleRook.to.r][castleRook.to.c] = null;
    }

    return !inCheck;
  }

  // Execute a legal move
  makeMove(moveInput) {
    // moveInput can be { from: { r, c }, to: { r, c }, promotion: 'q' } or { from: 'e2', to: 'e4' }
    let from = moveInput.from;
    let to = moveInput.to;
    let promotion = moveInput.promotion || 'q';

    if (typeof from === 'string') from = ChessEngine.squareToCoords(from);
    if (typeof to === 'string') to = ChessEngine.squareToCoords(to);

    const piece = this.board[from.r][from.c];
    if (!piece || piece.color !== this.turn) return null;

    // Validate that this is indeed in the legal moves list
    const legalMoves = this.getLegalMoves(from);
    const matched = legalMoves.find(m =>
      m.to.r === to.r &&
      m.to.c === to.c &&
      (!m.promotion || m.promotion === promotion)
    );

    if (!matched) return null;

    // Save previous state for undo & notation
    const prevTurn = this.turn;
    const prevCastling = { ...this.castling };
    const prevEnPassant = this.enPassant ? { ...this.enPassant } : null;
    const prevHalfmove = this.halfmoveClock;
    let capturedPiece = this.board[to.r][to.c];

    // Update board
    this.board[to.r][to.c] = piece;
    this.board[from.r][from.c] = null;

    // En passant handling
    if (matched.isEnPassant) {
      capturedPiece = this.board[from.r][to.c];
      this.board[from.r][to.c] = null;
    }

    // Pawn promotion
    if (matched.promotion) {
      this.board[to.r][to.c] = { color: prevTurn, type: matched.promotion };
    }

    // Castling rook move
    if (matched.isCastle) {
      if (matched.isCastle === 'K') {
        this.board[7][5] = this.board[7][7];
        this.board[7][7] = null;
      } else if (matched.isCastle === 'Q') {
        this.board[7][3] = this.board[7][0];
        this.board[7][0] = null;
      } else if (matched.isCastle === 'k') {
        this.board[0][5] = this.board[0][7];
        this.board[0][7] = null;
      } else if (matched.isCastle === 'q') {
        this.board[0][3] = this.board[0][0];
        this.board[0][0] = null;
      }
    }

    // Compute SAN (Standard Algebraic Notation) on updated board
    const san = this.computeSAN(matched, piece, capturedPiece);

    // Track captured pieces
    if (capturedPiece) {
      this.capturedPieces[prevTurn].push(capturedPiece);
      this.halfmoveClock = 0;
    } else if (piece.type === 'p') {
      this.halfmoveClock = 0;
    } else {
      this.halfmoveClock++;
    }

    // Update castling rights if King or Rooks moved
    if (piece.type === 'k') {
      if (prevTurn === 'w') {
        this.castling.wK = false;
        this.castling.wQ = false;
      } else {
        this.castling.bK = false;
        this.castling.bQ = false;
      }
    } else if (piece.type === 'r') {
      if (from.r === 7 && from.c === 7) this.castling.wK = false;
      if (from.r === 7 && from.c === 0) this.castling.wQ = false;
      if (from.r === 0 && from.c === 7) this.castling.bK = false;
      if (from.r === 0 && from.c === 0) this.castling.bQ = false;
    }

    // If opponent rook is captured in corner, revoke opponent's castling on that side
    if (to.r === 7 && to.c === 7) this.castling.wK = false;
    if (to.r === 7 && to.c === 0) this.castling.wQ = false;
    if (to.r === 0 && to.c === 7) this.castling.bK = false;
    if (to.r === 0 && to.c === 0) this.castling.bQ = false;

    // En passant square tracking
    if (piece.type === 'p' && Math.abs(from.r - to.r) === 2) {
      this.enPassant = { r: (from.r + to.r) / 2, c: from.c };
    } else {
      this.enPassant = null;
    }

    // Increment fullmove
    if (prevTurn === 'b') {
      this.fullmoveNumber++;
    }

    // Toggle turn
    this.turn = prevTurn === 'w' ? 'b' : 'w';

    // Store history record
    const historyRecord = {
      from,
      to,
      piece: { ...piece },
      captured: capturedPiece ? { ...capturedPiece } : null,
      promotion: matched.promotion || null,
      isCastle: matched.isCastle || null,
      isEnPassant: !!matched.isEnPassant,
      san,
      prevCastling,
      prevEnPassant,
      prevHalfmove,
      fen: this.generateFen()
    };

    this.moveHistory.push(historyRecord);
    this.recordPosition();

    return historyRecord;
  }

  // Compute Standard Algebraic Notation (SAN)
  computeSAN(move, piece, capturedPiece = null) {
    const { from, to, promotion, isCastle } = move;
    if (isCastle) {
      return (isCastle.toUpperCase() === 'K') ? 'O-O' : 'O-O-O';
    }

    const toSquare = ChessEngine.coordsToSquare(to.r, to.c);
    const fromSquare = ChessEngine.coordsToSquare(from.r, from.c);
    const isCapture = !!capturedPiece || move.isEnPassant;

    let piecePrefix = '';
    if (piece.type !== 'p') {
      piecePrefix = piece.type.toUpperCase();

      // Disambiguation: check if another piece of same type can move to same square
      const peers = this.getLegalMoves().filter(m =>
        m.to.r === to.r &&
        m.to.c === to.c &&
        (m.from.r !== from.r || m.from.c !== from.c) &&
        this.board[m.from.r][m.from.c]?.type === piece.type
      );

      if (peers.length > 0) {
        const sameCol = peers.some(m => m.from.c === from.c);
        const sameRow = peers.some(m => m.from.r === from.r);
        if (!sameCol) {
          piecePrefix += fromSquare[0]; // file
        } else if (!sameRow) {
          piecePrefix += fromSquare[1]; // rank
        } else {
          piecePrefix += fromSquare; // full square
        }
      }
    } else {
      if (isCapture) {
        piecePrefix = fromSquare[0]; // pawn file e.g. "exd5"
      }
    }

    let san = piecePrefix + (isCapture ? 'x' : '') + toSquare;
    if (promotion) {
      san += '=' + promotion.toUpperCase();
    }

    // Check / Checkmate suffix
    // Test if this move delivers check or checkmate
    const enemyColor = piece.color === 'w' ? 'b' : 'w';
    const kingPos = this.findKing(enemyColor);
    const deliversCheck = this.isSquareAttacked(kingPos.r, kingPos.c, piece.color);

    if (deliversCheck) {
      // Temporarily switch turn to check for checkmate
      const savedTurn = this.turn;
      this.turn = enemyColor;
      const enemyMoves = this.getLegalMoves();
      this.turn = savedTurn;
      if (enemyMoves.length === 0) {
        san += '#';
      } else {
        san += '+';
      }
    }

    return san;
  }

  undo() {
    if (this.moveHistory.length === 0) return null;
    const last = this.moveHistory.pop();
    this.positionHistory.pop();

    const { from, to, piece, captured, promotion, isCastle, isEnPassant, prevCastling, prevEnPassant, prevHalfmove } = last;

    // Restore moving piece
    this.board[from.r][from.c] = piece;

    // Restore target square
    if (isEnPassant) {
      this.board[to.r][to.c] = null;
      this.board[from.r][to.c] = captured;
    } else {
      this.board[to.r][to.c] = captured;
    }

    // Undo castle rook move
    if (isCastle) {
      if (isCastle === 'K') {
        this.board[7][7] = this.board[7][5];
        this.board[7][5] = null;
      } else if (isCastle === 'Q') {
        this.board[7][0] = this.board[7][3];
        this.board[7][3] = null;
      } else if (isCastle === 'k') {
        this.board[0][7] = this.board[0][5];
        this.board[0][5] = null;
      } else if (isCastle === 'q') {
        this.board[0][0] = this.board[0][3];
        this.board[0][3] = null;
      }
    }

    // Restore state variables
    this.castling = prevCastling;
    this.enPassant = prevEnPassant;
    this.halfmoveClock = prevHalfmove;

    // Remove from captured list
    if (captured) {
      const list = this.capturedPieces[piece.color];
      list.pop();
    }

    // Restore turn and fullmove
    if (this.turn === 'w') {
      this.fullmoveNumber--;
    }
    this.turn = piece.color;

    return last;
  }

  // Check game over conditions
  isGameOver() {
    const legalMoves = this.getLegalMoves();
    if (legalMoves.length === 0) {
      if (this.isCheck()) {
        return {
          over: true,
          result: 'checkmate',
          winner: this.turn === 'w' ? 'b' : 'w',
          reason: `Checkmate! ${this.turn === 'w' ? 'Black' : 'White'} wins.`
        };
      } else {
        return {
          over: true,
          result: 'stalemate',
          winner: null,
          reason: 'Stalemate! Game drawn.'
        };
      }
    }

    if (this.isInsufficientMaterial()) {
      return {
        over: true,
        result: 'insufficient_material',
        winner: null,
        reason: 'Draw by Insufficient Material.'
      };
    }

    if (this.halfmoveClock >= 100) {
      return {
        over: true,
        result: '50_move_rule',
        winner: null,
        reason: 'Draw by 50-move rule.'
      };
    }

    if (this.isThreefoldRepetition()) {
      return {
        over: true,
        result: 'threefold_repetition',
        winner: null,
        reason: 'Draw by Threefold Repetition.'
      };
    }

    return { over: false };
  }

  isInsufficientMaterial() {
    const pieces = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p) pieces.push({ ...p, r, c });
      }
    }

    // King vs King
    if (pieces.length === 2) return true;

    // King + Bishop vs King OR King + Knight vs King
    if (pieces.length === 3) {
      return pieces.some(p => p.type === 'b' || p.type === 'n');
    }

    // King + Bishop vs King + Bishop with bishops on same color
    if (pieces.length === 4) {
      const bishops = pieces.filter(p => p.type === 'b');
      if (bishops.length === 2 && bishops[0].color !== bishops[1].color) {
        const b1Color = (bishops[0].r + bishops[0].c) % 2;
        const b2Color = (bishops[1].r + bishops[1].c) % 2;
        if (b1Color === b2Color) return true;
      }
    }

    return false;
  }

  recordPosition() {
    const fen = this.generateFen(true); // simplify FEN without move counters for repetition check
    this.positionHistory.push(fen);
  }

  isThreefoldRepetition() {
    const current = this.positionHistory[this.positionHistory.length - 1];
    let count = 0;
    for (const fen of this.positionHistory) {
      if (fen === current) count++;
    }
    return count >= 3;
  }

  // FEN Generator
  generateFen(simplify = false) {
    const rows = [];
    for (let r = 0; r < 8; r++) {
      let empty = 0;
      let rowStr = '';
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (!p) {
          empty++;
        } else {
          if (empty > 0) {
            rowStr += empty;
            empty = 0;
          }
          const char = p.type;
          rowStr += p.color === 'w' ? char.toUpperCase() : char.toLowerCase();
        }
      }
      if (empty > 0) rowStr += empty;
      rows.push(rowStr);
    }

    let fen = rows.join('/');
    fen += ' ' + this.turn;

    // Castling
    let castlingStr = '';
    if (this.castling.wK) castlingStr += 'K';
    if (this.castling.wQ) castlingStr += 'Q';
    if (this.castling.bK) castlingStr += 'k';
    if (this.castling.bQ) castlingStr += 'q';
    fen += ' ' + (castlingStr || '-');

    // En passant
    if (this.enPassant) {
      fen += ' ' + ChessEngine.coordsToSquare(this.enPassant.r, this.enPassant.c);
    } else {
      fen += ' -';
    }

    if (!simplify) {
      fen += ` ${this.halfmoveClock} ${this.fullmoveNumber}`;
    }

    return fen;
  }

  loadFen(fen) {
    this.reset();
    const parts = fen.trim().split(/\s+/);
    if (parts.length < 4) return false;

    const rows = parts[0].split('/');
    if (rows.length !== 8) return false;

    // Clear board
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));

    for (let r = 0; r < 8; r++) {
      let c = 0;
      for (const ch of rows[r]) {
        if (ch >= '1' && ch <= '8') {
          c += parseInt(ch, 10);
        } else {
          const color = ch === ch.toUpperCase() ? 'w' : 'b';
          const type = ch.toLowerCase();
          this.board[r][c] = { color, type };
          c++;
        }
      }
    }

    this.turn = parts[1] === 'b' ? 'b' : 'w';

    const castling = parts[2];
    this.castling = {
      wK: castling.includes('K'),
      wQ: castling.includes('Q'),
      bK: castling.includes('k'),
      bQ: castling.includes('q')
    };

    if (parts[3] !== '-') {
      this.enPassant = ChessEngine.squareToCoords(parts[3]);
    } else {
      this.enPassant = null;
    }

    if (parts[4]) this.halfmoveClock = parseInt(parts[4], 10);
    if (parts[5]) this.fullmoveNumber = parseInt(parts[5], 10);

    this.positionHistory = [];
    this.recordPosition();
    return true;
  }

  // Material evaluation: calculate material score advantage (positive for White, negative for Black)
  getMaterialBalance() {
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p) {
          const val = values[p.type] || 0;
          score += (p.color === 'w' ? val : -val);
        }
      }
    }
    return score;
  }

  // Export PGN string
  exportPGN() {
    const date = new Date().toISOString().split('T')[0];
    let pgn = `[Event "Grandmaster Chess Live"]\n[Site "Localhost"]\n[Date "${date}"]\n[Round "1"]\n[White "White Player"]\n[Black "Black Player"]\n`;

    const gameOver = this.isGameOver();
    let result = '*';
    if (gameOver.over) {
      if (gameOver.winner === 'w') result = '1-0';
      else if (gameOver.winner === 'b') result = '0-1';
      else result = '1/2-1/2';
    }
    pgn += `[Result "${result}"]\n\n`;

    let movesStr = '';
    for (let i = 0; i < this.moveHistory.length; i++) {
      if (i % 2 === 0) {
        movesStr += `${Math.floor(i / 2) + 1}. `;
      }
      movesStr += `${this.moveHistory[i].san} `;
    }
    pgn += movesStr.trim() + ' ' + result;
    return pgn;
  }

  // Get board state, last move, and FEN at a specific historical move index
  getBoardAtHistoryIndex(index) {
    if (index < 0) {
      const startEngine = new ChessEngine();
      return {
        board: startEngine.board,
        lastMove: null,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        turn: 'w'
      };
    }
    const tempEngine = new ChessEngine();
    const limit = Math.min(index, this.moveHistory.length - 1);
    for (let i = 0; i <= limit; i++) {
      const h = this.moveHistory[i];
      tempEngine.makeMove({ from: h.from, to: h.to, promotion: h.promotion });
    }
    return {
      board: tempEngine.board,
      lastMove: this.moveHistory[limit],
      fen: tempEngine.generateFen(),
      turn: tempEngine.turn
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChessEngine;
}
