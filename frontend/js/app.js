/**
 * App - Controlador Central do Caça-Palavras Educativo
 * Saquarema & A.G Dev Solution
 */
(function() {
  'use strict';

  // Temas padrão embutidos (garantem funcionamento 100% offline via file://)
  const FALLBACK_THEMES = [
    {
      id: "sala_aula",
      title: "Festa na Sala de Aula",
      editionBadge: "EDIÇÃO: FESTA NA SALA DE AULA",
      image: "assets/images/sala_aula.jpg",
      sentence: "A <strong class=\"target-word\" data-clean=\"SALA\">SALA</strong> DE <strong class=\"target-word\" data-clean=\"AULA\">AULA</strong> SE ENCHE DE <strong class=\"target-word\" data-clean=\"ALEGRIA\">ALEGRIA</strong> E <strong class=\"target-word\" data-clean=\"FESTA\">FESTA</strong> PARA <strong class=\"target-word\" data-clean=\"COMEMORAR\">COMEMORAR</strong> O <strong class=\"target-word\" data-clean=\"ANIVERSARIO\">ANIVERSÁRIO</strong> NA <strong class=\"target-word\" data-clean=\"ESCOLA\">ESCOLA</strong>. ENTRE <strong class=\"target-word\" data-clean=\"CADERNOS\">CADERNOS</strong> E <strong class=\"target-word\" data-clean=\"SORRISOS\">SORRISOS</strong>, OS <strong class=\"target-word\" data-clean=\"AMIGOS\">AMIGOS</strong> SE REÚNEM PARA <strong class=\"target-word\" data-clean=\"CELEBRAR\">CELEBRAR</strong> ESSE <strong class=\"target-word\" data-clean=\"DIA\">DIA</strong> TÃO <strong class=\"target-word\" data-clean=\"ESPECIAL\">ESPECIAL</strong>.",
      words: [
        "SALA", "AULA", "ALEGRIA", "FESTA", "COMEMORAR", 
        "ANIVERSÁRIO", "ESCOLA", "CADERNOS", "SORRISOS", 
        "AMIGOS", "CELEBRAR", "DIA", "ESPECIAL"
      ]
    },
    {
      id: "cenario_melancia",
      title: "A Hora da Melancia",
      editionBadge: "EDIÇÃO: O FESTIVAL DA MELANCIA",
      image: "assets/images/cenario_melancia.jpg",
      sentence: "UMA GRANDE FATIA DOCE DE <strong class=\"target-word\" data-clean=\"MELANCIA\">MELANCIA</strong> REPLETA DE <strong class=\"target-word\" data-clean=\"SABOR\">SABOR</strong> É A ATRAÇÃO DO DIA. NA <strong class=\"target-word\" data-clean=\"CESTA\">CESTA</strong> DE <strong class=\"target-word\" data-clean=\"PIQUENIQUE\">PIQUENIQUE</strong> TEM <strong class=\"target-word\" data-clean=\"BOLO\">BOLO</strong>, <strong class=\"target-word\" data-clean=\"SORVETE\">SORVETE</strong>, <strong class=\"target-word\" data-clean=\"PIPOCA\">PIPOCA</strong> E <strong class=\"target-word\" data-clean=\"FRUTAS\">FRUTAS</strong> FRESCAS PARA <strong class=\"target-word\" data-clean=\"DIVIDIR\">DIVIDIR</strong> COM TODA A <strong class=\"target-word\" data-clean=\"GALERA\">GALERA</strong>.",
      words: [
        "MELANCIA", "SABOR", "CESTA", "PIQUENIQUE", 
        "BOLO", "SORVETE", "PIPOCA", "FRUTAS", "DIVIDIR", "GALERA"
      ]
    },
    {
      id: "quadro_planos",
      title: "O Quadro de Planos",
      editionBadge: "EDIÇÃO: O GRANDE PLANO SECRETO",
      image: "assets/images/quadro_planos.jpg",
      sentence: "COM SEU <strong class=\"target-word\" data-clean=\"GIZ\">GIZ</strong> E UMA <strong class=\"target-word\" data-clean=\"LOUSA\">LOUSA</strong> REPLETA DE <strong class=\"target-word\" data-clean=\"IDEIAS\">IDEIAS</strong>, DESENHA UM <strong class=\"target-word\" data-clean=\"PLANO\">PLANO</strong> CHEIO DE <strong class=\"target-word\" data-clean=\"MISTERIO\">MISTÉRIO</strong>. COM MUITA <strong class=\"target-word\" data-clean=\"ESTRATEGIA\">ESTRATÉGIA</strong> E <strong class=\"target-word\" data-clean=\"FOCO\">FOCO</strong>, CADA PASSO É TRAÇADO PARA VENCER O <strong class=\"target-word\" data-clean=\"DESAFIO\">DESAFIO</strong> E ALCANÇAR A <strong class=\"target-word\" data-clean=\"VITORIA\">VITÓRIA</strong>.",
      words: [
        "GIZ", "LOUSA", "IDEIAS", "PLANO", 
        "MISTÉRIO", "ESTRATÉGIA", "FOCO", "DESAFIO", "VITÓRIA"
      ]
    },
    {
      id: "bairro_amigos",
      title: "Brincadeiras no Bairro",
      editionBadge: "EDIÇÃO: BRINCADEIRAS NA PRAÇA",
      image: "assets/images/cenario_bairro.jpg",
      sentence: "NO CORAÇÃO DO <strong class=\"target-word\" data-clean=\"BAIRRO\">BAIRRO</strong>, OS <strong class=\"target-word\" data-clean=\"AMIGOS\">AMIGOS</strong> BRINCAM NA <strong class=\"target-word\" data-clean=\"PRACA\">PRAÇA</strong> SOB O <strong class=\"target-word\" data-clean=\"SOL\">SOL</strong>. CADA <strong class=\"target-word\" data-clean=\"RUA\">RUA</strong> GUARDA UMA <strong class=\"target-word\" data-clean=\"HISTORIA\">HISTÓRIA</strong> DIVERTIDA, COM MUITA <strong class=\"target-word\" data-clean=\"CORRIDA\">CORRIDA</strong>, <strong class=\"target-word\" data-clean=\"RISADAS\">RISADAS</strong> E PURA <strong class=\"target-word\" data-clean=\"ALEGRIA\">ALEGRIA</strong>.",
      words: [
        "BAIRRO", "AMIGOS", "PRAÇA", "SOL", 
        "RUA", "HISTÓRIA", "CORRIDA", "RISADAS", "ALEGRIA"
      ]
    }
  ];

  const GRID_SIZES = {
    easy: 10,
    medium: 12,
    hard: 14
  };

  // PIN de segurança para acesso à criação personalizada (Configuração Pedagógica)
  const ADMIN_PIN = '1269';

  // Paleta de cores vibrantes, lúdicas e bem contrastantes para cada palavra encontrada
  const WORD_COLORS = [
    { name: 'Azul Celeste', bg: '#7dd3fc', border: '#0284c7', text: '#0b192c', storyBg: 'rgba(2, 132, 199, 0.16)', storyText: '#0369a1', glow: 'rgba(2, 132, 199, 0.35)' },
    { name: 'Laranja Vivo', bg: '#fdba74', border: '#ea580c', text: '#0b192c', storyBg: 'rgba(234, 88, 12, 0.16)', storyText: '#c2410c', glow: 'rgba(234, 88, 12, 0.35)' },
    { name: 'Rosa Chiclete', bg: '#f9a8d4', border: '#db2777', text: '#0b192c', storyBg: 'rgba(219, 39, 119, 0.16)', storyText: '#be185d', glow: 'rgba(219, 39, 119, 0.35)' },
    { name: 'Verde Lima', bg: '#bef264', border: '#65a30d', text: '#0b192c', storyBg: 'rgba(101, 163, 13, 0.18)', storyText: '#4d7c0f', glow: 'rgba(101, 163, 13, 0.35)' },
    { name: 'Roxo Uva', bg: '#d8b4fe', border: '#9333ea', text: '#0b192c', storyBg: 'rgba(147, 51, 234, 0.16)', storyText: '#7e22ce', glow: 'rgba(147, 51, 234, 0.35)' },
    { name: 'Amarelo Girassol', bg: '#fde047', border: '#ca8a04', text: '#0b192c', storyBg: 'rgba(202, 138, 4, 0.18)', storyText: '#a16207', glow: 'rgba(202, 138, 4, 0.35)' },
    { name: 'Vermelho Coral', bg: '#fca5a5', border: '#dc2626', text: '#0b192c', storyBg: 'rgba(220, 38, 38, 0.16)', storyText: '#b91c1c', glow: 'rgba(220, 38, 38, 0.35)' },
    { name: 'Turquesa Oceano', bg: '#67e8f9', border: '#0891b2', text: '#0b192c', storyBg: 'rgba(8, 145, 178, 0.16)', storyText: '#0e7490', glow: 'rgba(8, 145, 178, 0.35)' },
    { name: 'Azul Índigo', bg: '#a5b4fc', border: '#4f46e5', text: '#0b192c', storyBg: 'rgba(79, 70, 229, 0.16)', storyText: '#4338ca', glow: 'rgba(79, 70, 229, 0.35)' },
    { name: 'Esmeralda', bg: '#6ee7b7', border: '#059669', text: '#0b192c', storyBg: 'rgba(5, 150, 105, 0.16)', storyText: '#047857', glow: 'rgba(5, 150, 105, 0.35)' },
    { name: 'Pêssego Quente', bg: '#fed7aa', border: '#f97316', text: '#0b192c', storyBg: 'rgba(249, 115, 22, 0.16)', storyText: '#c2410c', glow: 'rgba(249, 115, 22, 0.35)' },
    { name: 'Fúcsia Magenta', bg: '#f0abfc', border: '#c026d3', text: '#0b192c', storyBg: 'rgba(192, 38, 211, 0.16)', storyText: '#a21caf', glow: 'rgba(192, 38, 211, 0.35)' },
    { name: 'Verde Menta', bg: '#a7f3d0', border: '#10b981', text: '#0b192c', storyBg: 'rgba(16, 185, 129, 0.16)', storyText: '#047857', glow: 'rgba(16, 185, 129, 0.35)' },
    { name: 'Violeta Profundo', bg: '#c4b5fd', border: '#7c3aed', text: '#0b192c', storyBg: 'rgba(124, 58, 237, 0.16)', storyText: '#6d28d9', glow: 'rgba(124, 58, 237, 0.35)' },
    { name: 'Azul Petróleo', bg: '#5eead4', border: '#0d9488', text: '#0b192c', storyBg: 'rgba(13, 148, 136, 0.16)', storyText: '#0f766e', glow: 'rgba(13, 148, 136, 0.35)' },
    { name: 'Rosa Carmim', bg: '#fecdd3', border: '#e11d48', text: '#0b192c', storyBg: 'rgba(225, 29, 72, 0.16)', storyText: '#be123c', glow: 'rgba(225, 29, 72, 0.35)' }
  ];

  class WordSearchGame {
    constructor() {
      this.themes = FALLBACK_THEMES;
      this.currentThemeIndex = 0;
      this.currentTheme = this.themes[0];
      this.difficulty = 'medium';
      this.gridSize = GRID_SIZES.medium;

      // Estado de Jogo
      this.puzzle = null;
      this.gridData = [];
      this.wordsToFind = [];
      this.foundWords = new Set();
      this.cellColorsMap = new Map();
      this.foundWordColorsCount = 0;
      this.hintsRemaining = 3;
      this.score = 0;
      this.timerInterval = null;
      this.secondsElapsed = 0;
      this.isPlaying = false;

      // Mecânica de Arraste (Pointer Events)
      this.isDragging = false;
      this.startCell = null;
      this.currentCell = null;
      this.selectedCells = [];
      this.customImageData = null;
      this.enteredPin = '';

      this.cacheDom();
      this.bindEvents();
      this.loadThemes();
    }

    cacheDom() {
      this.dom = {
        coverScreen: document.getElementById('cover-screen'),
        coverThemeSelect: document.getElementById('cover-theme-select'),
        coverDiffSelect: document.getElementById('cover-diff-select'),
        btnStartGame: document.getElementById('btn-start-game'),

        gameContainer: document.getElementById('game-container'),
        timerDisplay: document.getElementById('timer-display'),
        scoreDisplay: document.getElementById('score-display'),
        btnHint: document.getElementById('btn-hint'),
        hintCounterBadge: document.getElementById('hint-counter-badge'),
        btnToggleAudio: document.getElementById('btn-toggle-audio'),
        audioIcon: document.getElementById('audio-icon'),
        btnOpenLeaderboard: document.getElementById('btn-open-leaderboard'),
        btnCustomModal: document.getElementById('btn-custom-modal'),
        btnBackMenu: document.getElementById('btn-back-menu'),
        btnFullscreen: document.getElementById('btn-fullscreen'),

        boardThemeTitle: document.getElementById('board-theme-title'),
        boardDifficultyBadge: document.getElementById('board-difficulty-badge'),
        gridContainer: document.getElementById('grid-container'),
        btnNewPuzzle: document.getElementById('btn-new-puzzle'),
        themeSelectGame: document.getElementById('theme-select-game'),

        editionBadge: document.getElementById('edition-badge'),
        sceneImage: document.getElementById('scene-image'),
        scenarioSentence: document.getElementById('scenario-sentence'),
        wordsProgress: document.getElementById('words-progress'),
        wordsGrid: document.getElementById('words-grid'),

        // Modais
        victoryModal: document.getElementById('victory-modal'),
        victoryTimeVal: document.getElementById('victory-time-val'),
        victoryScoreVal: document.getElementById('victory-score-val'),
        playerNameInput: document.getElementById('player-name-input'),
        btnSaveScore: document.getElementById('btn-save-score'),
        btnNextLevel: document.getElementById('btn-next-level'),
        btnPlayAgain: document.getElementById('btn-play-again'),
        btnCloseVictory: document.getElementById('btn-close-victory'),

        leaderboardModal: document.getElementById('leaderboard-modal'),
        leaderboardFilterDiff: document.getElementById('leaderboard-filter-diff'),
        leaderboardTableBody: document.getElementById('leaderboard-table-body'),
        btnCloseLeaderboard: document.getElementById('btn-close-leaderboard'),
        btnCloseLeaderboardAction: document.getElementById('btn-close-leaderboard-action'),

        // Modal de PIN (Segurança do Professor)
        pinModal: document.getElementById('pin-modal'),
        btnClosePin: document.getElementById('btn-close-pin'),
        btnPinCancel: document.getElementById('btn-pin-cancel'),
        pinDisplay: document.getElementById('pin-display'),
        pinDigitBoxes: document.querySelectorAll('.pin-digit-box'),
        pinHiddenInput: document.getElementById('pin-hidden-input'),
        pinErrorMsg: document.getElementById('pin-error-msg'),
        pinKeypad: document.querySelector('.pin-keypad'),

        customModal: document.getElementById('custom-modal'),
        customThemeTitle: document.getElementById('custom-theme-title'),
        customWordsInput: document.getElementById('custom-words-input'),
        customSentenceInput: document.getElementById('custom-sentence-input'),
        customImageFile: document.getElementById('custom-image-file'),
        customImageName: document.getElementById('custom-image-name'),
        customImagePreviewBox: document.getElementById('custom-image-preview-box'),
        customImagePreview: document.getElementById('custom-image-preview'),
        btnRemoveImage: document.getElementById('btn-remove-image'),
        btnGenerateCustom: document.getElementById('btn-generate-custom'),
        btnCancelCustom: document.getElementById('btn-cancel-custom'),
        btnCloseCustom: document.getElementById('btn-close-custom')
      };
    }

    bindEvents() {
      // Iniciar Jogo a partir da Cover
      this.dom.btnStartGame.addEventListener('click', () => {
        this.currentThemeIndex = this.themes.findIndex(t => t.id === this.dom.coverThemeSelect.value);
        if (this.currentThemeIndex === -1) this.currentThemeIndex = 0;
        this.currentTheme = this.themes[this.currentThemeIndex];
        this.difficulty = this.dom.coverDiffSelect.value;
        this.gridSize = GRID_SIZES[this.difficulty] || 12;

        this.dom.coverScreen.classList.add('hidden');
        this.startNewGame();
      });

      // Voltar ao Menu Inicial
      if (this.dom.btnFullscreen) {
        this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());
      }

      this.dom.btnBackMenu.addEventListener('click', () => {
        this.stopTimer();
        this.dom.coverScreen.classList.remove('hidden');
      });

      // Trocar Tema no Jogo
      this.dom.themeSelectGame.addEventListener('change', (e) => {
        const id = e.target.value;
        const idx = this.themes.findIndex(t => t.id === id);
        if (idx !== -1) {
          this.currentThemeIndex = idx;
          this.currentTheme = this.themes[idx];
          this.startNewGame();
        }
      });

      // Botão Nova Grade
      this.dom.btnNewPuzzle.addEventListener('click', () => {
        this.startNewGame();
      });

      // Botão Dica
      this.dom.btnHint.addEventListener('click', () => {
        this.useHint();
      });

      // Alternar Áudio
      this.dom.btnToggleAudio.addEventListener('click', () => {
        const muted = window.soundEngine.toggleMute();
        this.updateAudioIcon(muted);
      });

      // Modais
      this.dom.btnOpenLeaderboard.addEventListener('click', () => this.openLeaderboard());
      this.dom.btnCloseLeaderboard.addEventListener('click', () => this.closeModal(this.dom.leaderboardModal));
      this.dom.btnCloseLeaderboardAction.addEventListener('click', () => this.closeModal(this.dom.leaderboardModal));
      this.dom.leaderboardFilterDiff.addEventListener('change', () => this.renderLeaderboardTable());

      this.dom.btnCustomModal.addEventListener('click', () => this.openPinModal());

      if (this.dom.btnClosePin) {
        this.dom.btnClosePin.addEventListener('click', () => {
          this.closeModal(this.dom.pinModal);
          this.resetPin();
        });
      }
      if (this.dom.btnPinCancel) {
        this.dom.btnPinCancel.addEventListener('click', () => {
          this.closeModal(this.dom.pinModal);
          this.resetPin();
        });
      }
      if (this.dom.pinKeypad) {
        this.dom.pinKeypad.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          if (btn.dataset.digit !== undefined) {
            this.handlePinDigit(btn.dataset.digit);
          } else if (btn.id === 'btn-pin-backspace') {
            this.handlePinBackspace();
          } else if (btn.id === 'btn-pin-clear') {
            this.handlePinClear();
          }
        });
      }
      if (this.dom.pinHiddenInput) {
        this.dom.pinHiddenInput.addEventListener('input', (e) => {
          const val = e.target.value.replace(/[^0-9]/g, '');
          if (val.length > 0) {
            for (let i = 0; i < val.length; i++) {
              this.handlePinDigit(val[i]);
            }
          }
          e.target.value = '';
        });
      }

      this.dom.btnCloseCustom.addEventListener('click', () => {
        this.clearCustomImage();
        this.closeModal(this.dom.customModal);
      });
      this.dom.btnCancelCustom.addEventListener('click', () => {
        this.clearCustomImage();
        this.closeModal(this.dom.customModal);
      });
      this.dom.btnGenerateCustom.addEventListener('click', () => this.handleGenerateCustom());

      if (this.dom.customImageFile) {
        this.dom.customImageFile.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            if (!file.type.startsWith('image/')) {
              alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, etc.).');
              return;
            }
            const reader = new FileReader();
            reader.onload = (loadEvt) => {
              this.customImageData = loadEvt.target.result;
              this.dom.customImagePreview.src = this.customImageData;
              this.dom.customImagePreviewBox.style.display = 'block';
              this.dom.customImageName.textContent = file.name;
            };
            reader.readAsDataURL(file);
          }
        });
      }

      if (this.dom.btnRemoveImage) {
        this.dom.btnRemoveImage.addEventListener('click', () => {
          this.clearCustomImage();
        });
      }

      this.dom.btnCloseVictory.addEventListener('click', () => this.closeModal(this.dom.victoryModal));
      this.dom.btnPlayAgain.addEventListener('click', () => {
        this.closeModal(this.dom.victoryModal);
        this.startNewGame();
      });
      this.dom.btnNextLevel.addEventListener('click', () => {
        this.closeModal(this.dom.victoryModal);
        this.nextLevel();
      });
      this.dom.btnSaveScore.addEventListener('click', () => this.saveScore());

      // Mecânica de Arraste na Grade (Pointer Events para touch e mouse unificados)
      const grid = this.dom.gridContainer;
      grid.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      window.addEventListener('pointermove', (e) => this.onPointerMove(e));
      window.addEventListener('pointerup', (e) => this.onPointerUp(e));
      window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

      // Atalhos de Teclado
      window.addEventListener('keydown', (e) => {
        // Se o modal de PIN de segurança estiver aberto, captura números e controle
        if (this.dom.pinModal && this.dom.pinModal.classList.contains('open')) {
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            this.handlePinDigit(e.key);
            return;
          } else if (e.key === 'Backspace') {
            e.preventDefault();
            this.handlePinBackspace();
            return;
          } else if (e.key === 'Escape') {
            e.preventDefault();
            this.closeModal(this.dom.pinModal);
            this.resetPin();
            return;
          }
        }

        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'h' || e.key === 'H') {
          this.useHint();
        } else if (e.key === 'm' || e.key === 'M') {
          const muted = window.soundEngine.toggleMute();
          this.updateAudioIcon(muted);
        } else if (e.key === 'Escape') {
          this.closeAllModals();
        }
      });
    }

    async loadThemes() {
      try {
        const res = await fetch('/api/themes');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            this.themes = data;
          }
        }
      } catch (err) {
        // Modo offline: usa FALLBACK_THEMES
      }
      this.populateThemeSelectors();
    }

    populateThemeSelectors() {
      // Povoar seletor da Cover
      this.dom.coverThemeSelect.innerHTML = '';
      this.dom.themeSelectGame.innerHTML = '';

      this.themes.forEach(theme => {
        const opt1 = document.createElement('option');
        opt1.value = theme.id;
        opt1.textContent = theme.title;
        this.dom.coverThemeSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = theme.id;
        opt2.textContent = theme.title;
        this.dom.themeSelectGame.appendChild(opt2);
      });
    }

    updateAudioIcon(muted) {
      this.dom.audioIcon.textContent = muted ? '🔇' : '🔊';
    }

    /**
     * Extrai as palavras-alvo a partir das marcações em negrito na frase da história
     */
    extractWordsFromSentence(sentence) {
      const words = [];
      if (!sentence) return words;

      // 1. Tags HTML <strong class="target-word"> ou <strong> ou <b>
      const htmlRegex = /<(?:strong|b)[^>]*>([^<]+)<\/(?:strong|b)>/gi;
      let m;
      while ((m = htmlRegex.exec(sentence)) !== null) {
        const w = m[1].trim();
        if (w && !words.includes(w)) {
          words.push(w);
        }
      }

      // 2. Formato Markdown **palavra**
      if (words.length === 0) {
        const mdRegex = /\*\*([^*]+)\*\*/g;
        while ((m = mdRegex.exec(sentence)) !== null) {
          const w = m[1].trim();
          if (w && !words.includes(w)) {
            words.push(w);
          }
        }
      }

      return words;
    }

    /**
     * Formata a frase da história garantindo tags <strong class="target-word" data-clean="...">
     */
    formatSentenceHtml(sentence) {
      if (!sentence) return '';

      // Se já possui as classes target-word configuradas, apenas retorna
      if (sentence.includes('class="target-word"')) {
        return sentence;
      }

      // Converte Markdown **palavra**
      let formatted = sentence.replace(/\*\*([^*]+)\*\*/g, (match, word) => {
        const clean = window.WordFind.normalizeWord(word);
        return `<strong class="target-word" data-clean="${clean}">${word}</strong>`;
      });

      // Converte <strong> ou <b> simples
      formatted = formatted.replace(/<(strong|b)>([^<]+)<\/\1>/gi, (match, tag, word) => {
        const clean = window.WordFind.normalizeWord(word);
        return `<strong class="target-word" data-clean="${clean}">${word}</strong>`;
      });

      return formatted;
    }

    startNewGame() {
      this.stopTimer();
      this.secondsElapsed = 0;
      this.score = 0;
      this.hintsRemaining = 3;
      this.foundWords.clear();
      this.cellColorsMap.clear();
      this.foundWordColorsCount = 0;
      this.isPlaying = true;
      this.updateScoreDisplay();
      this.updateHintBadge();
      this.dom.themeSelectGame.value = this.currentTheme.id;

      // Atualiza cabeçalhos
      this.dom.boardThemeTitle.textContent = this.currentTheme.title;
      this.dom.boardDifficultyBadge.textContent = 
        this.difficulty === 'easy' ? 'Fácil' : (this.difficulty === 'hard' ? 'Difícil' : 'Médio');

      // Atualiza ilustração e frase formatada com palavras em negrito
      this.dom.editionBadge.innerHTML = `<span>${this.currentTheme.editionBadge || 'EDIÇÃO ESPECIAL'}</span> <span>⭐</span>`;
      this.dom.sceneImage.src = this.currentTheme.image || 'assets/images/sala_aula.jpg';
      this.dom.scenarioSentence.innerHTML = this.formatSentenceHtml(this.currentTheme.sentence || '');

      // As palavras para encontrar na grade são extraídas diretamente das palavras em negrito na História da Edição!
      let wordsToUse = this.extractWordsFromSentence(this.currentTheme.sentence);
      if (!wordsToUse || wordsToUse.length === 0) {
        wordsToUse = this.currentTheme.words || [];
      }

      // Gera tabuleiro procedural
      this.puzzle = window.WordFind.newPuzzle(wordsToUse, {
        width: this.gridSize,
        height: this.gridSize,
        difficulty: this.difficulty,
        maxAttempts: 60
      });

      this.gridData = this.puzzle.grid;
      this.wordsToFind = this.puzzle.placedWords;

      this.renderGrid();
      this.renderWordsList();
      this.updateProgressCounter();
      this.startTimer();
    }

    toggleFullscreen() {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          const el = document.documentElement;
          if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
          } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      } catch (err) {}
    }

    updateFullscreenButton() {
      if (!this.dom.btnFullscreen) return;
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
      this.dom.btnFullscreen.innerHTML = isFull 
        ? '<span>🗗</span> <span>Tela Normal</span>' 
        : '<span>⛶</span> <span>Tela Cheia</span>';
      this.dom.btnFullscreen.title = isFull ? 'Sair da Tela Cheia (F11)' : 'Alternar Tela Cheia (F11)';
    }

    renderGrid() {
      const container = this.dom.gridContainer;
      container.innerHTML = '';
      container.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          const cell = document.createElement('div');
          cell.className = 'grid-cell';
          cell.dataset.x = x;
          cell.dataset.y = y;
          cell.textContent = this.gridData[y][x];
          container.appendChild(cell);
        }
      }
    }

    renderWordsList() {
      if (!this.dom.wordsGrid) return;
      const container = this.dom.wordsGrid;
      container.innerHTML = '';

      this.wordsToFind.forEach(wordObj => {
        const tag = document.createElement('div');
        tag.className = 'word-tag';
        tag.dataset.clean = wordObj.clean;
        tag.id = `tag-${wordObj.clean}`;
        tag.innerHTML = `<span>○</span> <span>${wordObj.original}</span>`;
        container.appendChild(tag);
      });
    }

    updateProgressCounter() {
      if (this.dom.wordsProgress) {
        this.dom.wordsProgress.textContent = `${this.foundWords.size} / ${this.wordsToFind.length} encontradas`;
      }
    }

    // ----------------------------------------------------
    // Mecânica de Arraste e Seleção de Células
    // ----------------------------------------------------
    getCellFromPoint(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      if (el && el.classList.contains('grid-cell')) {
        return {
          x: parseInt(el.dataset.x, 10),
          y: parseInt(el.dataset.y, 10),
          element: el
        };
      }
      return null;
    }

    onPointerDown(e) {
      if (!this.isPlaying) return;
      const cell = this.getCellFromPoint(e.clientX, e.clientY);
      if (!cell) return;

      this.isDragging = true;
      this.startCell = cell;
      this.currentCell = cell;
      this.selectedCells = [cell];
      this.updateSelectionVisuals();
      window.soundEngine.playSelect();
    }

    onPointerMove(e) {
      if (!this.isDragging || !this.isPlaying) return;
      const cell = this.getCellFromPoint(e.clientX, e.clientY);
      if (!cell || (cell.x === this.currentCell.x && cell.y === this.currentCell.y)) return;

      this.currentCell = cell;
      this.calculateLineSelection();
      this.updateSelectionVisuals();
    }

    onPointerUp(e) {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.checkSelectedWord();
      this.clearSelectionVisuals();
    }

    calculateLineSelection() {
      const dx = this.currentCell.x - this.startCell.x;
      const dy = this.currentCell.y - this.startCell.y;

      const stepX = Math.sign(dx);
      const stepY = Math.sign(dy);

      // Trava em direções válidas: horizontal, vertical ou diagonal perfeita (45 graus)
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      let isHorizontal = dy === 0;
      let isVertical = dx === 0;
      let isDiagonal = absDx === absDy;

      if (!isHorizontal && !isVertical && !isDiagonal) {
        return; // Não altera se estiver fora de linha reta
      }

      const length = Math.max(absDx, absDy) + 1;
      const cells = [];

      for (let i = 0; i < length; i++) {
        const x = this.startCell.x + i * stepX;
        const y = this.startCell.y + i * stepY;
        const el = this.dom.gridContainer.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
        if (el) {
          cells.push({ x, y, element: el });
        }
      }

      this.selectedCells = cells;
    }

    updateSelectionVisuals() {
      this.dom.gridContainer.querySelectorAll('.grid-cell.selected').forEach(c => c.classList.remove('selected'));
      this.selectedCells.forEach(c => c.element.classList.add('selected'));
    }

    clearSelectionVisuals() {
      this.dom.gridContainer.querySelectorAll('.grid-cell.selected').forEach(c => c.classList.remove('selected'));
      this.selectedCells = [];
    }

    checkSelectedWord() {
      if (this.selectedCells.length < 2) return;

      const forwardWord = this.selectedCells.map(c => this.gridData[c.y][c.x]).join('');
      const backwardWord = forwardWord.split('').reverse().join('');

      let matchedWord = this.wordsToFind.find(w => 
        !this.foundWords.has(w.clean) && (w.clean === forwardWord || w.clean === backwardWord)
      );

      if (matchedWord) {
        // Palavra Encontrada com Sucesso!
        this.foundWords.add(matchedWord.clean);
        window.soundEngine.playSuccess();

        // Atribui uma cor única da paleta para esta palavra encontrada
        const color = WORD_COLORS[this.foundWordColorsCount % WORD_COLORS.length];
        this.foundWordColorsCount++;

        // Destaca permanentemente na grade com a cor exclusiva
        this.selectedCells.forEach(c => {
          c.element.classList.add('found');
          c.element.classList.remove('hint');

          const key = `${c.x},${c.y}`;
          let cellColors = this.cellColorsMap.get(key);
          if (!cellColors) {
            cellColors = [];
            this.cellColorsMap.set(key, cellColors);
          }
          if (!cellColors.includes(color)) {
            cellColors.push(color);
          }

          this.applyCellColor(c.element, cellColors);
        });

        // Atualiza a Tag na lista (caso exista)
        const tag = document.getElementById(`tag-${matchedWord.clean}`);
        if (tag) {
          tag.classList.add('found');
          tag.innerHTML = `<span>✓</span> <span>${matchedWord.original}</span>`;
          tag.style.backgroundColor = color.storyBg || color.bg;
          tag.style.color = color.storyText || color.text;
          tag.style.borderColor = color.border;
        }

        // Destaca na Frase da História com a MESMA cor da palavra encontrada!
        const sentenceHighlights = this.dom.scenarioSentence.querySelectorAll(`.target-word[data-clean="${matchedWord.clean}"]`);
        sentenceHighlights.forEach(el => {
          el.classList.add('found-word');
          el.classList.remove('hint-word');
          el.style.backgroundColor = color.storyBg || color.bg;
          el.style.color = color.storyText || color.text;
          el.style.borderColor = color.border;
          el.style.borderBottomColor = color.border;
          el.style.boxShadow = `0 2px 8px ${color.glow}`;
        });

        // Pontuação: 100 base + bônus de tamanho e dificuldade
        const diffMultiplier = this.difficulty === 'hard' ? 1.5 : (this.difficulty === 'medium' ? 1.2 : 1.0);
        this.score += Math.round((100 + matchedWord.clean.length * 20) * diffMultiplier);
        this.updateScoreDisplay();
        this.updateProgressCounter();

        // Checa Vitória
        if (this.foundWords.size === this.wordsToFind.length) {
          this.handleVictory();
        }
      }
    }

    applyCellColor(element, cellColors) {
      if (!cellColors || cellColors.length === 0) {
        element.style.backgroundColor = '';
        element.style.backgroundImage = '';
        element.style.color = '';
        element.style.borderColor = '';
        element.style.borderWidth = '';
        element.style.boxShadow = '';
        return;
      }

      if (cellColors.length === 1) {
        const c = cellColors[0];
        element.style.backgroundColor = c.bg;
        element.style.backgroundImage = 'none';
        element.style.color = c.text;
        element.style.borderColor = c.border;
        element.style.borderWidth = '2px';
        element.style.boxShadow = `0 2px 5px ${c.glow}`;
      } else if (cellColors.length === 2) {
        const c1 = cellColors[0];
        const c2 = cellColors[1];
        // Gradiente diagonal dividido entre as duas palavras que se cruzam
        element.style.backgroundColor = '';
        element.style.backgroundImage = `linear-gradient(135deg, ${c1.bg} 0%, ${c1.bg} 48%, ${c2.bg} 52%, ${c2.bg} 100%)`;
        element.style.color = '#0b192c';
        element.style.borderColor = c2.border;
        element.style.borderWidth = '2px';
        element.style.boxShadow = `inset 0 0 0 1.5px ${c1.border}, 0 2px 6px rgba(0, 0, 0, 0.25)`;
      } else {
        const step = 100 / cellColors.length;
        const stops = cellColors.map((c, i) => `${c.bg} ${Math.round(i * step)}%, ${c.bg} ${Math.round((i + 1) * step)}%`).join(', ');
        element.style.backgroundColor = '';
        element.style.backgroundImage = `linear-gradient(135deg, ${stops})`;
        element.style.color = '#0b192c';
        element.style.borderColor = cellColors[cellColors.length - 1].border;
        element.style.borderWidth = '2px';
        element.style.boxShadow = `inset 0 0 0 1.5px ${cellColors[0].border}, 0 2px 6px rgba(0, 0, 0, 0.25)`;
      }
    }

    useHint() {
      if (this.hintsRemaining <= 0 || !this.isPlaying) return;

      const unfound = this.wordsToFind.filter(w => !this.foundWords.has(w.clean));
      if (unfound.length === 0) return;

      // Escolhe uma palavra não encontrada aleatoriamente
      const target = unfound[Math.floor(Math.random() * unfound.length)];
      const firstCell = target.path[0];

      const cellEl = this.dom.gridContainer.querySelector(`.grid-cell[data-x="${firstCell.x}"][data-y="${firstCell.y}"]`);
      if (cellEl) {
        cellEl.classList.add('hint');
        window.soundEngine.playHint();
        this.hintsRemaining--;
        this.updateHintBadge();

        // Também destaca a palavra em negrito na história para guiar o jogador
        const wordEl = this.dom.scenarioSentence.querySelector(`.target-word[data-clean="${target.clean}"]`);
        if (wordEl) {
          wordEl.classList.add('hint-word');
          setTimeout(() => {
            wordEl.classList.remove('hint-word');
          }, 4500);
        }

        setTimeout(() => {
          cellEl.classList.remove('hint');
          const key = `${firstCell.x},${firstCell.y}`;
          const existingColors = this.cellColorsMap.get(key);
          if (existingColors && existingColors.length > 0) {
            this.applyCellColor(cellEl, existingColors);
          }
        }, 5000);
      }
    }

    updateHintBadge() {
      this.dom.hintCounterBadge.textContent = `(${this.hintsRemaining})`;
    }

    updateScoreDisplay() {
      this.dom.scoreDisplay.textContent = `${this.score} pts`;
    }

    startTimer() {
      this.stopTimer();
      this.timerInterval = setInterval(() => {
        this.secondsElapsed++;
        const mins = String(Math.floor(this.secondsElapsed / 60)).padStart(2, '0');
        const secs = String(this.secondsElapsed % 60).padStart(2, '0');
        this.dom.timerDisplay.textContent = `${mins}:${secs}`;
      }, 1000);
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    handleVictory() {
      this.stopTimer();
      this.isPlaying = false;

      // Bônus de tempo
      const timeBonus = Math.max(0, 500 - this.secondsElapsed * 3);
      this.score += timeBonus;
      this.updateScoreDisplay();

      // Confetes e Som
      window.soundEngine.playVictory();
      window.confettiCannon.fire(4000);

      const mins = String(Math.floor(this.secondsElapsed / 60)).padStart(2, '0');
      const secs = String(this.secondsElapsed % 60).padStart(2, '0');
      this.dom.victoryTimeVal.textContent = `${mins}:${secs}`;
      this.dom.victoryScoreVal.textContent = this.score.toLocaleString('pt-BR');

      this.openModal(this.dom.victoryModal);
    }

    nextLevel() {
      this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
      this.currentTheme = this.themes[this.currentThemeIndex];
      this.startNewGame();
    }

    async saveScore() {
      const name = this.dom.playerNameInput.value.trim() || 'Jogador da Turminha';
      const scoreObj = {
        name,
        score: this.score,
        themeId: this.currentTheme.id,
        difficulty: this.difficulty,
        timeSeconds: this.secondsElapsed
      };

      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scoreObj)
        });
      } catch (e) {
        // Salva em localStorage no modo offline
        const localScores = JSON.parse(localStorage.getItem('caca_palavras_scores') || '[]');
        localScores.push({ ...scoreObj, id: `local-${Date.now()}`, date: new Date().toISOString().split('T')[0] });
        localScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('caca_palavras_scores', JSON.stringify(localScores.slice(0, 50)));
      }

      this.closeModal(this.dom.victoryModal);
      this.openLeaderboard();
    }

    async openLeaderboard() {
      this.openModal(this.dom.leaderboardModal);
      await this.renderLeaderboardTable();
    }

    async renderLeaderboardTable() {
      let scores = [];
      try {
        const res = await fetch('/api/scores');
        if (res.ok) {
          scores = await res.json();
        } else {
          throw new Error();
        }
      } catch (e) {
        scores = JSON.parse(localStorage.getItem('caca_palavras_scores') || '[]');
        if (scores.length === 0) {
          scores = [
            { name: 'Lucas', score: 2100, difficulty: 'hard', timeSeconds: 40 },
            { name: 'Sofia', score: 1980, difficulty: 'hard', timeSeconds: 65 },
            { name: 'Gabriel', score: 1850, difficulty: 'medium', timeSeconds: 48 },
            { name: 'Beatriz', score: 1620, difficulty: 'easy', timeSeconds: 35 },
            { name: 'Léo', score: 1540, difficulty: 'easy', timeSeconds: 42 }
          ];
        }
      }

      const filter = this.dom.leaderboardFilterDiff.value;
      if (filter !== 'all') {
        scores = scores.filter(s => s.difficulty === filter);
      }

      this.dom.leaderboardTableBody.innerHTML = '';
      if (scores.length === 0) {
        this.dom.leaderboardTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:12px;">Nenhuma pontuação registrada nesta dificuldade.</td></tr>`;
        return;
      }

      scores.forEach((s, idx) => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #e2e8f0';
        const mins = String(Math.floor(s.timeSeconds / 60)).padStart(2, '0');
        const secs = String(s.timeSeconds % 60).padStart(2, '0');
        row.innerHTML = `
          <td style="padding: 8px; font-weight:700;">${idx + 1}º</td>
          <td style="padding: 8px;">${s.name}</td>
          <td style="padding: 8px; font-weight:700; color:var(--comic-red);">${s.score}</td>
          <td style="padding: 8px;">${mins}:${secs}</td>
        `;
        this.dom.leaderboardTableBody.appendChild(row);
      });
    }

    handleGenerateCustom() {
      const title = this.dom.customThemeTitle.value.trim() || 'Minha Fase Especial';
      const rawWords = this.dom.customWordsInput.value.split(/[,;\n]+/).map(w => w.trim()).filter(w => w.length > 1);
      let sentence = this.dom.customSentenceInput.value.trim();

      if (rawWords.length < 3) {
        alert('Por favor, digite pelo menos 3 palavras para o caça-palavras!');
        return;
      }

      // Se o usuário digitou uma frase mas não colocou marcações em negrito,
      // destaca automaticamente as palavras digitadas dentro da história:
      if (sentence) {
        if (!sentence.includes('target-word') && !sentence.includes('**')) {
          rawWords.forEach(word => {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            sentence = sentence.replace(regex, '**$1**');
          });
        }
      } else {
        // Se não digitou frase, gera uma história com as palavras em negrito:
        sentence = `Nesta história especial, encontre no caça-palavras as seguintes palavras: ${rawWords.map(w => `**${w}**`).join(', ')}.`;
      }

      const customTheme = {
        id: `custom_${Date.now()}`,
        title,
        editionBadge: `EDIÇÃO DO CRIADOR: ${title.toUpperCase()}`,
        image: this.customImageData || 'assets/images/sala_aula.jpg',
        sentence: sentence,
        words: rawWords
      };

      this.themes.push(customTheme);
      this.populateThemeSelectors();
      this.currentTheme = customTheme;
      this.closeModal(this.dom.customModal);
      this.clearCustomImage();
      this.dom.customThemeTitle.value = '';
      this.dom.customWordsInput.value = '';
      this.dom.customSentenceInput.value = '';
      this.dom.coverScreen.classList.add('hidden');
      this.startNewGame();
    }

    clearCustomImage() {
      this.customImageData = null;
      if (this.dom.customImageFile) this.dom.customImageFile.value = '';
      if (this.dom.customImagePreviewBox) this.dom.customImagePreviewBox.style.display = 'none';
      if (this.dom.customImagePreview) this.dom.customImagePreview.src = '';
      if (this.dom.customImageName) this.dom.customImageName.textContent = 'Nenhum arquivo (usará imagem padrão)';
    }

    openModal(modal) {
      if (modal) modal.classList.add('open');
    }

    closeModal(modal) {
      if (modal) modal.classList.remove('open');
    }

    closeAllModals() {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      this.resetPin();
    }

    // ----------------------------------------------------
    // Gestão do PIN de Segurança para Criação de Fases
    // ----------------------------------------------------
    openPinModal() {
      this.resetPin();
      this.openModal(this.dom.pinModal);
      if (this.dom.pinHiddenInput) {
        setTimeout(() => {
          try { this.dom.pinHiddenInput.focus(); } catch (err) {}
        }, 150);
      }
    }

    resetPin() {
      this.enteredPin = '';
      if (this.dom.pinHiddenInput) this.dom.pinHiddenInput.value = '';
      if (this.dom.pinErrorMsg) this.dom.pinErrorMsg.style.display = 'none';
      this.updatePinDisplay();
    }

    handlePinDigit(digit) {
      if (this.enteredPin.length >= 4) return;
      this.enteredPin += String(digit);
      if (this.dom.pinErrorMsg) this.dom.pinErrorMsg.style.display = 'none';
      this.updatePinDisplay();
      if (window.soundEngine) window.soundEngine.playSelect();

      if (this.enteredPin.length === 4) {
        this.verifyPin();
      }
    }

    handlePinBackspace() {
      if (this.enteredPin.length > 0) {
        this.enteredPin = this.enteredPin.slice(0, -1);
        if (this.dom.pinErrorMsg) this.dom.pinErrorMsg.style.display = 'none';
        this.updatePinDisplay();
        if (window.soundEngine) window.soundEngine.playSelect();
      }
    }

    handlePinClear() {
      this.resetPin();
      if (window.soundEngine) window.soundEngine.playSelect();
    }

    updatePinDisplay() {
      const boxes = this.dom.pinDigitBoxes;
      if (!boxes) return;
      boxes.forEach((box, i) => {
        if (i < this.enteredPin.length) {
          box.textContent = '●';
          box.classList.add('filled');
        } else {
          box.textContent = '';
          box.classList.remove('filled');
        }
        box.classList.remove('error', 'success');
      });
    }

    verifyPin() {
      if (this.enteredPin === ADMIN_PIN) {
        // PIN 1269 correto!
        if (this.dom.pinDigitBoxes) {
          this.dom.pinDigitBoxes.forEach(b => b.classList.add('success'));
        }
        if (window.soundEngine) window.soundEngine.playSuccess();

        setTimeout(() => {
          this.closeModal(this.dom.pinModal);
          this.resetPin();
          this.openModal(this.dom.customModal);
        }, 250);
      } else {
        // PIN incorreto!
        if (this.dom.pinDigitBoxes) {
          this.dom.pinDigitBoxes.forEach(b => b.classList.add('error'));
        }
        if (this.dom.pinErrorMsg) this.dom.pinErrorMsg.style.display = 'block';
        if (this.dom.pinDisplay) {
          this.dom.pinDisplay.classList.add('shake');
          setTimeout(() => {
            this.dom.pinDisplay.classList.remove('shake');
          }, 450);
        }
        if (window.soundEngine) window.soundEngine.playHint();

        setTimeout(() => {
          this.resetPin();
        }, 650);
      }
    }
  }

  // Inicialização quando a página carregar
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new WordSearchGame();
  });

})();
