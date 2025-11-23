import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';

interface CrosswordGameProps {
  onBack: () => void;
}

interface Cell {
  letter: string;
  number?: number;
  blocked: boolean;
}

interface Clue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
}

export function CrosswordGame({ onBack }: CrosswordGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [completed, setCompleted] = useState(false);

  const clues: Clue[] = [
    { number: 1, clue: 'Opposite of big', answer: 'SMALL', direction: 'across', startRow: 0, startCol: 0 },
    { number: 2, clue: 'Color of the sky', answer: 'BLUE', direction: 'down', startRow: 0, startCol: 0 },
    { number: 3, clue: 'Fruit that keeps doctor away', answer: 'APPLE', direction: 'across', startRow: 1, startCol: 1 },
    { number: 4, clue: 'Frozen water', answer: 'ICE', direction: 'down', startRow: 1, startCol: 2 },
    { number: 5, clue: 'Animal that says "meow"', answer: 'CAT', direction: 'across', startRow: 2, startCol: 0 },
    { number: 6, clue: 'Hot drink, often in morning', answer: 'TEA', direction: 'down', startRow: 0, startCol: 4 },
    { number: 7, clue: 'Opposite of old', answer: 'NEW', direction: 'across', startRow: 3, startCol: 2 },
    { number: 8, clue: 'Red fruit, often in salad', answer: 'TOMATO', direction: 'down', startRow: 1, startCol: 5 },
  ];

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const size = 7;
    const newGrid: Cell[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({ letter: '', blocked: true }))
    );
    const newUserGrid: string[][] = Array(size).fill(null).map(() =>
      Array(size).fill('')
    );

    // Place words in grid
    clues.forEach(clue => {
      let row = clue.startRow;
      let col = clue.startCol;

      for (let i = 0; i < clue.answer.length; i++) {
        if (row < size && col < size) {
          newGrid[row][col] = {
            letter: clue.answer[i],
            blocked: false,
            number: i === 0 ? clue.number : newGrid[row][col].number
          };
        }

        if (clue.direction === 'across') {
          col++;
        } else {
          row++;
        }
      }
    });

    setGrid(newGrid);
    setUserGrid(newUserGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].blocked) return;

    // Find which clue this cell belongs to
    const cellClues = clues.filter(clue => {
      if (clue.direction === 'across') {
        return row === clue.startRow && 
               col >= clue.startCol && 
               col < clue.startCol + clue.answer.length;
      } else {
        return col === clue.startCol && 
               row >= clue.startRow && 
               row < clue.startRow + clue.answer.length;
      }
    });

    if (cellClues.length > 0) {
      // If clicked on start of a clue, select that clue
      const startClue = cellClues.find(c => c.startRow === row && c.startCol === col);
      if (startClue) {
        setSelectedClue(startClue.number);
        setDirection(startClue.direction);
      } else {
        // Select the first clue that matches current direction, or just the first one
        const matchingDir = cellClues.find(c => c.direction === direction);
        if (matchingDir) {
          setSelectedClue(matchingDir.number);
        } else {
          setSelectedClue(cellClues[0].number);
          setDirection(cellClues[0].direction);
        }
      }
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return;
    
    const newUserGrid = [...userGrid];
    newUserGrid[row][col] = value.toUpperCase();
    setUserGrid(newUserGrid);

    // Auto-advance to next cell
    if (value && selectedClue !== null) {
      const clue = clues.find(c => c.number === selectedClue);
      if (clue) {
        if (clue.direction === 'across') {
          if (col + 1 < grid[0].length && !grid[row][col + 1].blocked) {
            const nextInput = document.querySelector(
              `input[data-row="${row}"][data-col="${col + 1}"]`
            ) as HTMLInputElement;
            nextInput?.focus();
          }
        } else {
          if (row + 1 < grid.length && !grid[row + 1][col].blocked) {
            const nextInput = document.querySelector(
              `input[data-row="${row + 1}"][data-col="${col}"]`
            ) as HTMLInputElement;
            nextInput?.focus();
          }
        }
      }
    }
  };

  const handleCheck = () => {
    let correct = 0;
    let total = 0;

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell.blocked) {
          total++;
          if (userGrid[i][j] === cell.letter) {
            correct++;
          }
        }
      });
    });

    if (correct === total) {
      setCompleted(true);
      toast.success('🎉 Selamat! Semua jawaban benar!');
    } else {
      toast.info(`${correct} dari ${total} benar. Tetap semangat!`);
    }
  };

  const handleClear = () => {
    const newUserGrid = Array(grid.length).fill(null).map(() =>
      Array(grid[0].length).fill('')
    );
    setUserGrid(newUserGrid);
    setCompleted(false);
  };

  const isCellSelected = (row: number, col: number) => {
    if (selectedClue === null) return false;
    
    const clue = clues.find(c => c.number === selectedClue);
    if (!clue) return false;

    if (clue.direction === 'across') {
      return row === clue.startRow && 
             col >= clue.startCol && 
             col < clue.startCol + clue.answer.length;
    } else {
      return col === clue.startCol && 
             row >= clue.startRow && 
             row < clue.startRow + clue.answer.length;
    }
  };

  const acrossClues = clues.filter(c => c.direction === 'across');
  const downClues = clues.filter(c => c.direction === 'down');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <h1 className="text-3xl">Crossword Puzzle</h1>
          
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="inline-block mx-auto">
                {grid.map((row, i) => (
                  <div key={i} className="flex">
                    {row.map((cell, j) => (
                      <div
                        key={j}
                        className={`relative ${
                          cell.blocked
                            ? 'bg-gray-800 w-12 h-12 border border-gray-700'
                            : 'bg-white w-12 h-12 border border-gray-300'
                        } ${
                          isCellSelected(i, j) ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleCellClick(i, j)}
                      >
                        {!cell.blocked && (
                          <>
                            {cell.number && (
                              <span className="absolute top-0.5 left-0.5 text-[10px] text-blue-600">
                                {cell.number}
                              </span>
                            )}
                            <Input
                              data-row={i}
                              data-col={j}
                              type="text"
                              maxLength={1}
                              value={userGrid[i][j] || ''}
                              onChange={(e) => handleInputChange(i, j, e.target.value)}
                              className="w-full h-full border-0 text-center text-xl p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              disabled={completed}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <Button onClick={handleCheck} className="gap-2" disabled={completed}>
                  <Check className="h-4 w-4" />
                  Periksa Jawaban
                </Button>
                <Button onClick={handleClear} variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Hapus Semua
                </Button>
              </div>

              {completed && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 text-lg">
                    🎉 Selamat! Kamu berhasil menyelesaikan crossword puzzle!
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Clues */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl mb-4">Clues</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-blue-600">Across</h3>
                  <div className="space-y-2">
                    {acrossClues.map(clue => (
                      <button
                        key={clue.number}
                        onClick={() => {
                          setSelectedClue(clue.number);
                          setDirection('across');
                        }}
                        className={`w-full text-left p-2 rounded text-sm hover:bg-gray-100 ${
                          selectedClue === clue.number && direction === 'across'
                            ? 'bg-orange-100 text-primary'
                            : ''
                        }`}
                      >
                        <span className="mr-2">{clue.number}.</span>
                        {clue.clue}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-purple-600">Down</h3>
                  <div className="space-y-2">
                    {downClues.map(clue => (
                      <button
                        key={clue.number}
                        onClick={() => {
                          setSelectedClue(clue.number);
                          setDirection('down');
                        }}
                        className={`w-full text-left p-2 rounded text-sm hover:bg-gray-100 ${
                          selectedClue === clue.number && direction === 'down'
                            ? 'bg-purple-100 text-purple-900'
                            : ''
                        }`}
                      >
                        <span className="mr-2">{clue.number}.</span>
                        {clue.clue}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-orange-100 border-primary/20">
          <h3 className="mb-3">📝 Cara Bermain:</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Klik pada kotak untuk memulai mengisi jawaban</li>
            <li>• Baca clue di sidebar untuk mengetahui jawabannya</li>
            <li>• Klik clue untuk highlight kata yang dimaksud</li>
            <li>• Klik "Periksa Jawaban" untuk mengecek hasil</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}