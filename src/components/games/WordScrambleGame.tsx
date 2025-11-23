import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';
import { Progress } from '../ui/progress';

interface WordScrambleGameProps {
  onBack: () => void;
}

const WORDS = [
  { word: 'COMPUTER', hint: 'A machine that processes data', category: 'Technology' },
  { word: 'ELEPHANT', hint: 'A large animal with a trunk', category: 'Animals' },
  { word: 'BIRTHDAY', hint: 'Annual celebration of being born', category: 'Events' },
  { word: 'MOUNTAIN', hint: 'A very high natural elevation', category: 'Nature' },
  { word: 'HOSPITAL', hint: 'Place where sick people are treated', category: 'Buildings' },
  { word: 'FOOTBALL', hint: 'Popular sport played with a round ball', category: 'Sports' },
  { word: 'UMBRELLA', hint: 'Protection from rain', category: 'Objects' },
  { word: 'CUCUMBER', hint: 'A green vegetable', category: 'Food' },
  { word: 'BLANKET', hint: 'Something to keep you warm in bed', category: 'Objects' },
  { word: 'RAINBOW', hint: 'Colorful arc in the sky after rain', category: 'Nature' },
];

export function WordScrambleGame({ onBack }: WordScrambleGameProps) {
  const [currentWord, setCurrentWord] = useState({ word: '', hint: '', category: '' });
  const [scrambledWord, setScrambledWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);

  const MAX_ROUNDS = 10;

  useEffect(() => {
    loadNewWord();
  }, []);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  const scrambleWord = (word: string) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const loadNewWord = () => {
    const availableWords = WORDS.filter(w => !usedWords.includes(w.word));
    if (availableWords.length === 0) {
      // All words used, game complete
      setGameActive(false);
      toast.success(`🎉 Game Selesai! Skor akhir: ${score}`);
      return;
    }

    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(newWord);
    setScrambledWord(scrambleWord(newWord.word));
    setUserAnswer('');
    setShowHint(false);
    setTimeLeft(30);
    setGameActive(true);
  };

  const handleTimeUp = () => {
    toast.error(`⏰ Waktu habis! Kata yang benar: ${currentWord.word}`);
    setTimeout(() => {
      if (round < MAX_ROUNDS) {
        setRound(round + 1);
        setUsedWords([...usedWords, currentWord.word]);
        loadNewWord();
      } else {
        setGameActive(false);
        toast.success(`Game Selesai! Skor akhir: ${score}/${MAX_ROUNDS}`);
      }
    }, 2000);
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      toast.error('Masukkan jawaban terlebih dahulu!');
      return;
    }

    if (userAnswer.toUpperCase() === currentWord.word) {
      const points = showHint ? 5 : 10;
      setScore(score + points);
      toast.success(`✅ Benar! +${points} poin`);
      
      if (round < MAX_ROUNDS) {
        setTimeout(() => {
          setRound(round + 1);
          setUsedWords([...usedWords, currentWord.word]);
          loadNewWord();
        }, 1000);
      } else {
        setGameActive(false);
        toast.success(`🏆 Game Selesai! Skor akhir: ${score + points}/${MAX_ROUNDS * 10}`);
      }
    } else {
      toast.error('Salah! Coba lagi');
      setUserAnswer('');
    }
  };

  const handleSkip = () => {
    toast.info(`Kata yang benar: ${currentWord.word}`);
    if (round < MAX_ROUNDS) {
      setTimeout(() => {
        setRound(round + 1);
        setUsedWords([...usedWords, currentWord.word]);
        loadNewWord();
      }, 1500);
    } else {
      setGameActive(false);
      toast.success(`Game Selesai! Skor akhir: ${score}/${MAX_ROUNDS * 10}`);
    }
  };

  const handleNewGame = () => {
    setScore(0);
    setRound(1);
    setUsedWords([]);
    setGameActive(true);
    loadNewWord();
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
          
          <h1 className="text-3xl">Word Scramble</h1>
          
          <Button variant="ghost" size="icon" onClick={handleNewGame}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">{round}/{MAX_ROUNDS}</div>
            <div className="text-sm text-gray-600">Round</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1 text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Skor</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl mb-1 ${timeLeft <= 10 ? 'text-red-600' : ''}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-gray-600">Waktu</div>
          </Card>
        </div>

        {/* Timer Progress */}
        <Progress value={(timeLeft / 30) * 100} className="h-2 mb-6" />

        {/* Game Area */}
        <Card className="p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-orange-100 text-primary rounded-full text-sm mb-4">
              {currentWord.category}
            </div>
            <div className="text-4xl tracking-widest mb-6 select-none">
              {scrambledWord.split('').map((letter, i) => (
                <span key={i} className="inline-block mx-1 px-3 py-2 bg-purple-100 text-purple-700 rounded">
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {showHint && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="text-sm text-yellow-800">Hint:</div>
                  <div className="text-yellow-700">{currentWord.hint}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Ketik jawaban di sini..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={!gameActive}
              className="text-center text-xl h-14"
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!gameActive}
                className="flex-1"
              >
                Cek Jawaban
              </Button>
              {!showHint && (
                <Button
                  onClick={() => setShowHint(true)}
                  variant="outline"
                  disabled={!gameActive}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Hint (-5 poin)
                </Button>
              )}
            </div>

            <Button
              onClick={handleSkip}
              variant="ghost"
              disabled={!gameActive}
              className="w-full"
            >
              Skip
            </Button>
          </div>
        </Card>

        {/* Game Over */}
        {!gameActive && round >= MAX_ROUNDS && (
          <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl mb-2">Game Selesai!</h2>
            <div className="text-5xl mb-4 text-purple-600">{score}/{MAX_ROUNDS * 10}</div>
            <p className="text-gray-600 mb-6">
              {score >= MAX_ROUNDS * 8 ? 'Luar biasa! 🌟' :
               score >= MAX_ROUNDS * 5 ? 'Bagus sekali! 👏' :
               'Tetap semangat! 💪'}
            </p>
            <Button onClick={handleNewGame} size="lg">
              Main Lagi
            </Button>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-orange-100 border-primary/20">
          <h3 className="mb-3">📝 Cara Bermain:</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Susun huruf yang diacak menjadi kata yang benar</li>
            <li>• Jawaban benar = 10 poin, dengan hint = 5 poin</li>
            <li>• Waktu 30 detik per kata</li>
            <li>• Selesaikan 10 kata untuk menyelesaikan game</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}