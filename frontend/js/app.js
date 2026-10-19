/**
 * App - Controlador Central do Caça-Palavras Turma da Mônica
 * Saquarema & A.G Dev Solution
 */
(function() {
  'use strict';

  // Temas padrão embutidos (garantem funcionamento 100% offline via file://)
  const FALLBACK_THEMES = [
    {
      id: "aniversario_escola",
      title: "Aniversário na Escola",
      editionBadge: "NESTA EDIÇÃO: ANIVERSÁRIO NA ESCOLA",
      image: "assets/images/birthday_school.jpg",
      sentence: "A <strong class=\"target-word\" data-clean=\"SALA\">SALA</strong> DE <strong class=\"target-word\" data-clean=\"AULA\">AULA</strong> SE ENCHE DE <strong class=\"target-word\" data-clean=\"ALEGRIA\">ALEGRIA</strong> E <strong class=\"target-word\" data-clean=\"FESTA\">FESTA</strong> PARA <strong class=\"target-word\" data-clean=\"COMEMORAR\">COMEMORAR</strong> O <strong class=\"target-word\" data-clean=\"ANIVERSARIO\">ANIVERSÁRIO</strong> NA <strong class=\"target-word\" data-clean=\"ESCOLA\">ESCOLA</strong>. ENTRE <strong class=\"target-word\" data-clean=\"CADERNOS\">CADERNOS</strong> E <strong class=\"target-word\" data-clean=\"SORRISOS\">SORRISOS</strong>, A <strong class=\"target-word\" data-clean=\"TURMA\">TURMA</strong> DA <strong class=\"target-word\" data-clean=\"MONICA\">MÔNICA</strong> SE REÚNE PARA <strong class=\"target-word\" data-clean=\"CELEBRAR\">CELEBRAR</strong> ESSE <strong class=\"target-word\" data-clean=\"DIA\">DIA</strong> TÃO <strong class=\"target-word\" data-clean=\"ESPECIAL\">ESPECIAL</strong>.",
      words: [
        "SALA", "AULA", "ALEGRIA", "FESTA", "COMEMORAR", 
        "ANIVERSÁRIO", "ESCOLA", "CADERNOS", "SORRISOS", 
        "TURMA", "MÔNICA", "CELEBRAR", "DIA", "ESPECIAL"
      ]
    },
    {
      id: "bairro_limoeiro",
      title: "O Bairro do Limoeiro",
      editionBadge: "NESTA EDIÇÃO: O BAIRRO DO LIMOEIRO",
      image: "assets/images/limoeiro_scene_1791902340682.jpg",
      sentence: "NO CORAÇÃO DO <strong class=\"target-word\" data-clean=\"BAIRRO\">BAIRRO</strong> DO <strong class=\"target-word\" data-clean=\"LIMOEIRO\">LIMOEIRO</strong>, OS <strong class=\"target-word\" data-clean=\"AMIGOS\">AMIGOS</strong> BRINCAM NA <strong class=\"target-word\" data-clean=\"PRACA\">PRAÇA</strong> SOB O <strong class=\"target-word\" data-clean=\"SOL\">SOL</strong>. CADA <strong class=\"target-word\" data-clean=\"RUA\">RUA</strong> GUARDA UMA <strong class=\"target-word\" data-clean=\"HISTORIA\">HISTÓRIA</strong> DIVERTIDA, COM MUITA <strong class=\"target-word\" data-clean=\"CORRIDA\">CORRIDA</strong>, <strong class=\"target-word\" data-clean=\"RISADAS\">RISADAS</strong> E O INSEPARÁVEL <strong class=\"target-word\" data-clean=\"COELHINHO\">COELHINHO</strong> AZUL.",
      words: [
        "BAIRRO", "LIMOEIRO", "AMIGOS", "PRAÇA", "SOL", 
        "RUA", "HISTÓRIA", "CORRIDA", "RISADAS", "COELHINHO"
      ]
    },
    {
      id: "planos_cebolinha",
      title: "Planos Infalíveis do Cebolinha",
      editionBadge: "NESTA EDIÇÃO: OS PLANOS INFALÍVEIS",
      image: "assets/images/cebolinha_scene_1791902400074.jpg",
      sentence: "COM SEU <strong class=\"target-word\" data-clean=\"GIZ\">GIZ</strong> E UMA <strong class=\"target-word\" data-clean=\"LOUSA\">LOUSA</strong> REPLETA DE <strong class=\"target-word\" data-clean=\"IDEIAS\">IDEIAS</strong>, O <strong class=\"target-word\" data-clean=\"CEBOLINHA\">CEBOLINHA</strong> ARQUITETA UM <strong class=\"target-word\" data-clean=\"PLANO\">PLANO</strong> PARA CAPTURAR O <strong class=\"target-word\" data-clean=\"SANSAO\">SANSÃO</strong>. O FIEL <strong class=\"target-word\" data-clean=\"CASCAO\">CASCÃO</strong> AJUDA NA <strong class=\"target-word\" data-clean=\"ESTRATEGIA\">ESTRATÉGIA</strong>, TENTANDO ESCAPAR DO <strong class=\"target-word\" data-clean=\"BANHO\">BANHO</strong> E DA <strong class=\"target-word\" data-clean=\"FORCA\">FORÇA</strong> DA DONA DA RUA.",
      words: [
        "GIZ", "LOUSA", "IDEIAS", "CEBOLINHA", "PLANO", 
        "SANSÃO", "CASCÃO", "ESTRATÉGIA", "BANHO", "FORÇA"
      ]
    },
    {
      id: "lanche_magali",
      title: "A Hora do Lanche da Magali",
      editionBadge: "NESTA EDIÇÃO: O FESTIVAL DE SABORES",
      image: "assets/images/magali_scene_1791902366113.jpg",
      sentence: "A <strong class=\"target-word\" data-clean=\"MAGALI\">MAGALI</strong> ADORA UMA FATIA DOCE DE <strong class=\"target-word\" data-clean=\"MELANCIA\">MELANCIA</strong> REPLETA DE <strong class=\"target-word\" data-clean=\"SABOR\">SABOR</strong>. NA SUA <strong class=\"target-word\" data-clean=\"CESTA\">CESTA</strong> DE <strong class=\"target-word\" data-clean=\"PIQUENIQUE\">PIQUENIQUE</strong> TEM <strong class=\"target-word\" data-clean=\"BOLO\">BOLO</strong>, <strong class=\"target-word\" data-clean=\"SORVETE\">SORVETE</strong>, <strong class=\"target-word\" data-clean=\"PIPOCA\">PIPOCA</strong> E <strong class=\"target-word\" data-clean=\"FRUTAS\">FRUTAS</strong> FRESCAS PARA TODOS OS <strong class=\"target-word\" data-clean=\"COLEGAS\">COLEGAS</strong>.",
      words: [
        "MAGALI", "MELANCIA", "SABOR", "CESTA", "PIQUENIQUE", 
        "BOLO", "SORVETE", "PIPOCA", "FRUTAS", "COLEGAS"
      ]
    }
  ];

  const GRID_SIZES = {
    easy: 10,
    medium: 12,
    hard: 14
  };

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

        customModal: document.getElementById('custom-modal'),
        customThemeTitle: document.getElementById('custom-theme-title'),
        customWordsInput: document.getElementById('custom-words-input'),
        customSentenceInput: document.getElementById('custom-sentence-input'),
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

      this.dom.btnCustomModal.addEventListener('click', () => this.openModal(this.dom.customModal));
      this.dom.btnCloseCustom.addEventListener('click', () => this.closeModal(this.dom.customModal));
      this.dom.btnCancelCustom.addEventListener('click', () => this.closeModal(this.dom.customModal));
      this.dom.btnGenerateCustom.addEventListener('click', () => this.handleGenerateCustom());

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
      this.isPlaying = true;
      this.updateScoreDisplay();
      this.updateHintBadge();
      this.dom.themeSelectGame.value = this.currentTheme.id;

      // Atualiza cabeçalhos
      this.dom.boardThemeTitle.textContent = this.currentTheme.title;
      this.dom.boardDifficultyBadge.textContent = 
        this.difficulty === 'easy' ? 'Fácil' : (this.difficulty === 'hard' ? 'Difícil' : 'Médio');

      // Atualiza ilustração e frase formatada com palavras em negrito
      this.dom.editionBadge.innerHTML = `<span>${this.currentTheme.editionBadge || 'TURMA DA MÔNICA'}</span> <span>⭐</span>`;
      this.dom.sceneImage.src = this.currentTheme.image || 'assets/images/birthday_school.jpg';
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

        // Destaca permanentemente na grade
        this.selectedCells.forEach(c => {
          c.element.classList.add('found');
          c.element.classList.remove('hint');
        });

        // Atualiza a Tag na lista
        const tag = document.getElementById(`tag-${matchedWord.clean}`);
        if (tag) {
          tag.classList.add('found');
          tag.innerHTML = `<span>✓</span> <span>${matchedWord.original}</span>`;
        }

        // Destaca na Frase da História - FICA EM VERMELHO NO TEXTO!
        const sentenceHighlights = this.dom.scenarioSentence.querySelectorAll(`.target-word[data-clean="${matchedWord.clean}"]`);
        sentenceHighlights.forEach(el => {
          el.classList.add('found-word');
          el.classList.remove('hint-word');
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
            { name: 'Mônica', score: 1850, difficulty: 'medium', timeSeconds: 48 },
            { name: 'Cebolinha', score: 1620, difficulty: 'easy', timeSeconds: 35 },
            { name: 'Cascão', score: 1540, difficulty: 'easy', timeSeconds: 42 },
            { name: 'Magali', score: 1980, difficulty: 'hard', timeSeconds: 65 }
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
        image: 'assets/images/birthday_school.jpg',
        sentence: sentence,
        words: rawWords
      };

      this.themes.push(customTheme);
      this.populateThemeSelectors();
      this.currentTheme = customTheme;
      this.closeModal(this.dom.customModal);
      this.dom.coverScreen.classList.add('hidden');
      this.startNewGame();
    }

    openModal(modal) {
      if (modal) modal.classList.add('open');
    }

    closeModal(modal) {
      if (modal) modal.classList.remove('open');
    }

    closeAllModals() {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
  }

  // Inicialização quando a página carregar
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new WordSearchGame();
  });

})();
