import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner@2.0.3';

interface HangmanGameProps {
  onBack: () => void;
}

const WORDS = [
  { word: 'BEAUTIFUL', hint: 'Attractive or pleasing', category: 'Adjective' },
  { word: 'CHOCOLATE', hint: 'Sweet brown food', category: 'Food' },
  { word: 'ADVENTURE', hint: 'Exciting experience', category: 'Noun' },
  { word: 'TELEPHONE', hint: 'Device for calling', category: 'Object' },
  { word: 'BUTTERFLY', hint: 'Insect with colorful wings', category: 'Animal' },
  { word: 'EDUCATION', hint: 'Process of learning', category: 'Concept' },
  { word: 'HAPPINESS', hint: 'Feeling of joy', category: 'Emotion' },
  { word: 'IMPORTANT', hint: 'Very significant', category: 'Adjective' },
  { word: 'WONDERFUL', hint: 'Extremely good', category: 'Adjective' },
  { word: 'KNOWLEDGE', hint: 'What you know', category: 'Concept' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function HangmanGame({ onBack }: HangmanGameProps) {
  const [currentWord, setCurrentWord] = useState({ word: '', hint: '', category: '' });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);

  const MAX_WRONG = 6;

  useEffect(() => {
    loadNewWord();
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const wordLetters = currentWord.word.split('').filter(l => l !== ' ');
    const uniqueLetters = new Set(wordLetters);
    const correctGuesses = guessedLetters.filter(l => uniqueLetters.has(l));

    if (correctGuesses.length === uniqueLetters.size && currentWord.word) {
      setWon(true);
      setGameOver(true);
      setScore(score + 1);
      toast.success('🎉 Selamat! Kamu berhasil menebak kata!');
    }
  }, [guessedLetters, currentWord]);

  const loadNewWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(newWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);
  };

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || gameOver) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!currentWord.word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= MAX_WRONG) {
        setGameOver(true);
        toast.error(`Game Over! Kata yang benar: ${currentWord.word}`);
      }
    }
  };

  const renderWord = () => {
    return currentWord.word.split('').map((letter, i) => {
      if (letter === ' ') {
        return <span key={i} className="mx-2" />;
      }
      return (
        <span
          key={i}
          className="inline-block w-12 h-16 border-b-4 border-blue-600 mx-1 text-3xl text-center flex items-center justify-center"
        >
          {guessedLetters.includes(letter) ? letter : ''}
        </span>
      );
    });
  };

  const renderHangman = () => {
    const parts = [
      // Head
      <circle key="head" cx="140" cy="60" r="20" stroke="currentColor" strokeWidth="3" fill="none" />,
      // Body
      <line key="body" x1="140" y1="80" x2="140" y2="130" stroke="currentColor" strokeWidth="3" />,
      // Left arm
      <line key="leftarm" x1="140" y1="95" x2="110" y2="110" stroke="currentColor" strokeWidth="3" />,
      // Right arm
      <line key="rightarm" x1="140" y1="95" x2="170" y2="110" stroke="currentColor" strokeWidth="3" />,
      // Left leg
      <line key="leftleg" x1="140" y1="130" x2="115" y2="160" stroke="currentColor" strokeWidth="3" />,
      // Right leg
      <line key="rightleg" x1="140" y1="130" x2="165" y2="160" stroke="currentColor" strokeWidth="3" />,
    ];

    return (
      <svg width="200" height="200" className="mx-auto mb-6 text-red-600">
        {/* Gallows */}
        <line x1="20" y1="180" x2="180" y2="180" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="180" x2="50" y2="20" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="20" x2="140" y2="20" stroke="currentColor" strokeWidth="3" />
        <line x1="140" y1="20" x2="140" y2="40" stroke="currentColor" strokeWidth="3" />
        
        {/* Body parts */}
        {parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <h1 className="text-3xl">Hangman</h1>
          
          <Button variant="ghost" size="icon" onClick={loadNewWord}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1 text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Kata Berhasil</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex gap-1 justify-center mb-1">
              {Array.from({ length: MAX_WRONG }).map((_, i) => (
                <Heart
                  key={i}
                  className={`h-5 w-5 ${
                    i < MAX_WRONG - wrongGuesses
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">Nyawa</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">{wrongGuesses}/{MAX_WRONG}</div>
            <div className="text-sm text-gray-600">Kesalahan</div>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm mb-4">
              {currentWord.category}
            </div>
            <div className="text-gray-600 mb-6">Hint: {currentWord.hint}</div>
          </div>

          {renderHangman()}

          <div className="flex justify-center flex-wrap mb-8 min-h-[64px]">
            {renderWord()}
          </div>

          {gameOver && (
            <div className="mb-6 text-center">
              {won ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-lg">
                    🎉 Selamat! Kamu berhasil menebak kata!
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-lg mb-2">
                    ❌ Game Over!
                  </p>
                  <p className="text-red-700">
                    Kata yang benar: <span className="text-xl">{currentWord.word}</span>
                  </p>
                </div>
              )}
              <Button onClick={loadNewWord} className="mt-4" size="lg">
                Main Kata Baru
              </Button>
            </div>
          )}

          {/* Keyboard */}
          <div className="space-y-2">
            {[
              ALPHABET.slice(0, 9),
              ALPHABET.slice(9, 18),
              ALPHABET.slice(18, 26),
            ].map((row, i) => (
              <div key={i} className="flex gap-2 justify-center flex-wrap">
                {row.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter);
                  const isCorrect = currentWord.word.includes(letter);
                  
                  return (
                    <Button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={isGuessed || gameOver}
                      className={`w-10 h-10 p-0 ${
                        isGuessed
                          ? isCorrect
                            ? 'bg-green-500 hover:bg-green-500'
                            : 'bg-red-500 hover:bg-red-500'
                          : ''
                      }`}
                      variant={isGuessed ? 'default' : 'outline'}
                    >
                      {letter}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-orange-100 border-primary/20">
          <h3 className="mb-3">📝 Cara Bermain:</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Tebak huruf satu per satu untuk menemukan kata</li>
            <li>• Maksimal 6 kesalahan sebelum game over</li>
            <li>• Gunakan hint jika kesulitan (tersedia 2x)</li>
            <li>• Jawab 10 kata untuk menyelesaikan game</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}