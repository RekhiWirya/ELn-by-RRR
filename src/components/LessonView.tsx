import { ArrowLeft, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';

interface LessonViewProps {
  lessonId: number;
  onBack: () => void;
  onComplete: () => void;
}

export function LessonView({ lessonId, onBack, onComplete }: LessonViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const lessonData = {
    1: {
      title: 'Welcome to English Learning',
      duration: '5 menit',
      content: {
        text: `Selamat datang di kursus English for Beginners! 

Kursus ini dirancang khusus untuk Anda yang ingin memulai perjalanan belajar bahasa Inggris dari nol. Kami akan membantu Anda memahami dasar-dasar bahasa Inggris dengan cara yang mudah dan menyenangkan.

Apa yang akan Anda pelajari:
• Alphabet dan pronunciation
• Vocabulary dasar sehari-hari
• Grammar fundamental
• Conversation sederhana
• Listening comprehension

Metode pembelajaran:
Kami menggunakan pendekatan interaktif yang menggabungkan video, audio, teks, dan latihan interaktif. Setiap lesson dirancang untuk membangun pemahaman Anda secara bertahap.

Tips untuk sukses:
1. Luangkan waktu 20-30 menit setiap hari untuk belajar
2. Jangan takut membuat kesalahan - itu bagian dari proses belajar
3. Praktikkan apa yang Anda pelajari dalam kehidupan sehari-hari
4. Ulangi materi yang sulit sampai Anda memahaminya

Mari kita mulai perjalanan belajar bahasa Inggris Anda!`,
        vocabulary: [
          { word: 'Welcome', meaning: 'Selamat datang', example: 'Welcome to our class!' },
          { word: 'Learning', meaning: 'Pembelajaran', example: 'English learning is fun!' },
          { word: 'Beginner', meaning: 'Pemula', example: 'This course is for beginners.' },
        ],
        quiz: {
          question: 'Apa arti dari kata "Welcome"?',
          options: ['Selamat tinggal', 'Selamat datang', 'Terima kasih', 'Sampai jumpa'],
          correctAnswer: 1
        }
      }
    },
    2: {
      title: 'Basic Greetings & Introductions',
      duration: '12 menit',
      content: {
        text: `Greetings (Salam) adalah cara kita menyapa orang lain dalam bahasa Inggris. Mari pelajari berbagai cara menyapa dalam situasi berbeda.

Common Greetings:
• Hello / Hi - Halo (informal)
• Good morning - Selamat pagi
• Good afternoon - Selamat siang
• Good evening - Selamat sore/malam
• How are you? - Apa kabar?

Responding to Greetings:
• I'm fine, thank you - Saya baik, terima kasih
• I'm good - Saya baik
• Not bad - Lumayan
• I'm great! - Saya sangat baik!

Self Introduction:
"Hello, my name is [Your Name]. I'm from [Your City]. Nice to meet you!"

Practice:
Coba perkenalkan diri Anda dalam bahasa Inggris menggunakan format di atas. Ulangi beberapa kali sampai Anda merasa nyaman.`,
        vocabulary: [
          { word: 'Hello', meaning: 'Halo', example: 'Hello! How are you?' },
          { word: 'Morning', meaning: 'Pagi', example: 'Good morning, everyone!' },
          { word: 'Meet', meaning: 'Bertemu', example: 'Nice to meet you!' },
          { word: 'Name', meaning: 'Nama', example: 'My name is Sarah.' },
        ],
        quiz: {
          question: 'Bagaimana cara menyapa orang di pagi hari dalam bahasa Inggris?',
          options: ['Good night', 'Good morning', 'Good evening', 'Good afternoon'],
          correctAnswer: 1
        }
      }
    },
    3: {
      title: 'Practice: Self Introduction',
      duration: '10 menit',
      content: {
        text: `Sekarang saatnya praktek! Mari kita latih kemampuan memperkenalkan diri dalam bahasa Inggris.

Template Perkenalan Diri:

Basic Introduction:
"Hello, my name is _____. I'm from _____. Nice to meet you!"

Extended Introduction:
"Hi! My name is _____. I'm from _____ in _____. 
I'm a _____ (pekerjaan/status). 
I like _____ (hobi). 
Pleased to meet you!"

Contoh:
"Hi! My name is Budi. I'm from Jakarta in Indonesia.
I'm a student.
I like reading and playing football.
Pleased to meet you!"

Exercise:
Buatlah perkenalan diri Anda sendiri menggunakan template di atas. Tuliskan dan ucapkan dengan lantang beberapa kali.

Key Phrases:
• My name is... - Nama saya adalah...
• I'm from... - Saya berasal dari...
• I like... - Saya suka...
• Nice to meet you - Senang bertemu denganmu
• Pleased to meet you - Senang berkenalan denganmu`,
        vocabulary: [
          { word: 'Introduction', meaning: 'Perkenalan', example: 'Let me make an introduction.' },
          { word: 'Student', meaning: 'Pelajar/Mahasiswa', example: 'I am a student.' },
          { word: 'Like', meaning: 'Suka', example: 'I like music.' },
          { word: 'Pleased', meaning: 'Senang', example: 'Pleased to meet you!' },
        ],
        quiz: {
          question: 'Apa bahasa Inggris dari "Senang bertemu denganmu"?',
          options: ['See you later', 'Nice to meet you', 'Good bye', 'How are you'],
          correctAnswer: 1
        }
      }
    }
  };

  const lesson = lessonData[lessonId as keyof typeof lessonData];
  const steps = ['Materi', 'Vocabulary', 'Quiz'];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">{lesson.duration}</span>
            </div>
          </div>
          
          <h1 className="text-2xl mb-3">{lesson.title}</h1>
          
          <div className="flex items-center gap-4 mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${
                  index === currentStep ? 'text-blue-600' : 
                  index < currentStep ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
                      index === currentStep ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                  <span className="text-sm">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
          
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {currentStep === 0 && (
            <Card className="p-8">
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {lesson.content.text}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext} className="gap-2">
                  Lanjut ke Vocabulary
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="p-8">
              <h2 className="text-2xl mb-6">Vocabulary</h2>
              <div className="space-y-4">
                {lesson.content.vocabulary.map((item, index) => (
                  <Card key={index} className="p-4 bg-orange-50 border-primary/20">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl text-primary">{item.word}</h3>
                      <span className="text-primary">{item.meaning}</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      Example: "{item.example}"
                    </p>
                  </Card>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext} className="gap-2">
                  Lanjut ke Quiz
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="p-8">
              <h2 className="text-2xl mb-6">Quiz Time!</h2>
              <div className="mb-6">
                <p className="text-lg mb-4">{lesson.content.quiz.question}</p>
                <div className="space-y-3">
                  {lesson.content.quiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        !showResult
                          ? 'hover:border-primary hover:bg-orange-50'
                          : index === lesson.content.quiz.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          !showResult
                            ? 'border-gray-300'
                            : index === lesson.content.quiz.correctAnswer
                            ? 'border-green-500 bg-green-500'
                            : index === selectedAnswer
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {showResult && index === lesson.content.quiz.correctAnswer && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg mb-6 ${
                  selectedAnswer === lesson.content.quiz.correctAnswer
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`${
                    selectedAnswer === lesson.content.quiz.correctAnswer
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    {selectedAnswer === lesson.content.quiz.correctAnswer
                      ? '🎉 Benar! Jawaban Anda tepat!'
                      : '❌ Kurang tepat. Jawaban yang benar adalah: ' + 
                        lesson.content.quiz.options[lesson.content.quiz.correctAnswer]}
                  </p>
                </div>
              )}

              {showResult && (
                <div className="flex justify-end">
                  <Button onClick={handleNext} className="gap-2">
                    Selesaikan Lesson
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}