/**
 * WordFind - Algoritmo Gerador e Validador de Caça-Palavras
 * Otimizado para português e múltiplos níveis de dificuldade.
 */
(function(root) {
  'use strict';

  // Letras ponderadas por frequência na língua portuguesa para preenchimento natural
  const PT_FREQUENCY_LETTERS = 'AAAAAAEEEEIIIOOOUUUBBCCDDFFGGHHJJLLMMNNPPQQRRRSSSTTTUVXZ';

  const ORIENTATIONS = {
    horizontal:     { dx: 1,  dy: 0,  name: 'horizontal' },
    horizontalBack: { dx: -1, dy: 0,  name: 'horizontalBack' },
    vertical:       { dx: 0,  dy: 1,  name: 'vertical' },
    verticalUp:     { dx: 0,  dy: -1, name: 'verticalUp' },
    diagonalDown:   { dx: 1,  dy: 1,  name: 'diagonalDown' },
    diagonalUp:     { dx: 1,  dy: -1, name: 'diagonalUp' },
    diagonalBack:   { dx: -1, dy: 1,  name: 'diagonalBack' },
    diagonalBackUp: { dx: -1, dy: -1, name: 'diagonalBackUp' }
  };

  const DIFFICULTY_ORIENTATIONS = {
    easy: [ORIENTATIONS.horizontal, ORIENTATIONS.vertical],
    medium: [
      ORIENTATIONS.horizontal, 
      ORIENTATIONS.vertical, 
      ORIENTATIONS.diagonalDown, 
      ORIENTATIONS.diagonalUp
    ],
    hard: [
      ORIENTATIONS.horizontal, 
      ORIENTATIONS.horizontalBack, 
      ORIENTATIONS.vertical, 
      ORIENTATIONS.verticalUp, 
      ORIENTATIONS.diagonalDown, 
      ORIENTATIONS.diagonalUp, 
      ORIENTATIONS.diagonalBack, 
      ORIENTATIONS.diagonalBackUp
    ]
  };

  function normalizeWord(word) {
    return word
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z]/g, '');
  }

  function createEmptyGrid(width, height) {
    const grid = [];
    for (let y = 0; y < height; y++) {
      grid[y] = [];
      for (let x = 0; x < width; x++) {
        grid[y][x] = '';
      }
    }
    return grid;
  }

  function canPlaceWord(grid, word, startX, startY, orientation, width, height) {
    const len = word.length;
    const endX = startX + orientation.dx * (len - 1);
    const endY = startY + orientation.dy * (len - 1);

    if (endX < 0 || endX >= width || endY < 0 || endY >= height) {
      return false;
    }

    let x = startX;
    let y = startY;
    for (let i = 0; i < len; i++) {
      const currentCell = grid[y][x];
      if (currentCell !== '' && currentCell !== word[i]) {
        return false;
      }
      x += orientation.dx;
      y += orientation.dy;
    }

    return true;
  }

  function placeWord(grid, word, startX, startY, orientation) {
    const len = word.length;
    const path = [];
    let x = startX;
    let y = startY;

    for (let i = 0; i < len; i++) {
      grid[y][x] = word[i];
      path.push({ x, y });
      x += orientation.dx;
      y += orientation.dy;
    }

    return {
      word,
      startX,
      startY,
      endX: startX + orientation.dx * (len - 1),
      endY: startY + orientation.dy * (len - 1),
      orientation: orientation.name,
      path
    };
  }

  function fillEmptyCells(grid, width, height) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] === '') {
          const randomIndex = Math.floor(Math.random() * PT_FREQUENCY_LETTERS.length);
          grid[y][x] = PT_FREQUENCY_LETTERS[randomIndex];
        }
      }
    }
  }

  function newPuzzle(wordsList, options = {}) {
    const width = options.width || 12;
    const height = options.height || 12;
    const difficulty = options.difficulty || 'medium';
    const allowedOrientations = DIFFICULTY_ORIENTATIONS[difficulty] || DIFFICULTY_ORIENTATIONS.medium;
    const maxAttempts = options.maxAttempts || 50;

    // Tratar palavras e remover duplicatas ou muito longas para o tabuleiro
    const cleanWordObjects = [];
    wordsList.forEach(original => {
      const clean = normalizeWord(original);
      if (clean.length >= 2 && clean.length <= Math.max(width, height)) {
        if (!cleanWordObjects.some(item => item.clean === clean)) {
          cleanWordObjects.push({ original, clean });
        }
      }
    });

    // Ordenar palavras das mais longas para as mais curtas para melhor empacotamento
    cleanWordObjects.sort((a, b) => b.clean.length - a.clean.length);

    let bestGrid = null;
    let bestPlaced = [];

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const currentGrid = createEmptyGrid(width, height);
      const placed = [];

      for (const wordObj of cleanWordObjects) {
        const cleanWord = wordObj.clean;
        let isWordPlaced = false;

        // Tentar posições e orientações aleatórias
        const orientationsShuffled = [...allowedOrientations].sort(() => Math.random() - 0.5);

        for (const orientation of orientationsShuffled) {
          // Gerar posições aleatórias
          const coords = [];
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              coords.push({ x, y });
            }
          }
          coords.sort(() => Math.random() - 0.5);

          for (const pos of coords) {
            if (canPlaceWord(currentGrid, cleanWord, pos.x, pos.y, orientation, width, height)) {
              const info = placeWord(currentGrid, cleanWord, pos.x, pos.y, orientation);
              placed.push({
                original: wordObj.original,
                clean: cleanWord,
                ...info
              });
              isWordPlaced = true;
              break;
            }
          }

          if (isWordPlaced) break;
        }
      }

      if (placed.length > bestPlaced.length) {
        bestPlaced = placed;
        bestGrid = currentGrid;
      }

      // Se todas as palavras couberam, encerra tentativas
      if (placed.length === cleanWordObjects.length) {
        break;
      }
    }

    fillEmptyCells(bestGrid, width, height);

    return {
      grid: bestGrid,
      width,
      height,
      difficulty,
      placedWords: bestPlaced,
      unplacedCount: cleanWordObjects.length - bestPlaced.length
    };
  }

  // Exportação
  const WordFind = {
    newPuzzle,
    normalizeWord,
    DIFFICULTY_ORIENTATIONS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordFind;
  } else {
    root.WordFind = WordFind;
  }
})(typeof window !== 'undefined' ? window : this);
