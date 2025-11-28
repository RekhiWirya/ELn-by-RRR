import { ArrowLeft, CheckCircle2, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

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
      title: "Welcome to English Learning",
      duration: "5 menit",
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
          {
            word: "Welcome",
            meaning: "Selamat datang",
            example: "Welcome to our class!",
          },
          {
            word: "Learning",
            meaning: "Pembelajaran",
            example: "English learning is fun!",
          },
          {
            word: "Beginner",
            meaning: "Pemula",
            example: "This course is for beginners.",
          },
        ],
        quiz: {
          question: 'Apa arti dari kata "Welcome"?',
          options: [
            "Selamat tinggal",
            "Selamat datang",
            "Terima kasih",
            "Sampai jumpa",
          ],
          correctAnswer: 1,
        },
      },
    },
    2: {
      title: "Basic Greetings & Introductions",
      duration: "12 menit",
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
          { word: "Hello", meaning: "Halo", example: "Hello! How are you?" },
          {
            word: "Morning",
            meaning: "Pagi",
            example: "Good morning, everyone!",
          },
          { word: "Meet", meaning: "Bertemu", example: "Nice to meet you!" },
          { word: "Name", meaning: "Nama", example: "My name is Sarah." },
        ],
        quiz: {
          question:
            "Bagaimana cara menyapa orang di pagi hari dalam bahasa Inggris?",
          options: [
            "Good night",
            "Good morning",
            "Good evening",
            "Good afternoon",
          ],
          correctAnswer: 1,
        },
      },
    },
    3: {
      title: "Practice: Self Introduction",
      duration: "10 menit",
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
          {
            word: "Introduction",
            meaning: "Perkenalan",
            example: "Let me make an introduction.",
          },
          {
            word: "Student",
            meaning: "Pelajar/Mahasiswa",
            example: "I am a student.",
          },
          { word: "Like", meaning: "Suka", example: "I like music." },
          {
            word: "Pleased",
            meaning: "Senang",
            example: "Pleased to meet you!",
          },
        ],
        quiz: {
          question: 'Apa bahasa Inggris dari "Senang bertemu denganmu"?',
          options: [
            "See you later",
            "Nice to meet you",
            "Good bye",
            "How are you",
          ],
          correctAnswer: 1,
        },
      },
    },
    // Intermediate English Mastery - Lesson 1
    4: {
      title: "Present Perfect Tense",
      duration: "18 menit",
      content: {
        text: `Present Perfect Tense digunakan untuk menyatakan tindakan yang telah selesai di waktu yang tidak spesifik atau tindakan yang masih berhubungan dengan saat ini.

Formula:
Subject + have/has + past participle (V3)

Positive:
• I have studied English for 5 years.
• She has visited Bali twice.
• They have finished their homework.

Negative:
• I have not (haven't) eaten breakfast.
• He has not (hasn't) arrived yet.

Question:
• Have you ever been to Japan?
• Has she called you today?

Time Markers:
• already - sudah
• yet - belum (dalam kalimat negatif/tanya)
• just - baru saja
• ever - pernah
• never - tidak pernah
• for - selama (durasi)
• since - sejak (titik waktu)

Contoh dalam Percakapan:
A: "Have you finished your project?"
B: "Yes, I have just completed it."

A: "Has John arrived?"
B: "No, he hasn't arrived yet."

Perbedaan dengan Simple Past:
• Simple Past: I went to Paris in 2020. (waktu spesifik)
• Present Perfect: I have been to Paris. (pengalaman, waktu tidak penting)`,
        vocabulary: [
          {
            word: "Already",
            meaning: "Sudah",
            example: "I have already finished my homework.",
          },
          {
            word: "Yet",
            meaning: "Belum",
            example: "Have you finished yet?",
          },
          {
            word: "Just",
            meaning: "Baru saja",
            example: "She has just left the office.",
          },
          {
            word: "Experience",
            meaning: "Pengalaman",
            example: "I have experience in teaching.",
          },
        ],
        quiz: {
          question: "Mana kalimat Present Perfect yang benar?",
          options: [
            "I have went to London.",
            "I have go to London.",
            "I have gone to London.",
            "I has gone to London.",
          ],
          correctAnswer: 2,
        },
      },
    },
    // Intermediate English Mastery - Lesson 2
    5: {
      title: "Business & Professional Vocabulary",
      duration: "16 menit",
      content: {
        text: `Vocabulary profesional sangat penting untuk berkomunikasi di lingkungan kerja. Mari pelajari istilah-istilah bisnis yang umum digunakan.

Office & Workplace:
• Meeting - Rapat/Pertemuan
• Deadline - Tenggat waktu
• Project - Proyek
• Presentation - Presentasi
• Report - Laporan
• Schedule - Jadwal
• Colleague - Rekan kerja
• Manager - Manajer
• Department - Departemen
• Client - Klien

Business Actions:
• To schedule - Menjadwalkan
• To attend - Menghadiri
• To submit - Menyerahkan
• To review - Meninjau
• To approve - Menyetujui
• To negotiate - Bernegosiasi
• To collaborate - Berkolaborasi

Email Phrases:
• "I am writing to..." - Saya menulis untuk...
• "Please find attached..." - Terlampir...
• "Thank you for your prompt reply" - Terima kasih atas balasan cepatnya
• "I look forward to hearing from you" - Saya menunggu kabar dari Anda
• "Best regards" - Salam hormat

Meeting Phrases:
• "Let's get started" - Mari kita mulai
• "I'd like to suggest..." - Saya ingin menyarankan...
• "What do you think about...?" - Apa pendapat Anda tentang...?
• "Could you elaborate on that?" - Bisakah Anda menjelaskan lebih detail?

Contoh Situasi:
"Good morning everyone. Let's get started with today's meeting. First, I'd like to review the progress on our current project. The deadline is next Friday, so we need to collaborate effectively to submit the final report on time."`,
        vocabulary: [
          {
            word: "Deadline",
            meaning: "Tenggat waktu",
            example: "The deadline for this project is Monday.",
          },
          {
            word: "Colleague",
            meaning: "Rekan kerja",
            example: "My colleagues are very supportive.",
          },
          {
            word: "Negotiate",
            meaning: "Bernegosiasi",
            example: "We need to negotiate the contract terms.",
          },
          {
            word: "Collaborate",
            meaning: "Berkolaborasi",
            example: "Let's collaborate on this project.",
          },
        ],
        quiz: {
          question: 'Apa arti dari "deadline" dalam konteks bisnis?',
          options: [
            "Waktu istirahat",
            "Tenggat waktu",
            "Waktu mulai",
            "Waktu kerja",
          ],
          correctAnswer: 1,
        },
      },
    },
    // Intermediate English Mastery - Lesson 3
    6: {
      title: "Small Talk & Social Situations",
      duration: "14 menit",
      content: {
        text: `Small talk adalah percakapan ringan yang penting untuk membangun hubungan sosial dan profesional. Mari pelajari cara melakukan small talk yang natural.

Common Small Talk Topics:
1. Weather (Cuaca)
"Nice weather today, isn't it?"
"It's quite hot/cold today."

2. Weekend Plans (Rencana Akhir Pekan)
"Do you have any plans for the weekend?"
"What did you do last weekend?"

3. Hobbies & Interests (Hobi & Minat)
"What do you like to do in your free time?"
"Have you seen any good movies lately?"

4. Current Events (Berita Terkini)
"Did you hear about...?"
"Have you been following...?"

Opening Small Talk:
• "How's your day going?"
• "How have you been?"
• "What have you been up to?"
• "Long time no see!"

Keeping the Conversation Going:
• "That's interesting! Tell me more."
• "Really? How did that happen?"
• "I know what you mean."
• "That reminds me of..."

Closing Small Talk:
• "It was nice talking to you."
• "I should get going, but let's catch up soon."
• "Take care!"
• "See you around!"

Contoh Dialog:
A: "Hi Sarah! How's your day going?"
B: "Pretty good, thanks! How about you?"
A: "Not bad. Do you have any plans for the weekend?"
B: "I'm thinking of going hiking. The weather looks great!"
A: "That sounds fun! I love hiking too."

Tips:
• Tunjukkan minat dengan pertanyaan follow-up
• Hindari topik sensitif (politik, agama, gaji)
• Perhatikan body language
• Tersenyum dan maintain eye contact`,
        vocabulary: [
          {
            word: "Lately",
            meaning: "Akhir-akhir ini",
            example: "Have you been busy lately?",
          },
          {
            word: "Catch up",
            meaning: "Mengobrol/berbincang lagi",
            example: "Let's catch up over coffee sometime.",
          },
          {
            word: "Long time no see",
            meaning: "Lama tidak bertemu",
            example: "Hey John! Long time no see!",
          },
          {
            word: "What have you been up to",
            meaning: "Apa yang sudah kamu lakukan",
            example: "What have you been up to these days?",
          },
        ],
        quiz: {
          question: "Frasa mana yang tepat untuk membuka small talk?",
          options: [
            "What is your salary?",
            "How's your day going?",
            "How old are you?",
            "Where do you live exactly?",
          ],
          correctAnswer: 1,
        },
      },
    },
  };

  const lesson = lessonData[lessonId as keyof typeof lessonData];
  const steps = ["Materi", "Vocabulary", "Quiz"];
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
                <div
                  className={`flex items-center gap-2 ${
                    index === currentStep
                      ? "text-blue-600"
                      : index < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
                        index === currentStep
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
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
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 shadow-2xl animate-[fadeIn_0.5s_ease-in]">
              {/* Header Section with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
                <h2
                  className="text-3xl font-black mb-2 drop-shadow-lg animate-[slideDown_0.5s_ease-out] text-black"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  📚 Materi Pembelajaran
                </h2>
                <p className="text-sm font-medium animate-[slideDown_0.7s_ease-out] text-black">
                  Pelajari dengan seksama untuk memahami konsep dasar
                </p>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="prose max-w-none">
                  <div
                    className="whitespace-pre-line text-gray-800 leading-loose text-lg font-normal animate-[fadeInUp_0.8s_ease-out] bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-inner border border-blue-200/50"
                    style={{
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      lineHeight: "1.8",
                    }}
                  >
                    {lesson.content.text}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex justify-end animate-[slideUp_1s_ease-out]">
                  <Button
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Lanjut ke Vocabulary
                    <ChevronRight className="h-5 w-5 animate-[bounce_1s_ease-in-out_infinite]" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-2xl animate-[fadeIn_0.5s_ease-in]">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6">
                <h2
                  className="text-3xl font-black mb-2 drop-shadow-lg animate-[slideDown_0.5s_ease-out] text-black"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  📖 Vocabulary
                </h2>
                <p className="text-sm font-medium animate-[slideDown_0.7s_ease-out] text-black">
                  Pelajari kosakata penting dan contoh penggunaannya
                </p>
              </div>

              {/* Vocabulary Cards */}
              <div className="p-8 space-y-4">
                {lesson.content.vocabulary.map((item, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 animate-[fadeInUp_0.5s_ease-out]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3
                        className="text-2xl font-bold text-orange-700"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {item.word}
                      </h3>
                      <span className="text-lg font-semibold text-amber-600 bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
                        {item.meaning}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <p
                        className="text-sm font-medium text-gray-800 italic"
                        style={{ fontFamily: '"Georgia", serif' }}
                      >
                        💬 Example: "{item.example}"
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action Button */}
              <div className="px-8 pb-8 flex justify-end animate-[slideUp_1s_ease-out]">
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Lanjut ke Quiz
                  <ChevronRight className="h-5 w-5 animate-[bounce_1s_ease-in-out_infinite]" />
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 shadow-2xl animate-[fadeIn_0.5s_ease-in]">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
                <h2
                  className="text-3xl font-black mb-2 drop-shadow-lg animate-[slideDown_0.5s_ease-out] text-black"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  🎯 Quiz Time!
                </h2>
                <p className="text-sm font-medium animate-[slideDown_0.7s_ease-out] text-black">
                  Uji pemahaman Anda dengan quiz interaktif
                </p>
              </div>

              {/* Quiz Content */}
              <div className="p-8">
                <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-200 shadow-lg animate-[fadeInUp_0.6s_ease-out]">
                  <p
                    className="text-xl font-semibold text-gray-800 leading-relaxed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {lesson.content.quiz.question}
                  </p>
                </div>

                <div className="space-y-4">
                  {lesson.content.quiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-5 text-left rounded-xl border-3 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-md hover:shadow-xl animate-[fadeInUp_0.5s_ease-out] ${
                        !showResult
                          ? "border-2 border-gray-300 bg-white/80 hover:border-green-500 hover:bg-green-50"
                          : index === lesson.content.quiz.correctAnswer
                          ? "border-3 border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 shadow-green-200"
                          : index === selectedAnswer
                          ? "border-3 border-red-500 bg-gradient-to-r from-red-100 to-rose-100 shadow-red-200"
                          : "border-2 border-gray-200 bg-gray-50 opacity-50"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full border-3 flex items-center justify-center font-bold transition-all ${
                            !showResult
                              ? "border-gray-400 bg-white text-gray-600"
                              : index === lesson.content.quiz.correctAnswer
                              ? "border-green-600 bg-green-500 text-white shadow-lg"
                              : index === selectedAnswer
                              ? "border-red-600 bg-red-500 text-white shadow-lg"
                              : "border-gray-300 bg-gray-100 text-gray-400"
                          }`}
                        >
                          {!showResult && String.fromCharCode(65 + index)}
                          {showResult &&
                            index === lesson.content.quiz.correctAnswer && (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            )}
                          {showResult &&
                            index === selectedAnswer &&
                            index !== lesson.content.quiz.correctAnswer && (
                              <span className="text-white font-bold">✕</span>
                            )}
                        </div>
                        <span
                          className="text-lg font-medium text-gray-800"
                          style={{ fontFamily: '"Inter", sans-serif' }}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {showResult && (
                <div className="px-8 pb-6">
                  <div
                    className={`p-6 rounded-xl mb-6 shadow-xl border-2 animate-[bounceIn_0.5s_ease-out] ${
                      selectedAnswer === lesson.content.quiz.correctAnswer
                        ? "bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-green-400"
                        : "bg-gradient-to-r from-red-100 via-rose-100 to-pink-100 border-red-400"
                    }`}
                  >
                    <p
                      className={`text-lg font-bold ${
                        selectedAnswer === lesson.content.quiz.correctAnswer
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {selectedAnswer === lesson.content.quiz.correctAnswer
                        ? "🎉 Sempurna! Jawaban Anda benar!"
                        : "❌ Kurang tepat. Jawaban yang benar adalah: " +
                          lesson.content.quiz.options[
                            lesson.content.quiz.correctAnswer
                          ]}
                    </p>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="px-8 pb-8 flex justify-end animate-[slideUp_1s_ease-out]">
                  <Button
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Selesaikan Lesson
                    <CheckCircle2 className="h-5 w-5 animate-[bounce_1s_ease-in-out_infinite]" />
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
