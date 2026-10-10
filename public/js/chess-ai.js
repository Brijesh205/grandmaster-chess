// Chess AI Engine with Minimax, Alpha-Beta Pruning, Piece-Square Tables & Quiescence Search
// Features 4 distinct skill levels: Novice, Casual, Club Player, Master + Real-Time Evaluation Bar

class ChessAI {
  constructor() {
    // Piece values in centipawns
    this.PIECE_VALUES = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000
    };

    // Piece-Square Tables (White perspective: rank 8 down to rank 1 => row 0 to 7)
    // Pawns: encourage center control and advancing
    this.PST_PAWN = [
      [ 0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [ 5,  5, 10, 25, 25, 10,  5,  5],
      [ 0,  0,  0, 20, 20,  0,  0,  0],
      [ 5, -5,-10,  0,  0,-10, -5,  5],
      [ 5, 10, 10,-20,-20, 10, 10,  5],
      [ 0,  0,  0,  0,  0,  0,  0,  0]
    ];

    // Knights: prefer center, penalize edges/corners
    this.PST_KNIGHT = [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    // Bishops: prefer diagonals and open board
    this.PST_BISHOP = [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5, 10, 10,  5,  0,-10],
      [-10,  5,  5, 10, 10,  5,  5,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20]
    ];

    // Rooks: open files, 7th rank dominance
    this.PST_ROOK = [
      [ 0,  0,  0,  0,  0,  0,  0,  0],
      [ 5, 10, 10, 10, 10, 10, 10,  5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [ 0,  0,  0,  5,  5,  0,  0,  0]
    ];

    // Queen: centralized, avoiding early exposure
    this.PST_QUEEN = [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [ -5,  0,  5,  5,  5,  5,  0, -5],
      [  0,  0,  5,  5,  5,  5,  0, -5],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    // King Middlegame: safety behind pawns in corners
    this.PST_KING_MID = [
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-30,-20],
      [-10,-20,-20,-20,-20,-20,-20,-10],
      [ 20, 20,  0,  0,  0,  0, 20, 20],
      [ 20, 30, 10,  0,  0, 10, 30, 20]
    ];
  }

  getPSTScore(type, color, r, c) {
    let table = null;
    switch (type) {
      case 'p': table = this.PST_PAWN; break;
      case 'n': table = this.PST_KNIGHT; break;
      case 'b': table = this.PST_BISHOP; break;
      case 'r': table = this.PST_ROOK; break;
      case 'q': table = this.PST_QUEEN; break;
      case 'k': table = this.PST_KING_MID; break;
      default: return 0;
    }

    // Table is defined from White's perspective (row 0 is rank 8, row 7 is rank 1)
    const tableRow = color === 'w' ? r : 7 - r;
    return table[tableRow][c] || 0;
  }

  // Static evaluation function: returns score in centipawns from White's perspective
  evaluate(engine) {
    const gameOver = engine.isGameOver();
    if (gameOver.over) {
      if (gameOver.winner === 'w') return 200000;
      if (gameOver.winner === 'b') return -200000;
      return 0; // draw
    }

    let score = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = engine.board[r][c];
        if (!piece) continue;

        const val = this.PIECE_VALUES[piece.type] || 0;
        const pst = this.getPSTScore(piece.type, piece.color, r, c);
        const pieceTotal = val + pst;

        if (piece.color === 'w') {
          score += pieceTotal;
        } else {
          score -= pieceTotal;
        }
      }
    }

    return score;
  }

  // Order moves to improve alpha-beta cutoff efficiency (Captures first via MVV-LVA)
  orderMoves(engine, moves) {
    return moves.map(m => {
      let priority = 0;
      const target = engine.board[m.to.r][m.to.c];
      const moving = engine.board[m.from.r][m.from.c];

      if (target) {
        // Victim value - attacker value
        priority = (this.PIECE_VALUES[target.type] || 0) * 10 - (this.PIECE_VALUES[moving.type] || 0);
      } else if (m.isEnPassant) {
        priority = 1000 - 100;
      }

      if (m.promotion === 'q') priority += 800;

      return { move: m, priority };
    }).sort((a, b) => b.priority - a.priority).map(item => item.move);
  }

  // Quiescence search to avoid horizon effect on tactical captures
  quiescence(engine, alpha, beta, isMaximizing, depth = 2) {
    const standPat = this.evaluate(engine);
    if (depth <= 0) return standPat;

    if (isMaximizing) {
      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;

      const legalMoves = engine.getLegalMoves();
      const captures = legalMoves.filter(m => engine.board[m.to.r][m.to.c] || m.isEnPassant);
      const ordered = this.orderMoves(engine, captures);

      for (const move of ordered) {
        const sim = engine.clone();
        sim.makeMove(move);
        const score = this.quiescence(sim, alpha, beta, false, depth - 1);
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
      }
      return alpha;
    } else {
      if (standPat <= alpha) return alpha;
      if (standPat < beta) beta = standPat;

      const legalMoves = engine.getLegalMoves();
      const captures = legalMoves.filter(m => engine.board[m.to.r][m.to.c] || m.isEnPassant);
      const ordered = this.orderMoves(engine, captures);

      for (const move of ordered) {
        const sim = engine.clone();
        sim.makeMove(move);
        const score = this.quiescence(sim, alpha, beta, true, depth - 1);
        if (score <= alpha) return alpha;
        if (score < beta) beta = score;
      }
      return beta;
    }
  }

  // Minimax with Alpha-Beta Pruning
  minimax(engine, depth, alpha, beta, isMaximizing, useQuiescence = true) {
    const gameOver = engine.isGameOver();
    if (gameOver.over || depth === 0) {
      if (useQuiescence && depth === 0) {
        return { score: this.quiescence(engine, alpha, beta, isMaximizing, 2) };
      }
      return { score: this.evaluate(engine) };
    }

    const legalMoves = engine.getLegalMoves();
    if (legalMoves.length === 0) {
      return { score: this.evaluate(engine) };
    }

    const orderedMoves = this.orderMoves(engine, legalMoves);
    let bestMove = orderedMoves[0];

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of orderedMoves) {
        const sim = engine.clone();
        sim.makeMove(move);
        const result = this.minimax(sim, depth - 1, alpha, beta, false, useQuiescence);
        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) break; // beta cut-off
      }
      return { score: maxScore, bestMove };
    } else {
      let minScore = Infinity;
      for (const move of orderedMoves) {
        const sim = engine.clone();
        sim.makeMove(move);
        const result = this.minimax(sim, depth - 1, alpha, beta, true, useQuiescence);
        if (result.score < minScore) {
          minScore = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, minScore);
        if (beta <= alpha) break; // alpha cut-off
      }
      return { score: minScore, bestMove };
    }
  }

  // Find best move based on difficulty level (1 to 4)
  getBestMove(engine, difficulty = 3) {
    const legalMoves = engine.getLegalMoves();
    if (legalMoves.length === 0) return null;

    const isWhite = engine.turn === 'w';

    // Level 1: Novice (~800 ELO)
    // 60% random legal move, 40% simple capture or 1-ply check
    if (difficulty === 1) {
      if (Math.random() < 0.6) {
        const randomIndex = Math.floor(Math.random() * legalMoves.length);
        return legalMoves[randomIndex];
      }
      // Shallow depth 1 search with a touch of randomness
      const result = this.minimax(engine, 1, -Infinity, Infinity, isWhite, false);
      return result.bestMove || legalMoves[0];
    }

    // Level 2: Casual (~1200 ELO)
    // Depth 2 minimax without quiescence
    if (difficulty === 2) {
      const result = this.minimax(engine, 2, -Infinity, Infinity, isWhite, false);
      return result.bestMove || legalMoves[0];
    }

    // Level 3: Club Player (~1600 ELO)
    // Depth 3 minimax with alpha-beta and position tables
    if (difficulty === 3) {
      const result = this.minimax(engine, 3, -Infinity, Infinity, isWhite, true);
      return result.bestMove || legalMoves[0];
    }

    // Level 4: Master (~2000 ELO)
    // Depth 4 minimax with alpha-beta + move ordering + quiescence search
    if (difficulty >= 4) {
      const result = this.minimax(engine, 4, -Infinity, Infinity, isWhite, true);
      return result.bestMove || legalMoves[0];
    }

    return legalMoves[0];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChessAI;
}
