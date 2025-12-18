import { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface WordleGameProps {
  onBack: () => void;
}

const WORDS = [
  'APPLE', 'BREAD', 'CHAIR', 'DRINK', 'EARTH', 'FRUIT', 'GRAPE', 'HEART',
  'IMAGE', 'JUICE', 'KNIFE', 'LEMON', 'MONTH', 'NIGHT', 'OCEAN', 'PHONE',
  'QUEEN', 'RIVER', 'SUGAR', 'TABLE', 'UNDER', 'VOICE', 'WATER', 'WORLD'
];

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

interface CellState {
  letter: string;
  state: LetterState;
}

export function WordleGame({ onBack }: WordleGameProps) {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<CellState[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keyboardState, setKeyboardState] = useState<Record<string, LetterState>>({});

  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'Enter') {
        handleSubmitGuess();
      } else if (e.key === 'Backspace') {
        handleDeleteLetter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleAddLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, currentRow]);

  const initializeGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
    setCurrentGuess('');
    setGuesses([]);
    setCurrentRow(0);
    setGameOver(false);
    setWon(false);
    setKeyboardState({});
  };

  const handleAddLetter = (letter: string) => {
    if (currentGuess.length < WORD_LENGTH && !gameOver) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleDeleteLetter = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      toast.error('Kata harus terdiri dari 5 huruf!');
      return;
    }

    if (currentRow >= MAX_GUESSES) return;

    // Evaluate guess
    const newGuess: CellState[] = [];
    const targetLetters = targetWord.split('');
    const guessLetters = currentGuess.split('');
    const newKeyboardState = { ...keyboardState };

    // First pass: mark correct letters
    const remainingTargetLetters = [...targetLetters];
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        newGuess[i] = { letter, state: 'correct' };
        remainingTargetLetters[i] = '';
        newKeyboardState[letter] = 'correct';
      } else {
        newGuess[i] = { letter, state: 'absent' };
      }
    });

    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
      if (newGuess[i].state === 'correct') return;

      const indexInRemaining = remainingTargetLetters.indexOf(letter);
      if (indexInRemaining !== -1) {
        newGuess[i] = { letter, state: 'present' };
        remainingTargetLetters[indexInRemaining] = '';
        if (newKeyboardState[letter] !== 'correct') {
          newKeyboardState[letter] = 'present';
        }
      } else {
        if (!newKeyboardState[letter]) {
          newKeyboardState[letter] = 'absent';
        }
      }
    });

    setGuesses([...guesses, newGuess]);
    setKeyboardState(newKeyboardState);

    // Check if won
    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      toast.success(`🎉 Selamat! Kamu menemukan kata dalam ${currentRow + 1} percobaan!`);
    } else if (currentRow === MAX_GUESSES - 1) {
      setGameOver(true);
      toast.error(`Game Over! Kata yang benar adalah: ${targetWord}`);
    }

    setCurrentGuess('');
    setCurrentRow(currentRow + 1);
  };

  const handleKeyClick = (key: string) => {
    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACK') {
      handleDeleteLetter();
    } else {
      handleAddLetter(key);
    }
  };

  const getCellColor = (state: LetterState) => {
    switch (state) {
      case 'correct': return 'bg-green-500 border-green-500 text-white';
      case 'present': return 'bg-yellow-500 border-yellow-500 text-white';
      case 'absent': return 'bg-gray-400 border-gray-400 text-white';
      default: return 'bg-white border-gray-300';
    }
  };

  const getKeyColor = (key: string) => {
    const state = keyboardState[key];
    switch (state) {
      case 'correct': return 'bg-green-500 text-white hover:bg-green-600';
      case 'present': return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'absent': return 'bg-gray-400 text-white hover:bg-gray-500';
      default: return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <h1 className="text-3xl">English Wordle</h1>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cara Bermain</DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-3 text-sm">
                      <p>Tebak kata bahasa Inggris dalam 6 kesempatan!</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center text-white">A</div>
                          <span>Huruf benar dan posisi benar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-yellow-500 rounded flex items-center justify-center text-white">B</div>
                          <span>Huruf benar tapi posisi salah</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gray-400 rounded flex items-center justify-center text-white">C</div>
                          <span>Huruf tidak ada dalam kata</span>
                        </div>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            
            <Button variant="ghost" size="icon" onClick={initializeGame}>
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Game Board */}
        <Card className="p-8 mb-6">
          <div className="space-y-2 mb-6">
            {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                  let cellState: CellState = { letter: '', state: 'empty' };
                  
                  if (rowIndex < guesses.length) {
                    cellState = guesses[rowIndex][colIndex];
                  } else if (rowIndex === currentRow && currentGuess[colIndex]) {
                    cellState = { letter: currentGuess[colIndex], state: 'empty' };
                  }

                  return (
                    <div
                      key={colIndex}
                      className={`h-14 w-14 border-2 rounded flex items-center justify-center text-2xl transition-all ${
                        getCellColor(cellState.state)
                      }`}
                    >
                      {cellState.letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Keyboard */}
          <div className="space-y-2">
            {keyboard.map((row, i) => (
              <div key={i} className="flex gap-1 justify-center">
                {row.map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyClick(key)}
                    disabled={gameOver}
                    className={`h-12 ${
                      key === 'ENTER' || key === 'BACK' ? 'px-4' : 'w-10 px-0'
                    } ${getKeyColor(key)}`}
                    variant="secondary"
                  >
                    {key === 'BACK' ? '⌫' : key}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">{currentRow}</div>
            <div className="text-sm text-gray-600">Percobaan</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">{MAX_GUESSES - currentRow}</div>
            <div className="text-sm text-gray-600">Tersisa</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">{won ? '✓' : '-'}</div>
            <div className="text-sm text-gray-600">Status</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
