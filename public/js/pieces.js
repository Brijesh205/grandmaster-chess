// Premium Vector SVG Chess Pieces Collection
// Includes Neo Modern, Classic Staunton, Woodcraft, and Cyber Neon styles.

const PIECE_STYLES = {
  // 1. NEO PRO (Default - Clean, crisp, perfectly symmetrical modern tournament set)
  neo: {
    // White Pieces
    'w-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <!-- Upright Centered Cross -->
        <path d="M22.5 5.5v6.5M19.5 8.5h6" stroke-width="1.8" stroke-linejoin="miter"/>
        <circle cx="22.5" cy="5.5" r="1.2" fill="url(#w-grad)"/>
        <!-- Symmetrical Crown -->
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z" fill="url(#w-grad)" stroke-linejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="url(#w-grad)"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/>
      </g>
    </svg>`,

    'w-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w-grad-q" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <g fill="url(#w-grad-q)" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <!-- 5 Coronet Pearls -->
        <circle cx="6" cy="12" r="2"/>
        <circle cx="14" cy="9" r="2"/>
        <circle cx="22.5" cy="7.5" r="2"/>
        <circle cx="31" cy="9" r="2"/>
        <circle cx="39" cy="12" r="2"/>
        <!-- Crown Rays -->
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z" stroke-linecap="butt"/>
        <!-- Body Skirt -->
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3.5-1 17.5-1 21 0m-20.5 3.5c3.5-1 16.5-1 20 0" fill="none"/>
      </g>
    </svg>`,

    'w-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w-grad-r" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <g fill="url(#w-grad-r)" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z" stroke-linecap="butt"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
        <path d="M14 9v3.5m6-3.5v3.5m5-3.5v3.5m5-3.5v3.5" fill="none"/>
        <path d="M12 35h21m-20-4h19m-18-13h17" fill="none"/>
      </g>
    </svg>`,

    'w-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w-grad-b" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <g fill="url(#w-grad-b)" stroke-linecap="butt">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z"/>
          <circle cx="22.5" cy="8" r="2.2"/>
        </g>
        <!-- Centered Miter Cross -->
        <path d="M22.5 14v6m-3-3h6" stroke="#1e293b" stroke-width="1.5" stroke-linejoin="miter"/>
        <path d="M17.5 26h10M15 30h15" stroke-linejoin="miter"/>
      </g>
    </svg>`,

    'w-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w-grad-n" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#w-grad-n)"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z" fill="url(#w-grad-n)"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#1e293b"/>
        <circle cx="15" cy="14" r="1.2" fill="#1e293b"/>
        <path d="M24.55 10.4s-.45 1.45.65 2.1c1.3.75 3.1 0 3.1 0m-4.4 7.5c2.5 1.5 6 1 6 1m-7.5 5c3 1.5 5.5 0 5.5 0m-8 6c2 .5 5.5 0 5.5 0"/>
      </g>
    </svg>`,

    'w-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w-grad-p" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <g fill="url(#w-grad-p)" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
        <path d="M12 36.5c4-1 17-1 21 0m-19.5 3c3.5-.5 14.5-.5 18 0" fill="none"/>
      </g>
    </svg>`,

    // Black Pieces
    'b-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <!-- Upright Centered Cross -->
        <path d="M22.5 5.5v6.5M19.5 8.5h6" stroke="#f1f5f9" stroke-width="1.8" stroke-linejoin="miter"/>
        <circle cx="22.5" cy="5.5" r="1.2" fill="#f1f5f9"/>
        <!-- Symmetrical Crown -->
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z" fill="url(#b-grad)" stroke-linejoin="miter"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="url(#b-grad)"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#94a3b8"/>
      </g>
    </svg>`,

    'b-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-grad-q" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <g fill="url(#b-grad-q)" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="12" r="2" fill="#e2e8f0"/>
        <circle cx="14" cy="9" r="2" fill="#e2e8f0"/>
        <circle cx="22.5" cy="7.5" r="2" fill="#e2e8f0"/>
        <circle cx="31" cy="9" r="2" fill="#e2e8f0"/>
        <circle cx="39" cy="12" r="2" fill="#e2e8f0"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z" stroke-linecap="butt"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3.5-1 17.5-1 21 0m-20.5 3.5c3.5-1 16.5-1 20 0" fill="none" stroke="#94a3b8"/>
      </g>
    </svg>`,

    'b-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-grad-r" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <g fill="url(#b-grad-r)" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z" stroke-linecap="butt"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
        <path d="M14 9v3.5m6-3.5v3.5m5-3.5v3.5m5-3.5v3.5" fill="none" stroke="#94a3b8"/>
        <path d="M12 35h21m-20-4h19m-18-13h17" fill="none" stroke="#94a3b8"/>
      </g>
    </svg>`,

    'b-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-grad-b" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <g fill="url(#b-grad-b)" stroke-linecap="butt">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z"/>
          <circle cx="22.5" cy="8" r="2.2"/>
        </g>
        <path d="M22.5 14v6m-3-3h6" stroke="#f1f5f9" stroke-width="1.5" stroke-linejoin="miter"/>
        <path d="M17.5 26h10M15 30h15" stroke="#94a3b8" stroke-linejoin="miter"/>
      </g>
    </svg>`,

    'b-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-grad-n" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#b-grad-n)"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z" fill="url(#b-grad-n)"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#f1f5f9"/>
        <circle cx="15" cy="14" r="1.2" fill="#f1f5f9"/>
        <path d="M24.55 10.4s-.45 1.45.65 2.1c1.3.75 3.1 0 3.1 0m-4.4 7.5c2.5 1.5 6 1 6 1m-7.5 5c3 1.5 5.5 0 5.5 0m-8 6c2 .5 5.5 0 5.5 0" stroke="#94a3b8"/>
      </g>
    </svg>`,

    'b-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-grad-p" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <g fill="url(#b-grad-p)" fill-rule="evenodd" stroke="#1e293b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
        <path d="M12 36.5c4-1 17-1 21 0m-19.5 3c3.5-.5 14.5-.5 18 0" fill="none" stroke="#94a3b8"/>
      </g>
    </svg>`
  },

  // 2. WOODCRAFT (Artisanal warm maple & dark rosewood)
  wood: {
    'w-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wd-w" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#78350f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 5.5v6.5M19.5 8.5h6" stroke-width="1.8"/>
        <circle cx="22.5" cy="5.5" r="1.2" fill="url(#wd-w)"/>
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z" fill="url(#wd-w)"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="url(#wd-w)"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#78350f"/>
      </g>
    </svg>`,

    'w-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wd-wq" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <g fill="url(#wd-wq)" stroke="#78350f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="12" r="2"/><circle cx="14" cy="9" r="2"/><circle cx="22.5" cy="7.5" r="2"/><circle cx="31" cy="9" r="2"/><circle cx="39" cy="12" r="2"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3.5-1 17.5-1 21 0m-20.5 3.5c3.5-1 16.5-1 20 0" fill="none" stroke="#78350f"/>
      </g>
    </svg>`,

    'w-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-wr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>
      <g fill="url(#wd-wr)" stroke="#78350f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
        <path d="M14 9v3.5m6-3.5v3.5m5-3.5v3.5m5-3.5v3.5" fill="none" stroke="#78350f"/>
      </g>
    </svg>`,

    'w-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-wb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>
      <g fill="none" stroke="#78350f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill="url(#wd-wb)"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z" fill="url(#wd-wb)"/>
        <circle cx="22.5" cy="8" r="2.2" fill="url(#wd-wb)"/>
        <path d="M22.5 14v6m-3-3h6" stroke="#78350f" stroke-width="1.5"/>
      </g>
    </svg>`,

    'w-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-wn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>
      <g fill="none" stroke="#78350f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#wd-wn)"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z" fill="url(#wd-wn)"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#78350f"/><circle cx="15" cy="14" r="1.2" fill="#78350f"/>
      </g>
    </svg>`,

    'w-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-wp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>
      <g fill="url(#wd-wp)" stroke="#78350f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
        <path d="M12 36.5c4-1 17-1 21 0" fill="none" stroke="#78350f"/>
      </g>
    </svg>`,

    // Black Wood
    'b-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0c02"/></linearGradient></defs>
      <g fill="none" stroke="#b45309" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 5.5v6.5M19.5 8.5h6" stroke="#fcd34d" stroke-width="1.8"/>
        <circle cx="22.5" cy="5.5" r="1.2" fill="#fcd34d"/>
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z" fill="url(#wd-b)"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="url(#wd-b)"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#d97706"/>
      </g>
    </svg>`,

    'b-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-bq" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0c02"/></linearGradient></defs>
      <g fill="url(#wd-bq)" stroke="#b45309" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="12" r="2" fill="#fcd34d"/><circle cx="14" cy="9" r="2" fill="#fcd34d"/><circle cx="22.5" cy="7.5" r="2" fill="#fcd34d"/><circle cx="31" cy="9" r="2" fill="#fcd34d"/><circle cx="39" cy="12" r="2" fill="#fcd34d"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0" fill="none" stroke="#d97706"/>
      </g>
    </svg>`,

    'b-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-br" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0c02"/></linearGradient></defs>
      <g fill="url(#wd-br)" stroke="#b45309" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
      </g>
    </svg>`,

    'b-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-bb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0c02"/></linearGradient></defs>
      <g fill="none" stroke="#b45309" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill="url(#wd-bb)"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z" fill="url(#wd-bb)"/>
        <circle cx="22.5" cy="8" r="2.2" fill="url(#wd-bb)"/>
        <path d="M22.5 14v6m-3-3h6" stroke="#fcd34d" stroke-width="1.5"/>
      </g>
    </svg>`,

    'b-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-bn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0c02"/></linearGradient></defs>
      <g fill="none" stroke="#b45309" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#wd-bn)"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z" fill="url(#wd-bn)"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#fcd34d"/><circle cx="15" cy="14" r="1.2" fill="#fcd34d"/>
      </g>
    </svg>`,

    'b-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wd-bp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0c02"/></linearGradient></defs>
      <g fill="url(#wd-bp)" stroke="#b45309" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
        <path d="M12 36.5c4-1 17-1 21 0" fill="none" stroke="#d97706"/>
      </g>
    </svg>`
  },

  // 3. CYBER NEON (Electric Cyan and Vibrant Magenta)
  // 3. CYBER NEON (Electric Cyan and Radiant Magenta - Solid High-Tech)
  cyber: {
    'w-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 5.5v6.5M19.5 8.5h6"/>
        <circle cx="22.5" cy="5.5" r="1.2" fill="#06b6d4"/>
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z"/>
      </g>
    </svg>`,

    'w-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="12" r="2" fill="#06b6d4"/><circle cx="14" cy="9" r="2" fill="#06b6d4"/><circle cx="22.5" cy="7.5" r="2" fill="#06b6d4"/><circle cx="31" cy="9" r="2" fill="#06b6d4"/><circle cx="39" cy="12" r="2" fill="#06b6d4"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
      </g>
    </svg>`,

    'w-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
      </g>
    </svg>`,

    'w-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z"/>
        <circle cx="22.5" cy="8" r="2.2" fill="#06b6d4"/>
      </g>
    </svg>`,

    'w-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#06b6d4"/>
      </g>
    </svg>`,

    'w-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
      </g>
    </svg>`,

    // Black Cyber
    'b-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#3b0764" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 5.5v6.5M19.5 8.5h6"/>
        <circle cx="22.5" cy="5.5" r="1.2" fill="#ec4899"/>
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z"/>
      </g>
    </svg>`,

    'b-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#3b0764" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="12" r="2" fill="#ec4899"/><circle cx="14" cy="9" r="2" fill="#ec4899"/><circle cx="22.5" cy="7.5" r="2" fill="#ec4899"/><circle cx="31" cy="9" r="2" fill="#ec4899"/><circle cx="39" cy="12" r="2" fill="#ec4899"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
      </g>
    </svg>`,

    'b-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#3b0764" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
      </g>
    </svg>`,

    'b-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#3b0764" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z"/>
        <circle cx="22.5" cy="8" r="2.2" fill="#ec4899"/>
      </g>
    </svg>`,

    'b-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#3b0764" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#ec4899"/>
      </g>
    </svg>`,

    'b-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <g fill="#3b0764" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
      </g>
    </svg>`
  },

  // 4. SOLID POLISHED GEMSTONE (Vivid Sapphire Blue & Radiant Ruby Crimson - Solid & Opaque!)
  crystal: {
    // White Pieces (Vivid Sapphire Azure Blue - Solid)
    'w-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cr-w" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 5.5v6.5M19.5 8.5h6" stroke="#0ea5e9" stroke-width="1.8"/>
        <circle cx="22.5" cy="5.5" r="1.3" fill="#38bdf8"/>
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z" fill="url(#cr-w)"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="url(#cr-w)"/>
        <!-- Polished Facets -->
        <path d="M22.5 14v16m-6-10l12 0" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#0ea5e9"/>
      </g>
    </svg>`,

    'w-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cr-wq" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
      </defs>
      <g fill="url(#cr-wq)" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="12" r="2" fill="#38bdf8"/><circle cx="14" cy="9" r="2" fill="#38bdf8"/><circle cx="22.5" cy="7.5" r="2" fill="#38bdf8"/><circle cx="31" cy="9" r="2" fill="#38bdf8"/><circle cx="39" cy="12" r="2" fill="#38bdf8"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
        <path d="M22.5 10v16M16 20h13" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0" fill="none" stroke="#0ea5e9"/>
      </g>
    </svg>`,

    'w-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-wr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs>
      <g fill="url(#cr-wr)" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
        <path d="M14 9v3.5m6-3.5v3.5m5-3.5v3.5m5-3.5v3.5" fill="none" stroke="#0ea5e9"/>
        <path d="M22.5 18v13" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1"/>
      </g>
    </svg>`,

    'w-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-wb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs>
      <g fill="none" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill="url(#cr-wb)"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z" fill="url(#cr-wb)"/>
        <circle cx="22.5" cy="8" r="2.2" fill="#38bdf8"/>
        <path d="M22.5 14v6m-3-3h6" stroke="#0ea5e9" stroke-width="1.5"/>
      </g>
    </svg>`,

    'w-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-wn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs>
      <g fill="none" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#cr-wn)"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z" fill="url(#cr-wn)"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#0284c7"/><circle cx="15" cy="14" r="1.2" fill="#38bdf8"/>
      </g>
    </svg>`,

    'w-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-wp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs>
      <g fill="url(#cr-wp)" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
        <path d="M12 36.5c4-1 17-1 21 0" fill="none" stroke="#0ea5e9"/>
      </g>
    </svg>`,

    // Black Pieces (Vivid Ruby Crimson - Solid)
    'b-k': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-bk" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#9f1239"/></linearGradient></defs>
      <g fill="none" stroke="#be123c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 5.5v6.5M19.5 8.5h6" stroke="#fb7185" stroke-width="1.8"/>
        <circle cx="22.5" cy="5.5" r="1.3" fill="#f43f5e"/>
        <path d="M22.5 25c2.5-4 4.5-8 3-11 0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 .5 7 3 11z" fill="url(#cr-bk)"/>
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7c0 0 9-4.5 6-10.5-4-6.5-13.5-3.5-16 4-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="url(#cr-bk)"/>
        <path d="M22.5 14v16m-6-10l12 0" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1"/>
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fb7185"/>
      </g>
    </svg>`,

    'b-q': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-bq" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#9f1239"/></linearGradient></defs>
      <g fill="url(#cr-bq)" stroke="#be123c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="12" r="2" fill="#f43f5e"/><circle cx="14" cy="9" r="2" fill="#f43f5e"/><circle cx="22.5" cy="7.5" r="2" fill="#f43f5e"/><circle cx="31" cy="9" r="2" fill="#f43f5e"/><circle cx="39" cy="12" r="2" fill="#f43f5e"/>
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-13.5-7.5 11.5-6-16.5-6 16.5-7.5-11.5L9 26z"/>
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
        <path d="M11.5 30c3.5-1 18.5-1 22 0" fill="none" stroke="#fb7185"/>
      </g>
    </svg>`,

    'b-r': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-br" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#9f1239"/></linearGradient></defs>
      <g fill="url(#cr-br)" stroke="#be123c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-4H9v4zm3-4v-4.5h21V35H12zm2-4.5l1.5-12.5h14l1.5 12.5H14z"/>
        <path d="M14 18h17V14H14v4zm-3-4l1.5-5h21l1.5 5H11z"/>
      </g>
    </svg>`,

    'b-b': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-bb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#9f1239"/></linearGradient></defs>
      <g fill="none" stroke="#be123c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill="url(#cr-bb)"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-3.5-5.5-.5-.5-1-1.5-1-2.5 2.5-2.5 5-4.5 4.5-9.5-1-5-6-7-8-7s-7 2-8 7c-.5 5 2 7 4.5 9.5 0 1-.5 2-1 2.5-1 1.5-3.5 3-3.5 5.5 0 0-.5.5 0 2z" fill="url(#cr-bb)"/>
        <circle cx="22.5" cy="8" r="2.2" fill="#f43f5e"/>
        <path d="M22.5 14v6m-3-3h6" stroke="#fb7185" stroke-width="1.5"/>
      </g>
    </svg>`,

    'b-n': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-bn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#9f1239"/></linearGradient></defs>
      <g fill="none" stroke="#be123c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="url(#cr-bn)"/>
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.932 1.28-2 1-1.06-.65-.5-1.5-.5-2.5 0-1.5.5-2 1-3.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 3-4.5 1-2.5 1-5 1-5 2-1.5 6-3.5 8-3.5 2 0 4 .5 5 2 1.5 2.5 1.5 5.5 0 7.5z" fill="url(#cr-bn)"/>
        <circle cx="9.5" cy="25.5" r="0.8" fill="#f43f5e"/><circle cx="15" cy="14" r="1.2" fill="#f43f5e"/>
      </g>
    </svg>`,

    'b-p': `<svg viewBox="0 0 45 45" class="chess-piece-svg" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr-bp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#9f1239"/></linearGradient></defs>
      <g fill="url(#cr-bp)" stroke="#be123c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>
        <path d="M12 36.5c4-1 17-1 21 0" fill="none" stroke="#fb7185"/>
      </g>
    </svg>`
  }
};

let currentPieceStyle = localStorage.getItem('chess_piece_style') || 'neo';

function setPieceStyle(styleName) {
  if (PIECE_STYLES[styleName] || styleName === 'emerald' || styleName === 'rainbow') {
    currentPieceStyle = styleName;
    localStorage.setItem('chess_piece_style', styleName);
    return true;
  }
  return false;
}

function getPieceStyle() {
  return currentPieceStyle;
}

function getPieceSvg(color, type, style = currentPieceStyle) {
  const key = `${color}-${type}`;
  const set = PIECE_STYLES[style] || PIECE_STYLES.crystal || PIECE_STYLES.neo;
  return set[key] || PIECE_STYLES.crystal[key] || PIECE_STYLES.neo[key] || '';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PIECE_STYLES, getPieceSvg, setPieceStyle, getPieceStyle };
}
