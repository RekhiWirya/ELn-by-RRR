import { ArrowLeft, CheckCircle2, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./MagicBento.css";
import classroomImage from "../assets/classroom-teaching.jpg.png";
import studyGroupImage from "../assets/study-group.jpg.png";

// Helper types for MagicBento
type CardTheme =
  | "purple"
  | "orange"
  | "green"
  | "blue"
  | "pink"
  | "cyan"
  | "yellow"
  | "red";

interface MaterialSection {
  title: string;
  content: string;
  label: string;
  theme: CardTheme;
  fullWidth?: boolean;
}

const getGlowColor = (theme: CardTheme): string => {
  const colors: Record<CardTheme, string> = {
    purple: "147, 51, 234",
    orange: "249, 115, 22",
    green: "34, 197, 94",
    blue: "59, 130, 246",
    pink: "236, 72, 153",
    cyan: "6, 182, 212",
    yellow: "234, 179, 8",
    red: "239, 68, 68",
  };
  return colors[theme] || colors.purple;
};

// Magic Particle Card Component
const MagicCard: React.FC<{
  children: React.ReactNode;
  theme: CardTheme;
  className?: string;
  fullWidth?: boolean;
}> = ({ children, theme, className = "", fullWidth = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowColor = getGlowColor(theme);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      element.style.setProperty("--glow-x", `${x}%`);
      element.style.setProperty("--glow-y", `${y}%`);
      element.style.setProperty("--glow-intensity", "1");

      // Tilt effect
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -5;
      const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 5;
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.setProperty("--glow-intensity", "0");
      element.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    };

    const handleClick = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        transform: scale(0);
        opacity: 1;
        transition: transform 0.8s ease, opacity 0.8s ease;
      `;

      element.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = "scale(1)";
        ripple.style.opacity = "0";
      });
      setTimeout(() => ripple.remove(), 800);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("click", handleClick);
    };
  }, [glowColor]);

  return (
    <div
      ref={cardRef}
      className={`magic-bento-card magic-bento-card--border-glow ${
        fullWidth ? "full-width" : ""
      } ${className}`}
      data-theme={theme}
      style={{
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
};

// Parse lesson content into sections
const parseLessonSections = (text: string): MaterialSection[] => {
  const sections: MaterialSection[] = [];
  const themes: CardTheme[] = [
    "purple",
    "orange",
    "green",
    "blue",
    "pink",
    "cyan",
    "yellow",
    "red",
  ];
  const labels = [
    "📚 Materi",
    "👋 Sapaan",
    "🙋 Perkenalan",
    "📝 Grammar",
    "📖 Kosakata",
    "💬 Kalimat",
    "🗣️ Percakapan",
    "🚀 Tips",
  ];

  // Split by section headers (lines starting with │ and containing numbers like "1.", "2.", etc.)
  const sectionRegex = /┌[─]+┐\s*\n│\s*(\d+)\.\s*([^│]+)│\s*\n└[─]+┘/g;
  let match;
  let lastIndex = 0;
  let sectionIndex = 0;

  const matches: { index: number; title: string; number: string }[] = [];

  while ((match = sectionRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      number: match[1],
      title: match[2].trim(),
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];

    const startIndex = currentMatch.index;
    const endIndex = nextMatch ? nextMatch.index : text.length;

    let content = text.slice(startIndex, endIndex).trim();

    // Remove the header box from content
    content = content.replace(/┌[─]+┐\s*\n│[^│]+│\s*\n└[─]+┘\s*\n?/, "").trim();

    // Clean up the content - remove excessive decoration
    content = content.replace(/━+/g, "").replace(/─+/g, "").trim();

    sections.push({
      title: `${currentMatch.number}. ${currentMatch.title}`,
      content: content,
      label: labels[sectionIndex % labels.length],
      theme: themes[sectionIndex % themes.length],
      fullWidth: content.length > 400, // Make larger content full width
    });

    sectionIndex++;
  }

  // If no sections found, return single section with all content
  if (sections.length === 0) {
    sections.push({
      title: "Materi Pembelajaran",
      content: text,
      label: "📚 Materi",
      theme: "purple",
      fullWidth: true,
    });
  }

  return sections;
};

interface TranscriptSegment {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  speaker: string;
}

interface LessonViewProps {
  lessonId: number;
  onBack: () => void;
  onComplete: () => void;
}

export function LessonView({ lessonId, onBack, onComplete }: LessonViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>(null);

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
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 7,
          text: "Hello everyone! Today we're going to learn about greetings and introductions in English.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 7,
          endTime: 14,
          text: "We use different greetings for different times of the day. Good morning, good afternoon, and good evening.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 14,
          endTime: 22,
          text: "When meeting someone for the first time, you can say: Nice to meet you! or Pleased to meet you!",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 22,
          endTime: 30,
          text: "Let's practice these greetings together. Remember to smile and make eye contact!",
          speaker: "Teacher",
        },
      ] as TranscriptSegment[],
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
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 8,
          text: "Welcome back! In this lesson, we'll practice introducing ourselves in English.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 8,
          endTime: 16,
          text: "Let's start with a basic template: Hello, my name is [your name]. I'm from [your city].",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 16,
          endTime: 24,
          text: "You can add more information like your job or hobbies. For example: I'm a teacher. I like reading books.",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 24,
          endTime: 32,
          text: "Always end with a friendly phrase like 'Nice to meet you!' or 'Pleased to meet you!'",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 32,
          endTime: 40,
          text: "Now practice saying your own introduction out loud. Don't be shy!",
          speaker: "Teacher",
        },
      ],
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
    // English for Beginners - Lesson 4: Alphabet & Pronunciation
    4: {
      title: "English Alphabet A-Z",
      duration: "15 menit",
      content: {
        text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚  ENGLISH FOR BEGINNERS - Complete Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


┌───────────────────────────────────────────────┐
│  1. ALPHABET & PRONUNCIATION                  │
└───────────────────────────────────────────────┘

A – /ei/           N – /en/
B – /bi/           O – /oʊ/
C – /si/           P – /pi/
D – /di/           Q – /kjuː/
E – /i/            R – /ar/
F – /ef/           S – /es/
G – /dʒi/          T – /ti/
H – /eɪtʃ/         U – /juː/
I – /ai/           V – /vi/
J – /dʒei/         W – /dʌbəl ju/
K – /kei/          X – /eks/
L – /el/           Y – /wai/
M – /em/           Z – /zed/ (UK) / /zee/ (US)


┌───────────────────────────────────────────────┐
│  2. GREETINGS (Sapaan)                        │
└───────────────────────────────────────────────┘

English              Indonesian
─────────────────────────────────────────────────
Hello                Halo
Hi                   Hai
Good morning         Selamat pagi
Good afternoon       Selamat siang
Good evening         Selamat malam
Goodbye              Sampai jumpa
See you              Sampai ketemu


┌───────────────────────────────────────────────┐
│  3. INTRODUCING YOURSELF                      │
└───────────────────────────────────────────────┘

📝 Basic Structure:

•  My name is … (Nama saya …)
•  I am from … (Saya dari …)
•  I am … years old. (Saya berusia … tahun)
•  I am a student / teacher / worker.

💬 Example:

"Hello, my name is Riann. I am from Indonesia.
I am a student."

┌─────────────────────────────────────────┐
│  4. BASIC GRAMMAR                       │
└─────────────────────────────────────────┘


📌 4.1 Subject Pronouns

Subject          Meaning
─────────────────────────────────────────
I                Saya
You              Kamu
He               Dia (laki-laki)
She              Dia (perempuan)
It               Itu (benda/hewan)
We               Kami/Kita
They             Mereka


📌 4.2 Verb "To Be"

Subject              To Be
─────────────────────────────────────────
I                    am
You / We / They      are
He / She / It        is

Examples:

✓  I am happy.
✓  You are a student.
✓  She is my friend.


📌 4.3 Simple Present (Kebiasaan / Fakta)

Formula:
🔹  Subject + Verb 1
🔹  Jika He/She/It → Verb + s/es

Examples:

✓  I play football.
✓  She plays piano.
✓  They study English.


📌 4.4 Simple Past (Kejadian lampau)

Formula:
🔹  Subject + Verb 2

Examples:

✓  I went to school yesterday.
✓  She cooked noodles.


┌───────────────────────────────────────────────┐
│  5. VOCABULARY FOR BEGINNERS                  │
└───────────────────────────────────────────────┘


📗 Daily Activities:

•  Wake up = Bangun tidur
•  Eat = Makan
•  Study = Belajar
•  Work = Bekerja
•  Sleep = Tidur
•  Cook = Memasak
•  Walk = Berjalan


📘 Common Objects:

•  Book = Buku
•  Table = Meja
•  Phone = HP
•  Bag = Tas
•  Chair = Kursi


📙 Numbers 1-10:

one, two, three, four, five, 
six, seven, eight, nine, ten.


┌───────────────────────────────────────────────┐
│  6. BASIC SENTENCES                           │
└───────────────────────────────────────────────┘

✓  I like English.
✓  This is my book.
✓  Where are you going?
✓  What is your name?
✓  Can you help me?


┌───────────────────────────────────────────────┐
│  7. CONVERSATION PRACTICE                     │
└───────────────────────────────────────────────┘


💬 Dialogue 1: Greeting

A: Hello!
B: Hello! How are you?
A: I'm fine, thank you.


💬 Dialogue 2: Introduction

A: What's your name?
B: My name is Riann.
A: Nice to meet you!
B: Nice to meet you too!

┌───────────────────────────────────────────────┐
│  8. TIPS BELAJAR CEPAT 🚀                     │
└───────────────────────────────────────────────┘

✨  Dengarkan lagu berbahasa Inggris

✨  Tonton video dengan subtitle

✨  Catat 5 kosakata baru setiap hari

✨  Latihan berbicara walaupun salah

✨  Gunakan aplikasi English for Beginners


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              Keep Learning! 📚✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        vocabulary: [
          {
            word: "Alphabet",
            meaning: "Abjad / Huruf",
            example: "The English alphabet has 26 letters.",
          },
          {
            word: "Greeting",
            meaning: "Sapaan / Salam",
            example: "Good morning is a common greeting.",
          },
          {
            word: "Introduce",
            meaning: "Memperkenalkan",
            example: "Let me introduce myself.",
          },
          {
            word: "Pronoun",
            meaning: "Kata ganti",
            example: "I, you, he, she are pronouns.",
          },
          {
            word: "Vocabulary",
            meaning: "Kosakata",
            example: "Learn new vocabulary every day.",
          },
        ],
        quiz: {
          question: 'Bagaimana cara melafalkan huruf "G" dalam bahasa Inggris?',
          options: ["/gi/", "/dʒi/", "/ge/", "/gei/"],
          correctAnswer: 1,
        },
      },
    },
    // Intermediate English Mastery - Lesson 1
    11: {
      title: "Present Perfect Tense",
      duration: "18 menit",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 10,
          text: "Today we're learning about Present Perfect Tense. This is an important grammar structure in English.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 10,
          endTime: 20,
          text: "We use Present Perfect to talk about actions that happened at an unspecified time or actions that affect the present.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 20,
          endTime: 30,
          text: "The formula is: Subject plus have or has, plus the past participle form of the verb.",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 30,
          endTime: 40,
          text: "For example: I have studied English for five years. She has visited Bali twice.",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 40,
          endTime: 50,
          text: "Common time markers include: already, yet, just, ever, and never. These help us know when to use Present Perfect.",
          speaker: "Teacher",
        },
        {
          id: 6,
          startTime: 50,
          endTime: 60,
          text: "Remember: Have you ever been to Japan? Has she called you today? These are typical Present Perfect questions.",
          speaker: "Teacher",
        },
      ],
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
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 8,
          text: "Welcome to Business and Professional Vocabulary. Today we'll learn essential business terms.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 8,
          endTime: 16,
          text: "Let's start with common office words: Meeting, Deadline, Project, Presentation, and Report.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 16,
          endTime: 24,
          text: "In business communication, we often say: Could you please send me the report? or Let's schedule a meeting.",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 24,
          endTime: 32,
          text: "Important business verbs include: negotiate, collaborate, implement, analyze, and coordinate.",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 32,
          endTime: 40,
          text: "Remember to be professional and polite in all business communications. Use phrases like 'I appreciate your help' or 'Thank you for your time'.",
          speaker: "Teacher",
        },
      ],
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
      duration: "16 menit",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 8,
          text: "Small talk is an important skill for building relationships. Let's learn how to do it naturally.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 8,
          endTime: 16,
          text: "Safe topics include weather, weekend plans, hobbies, and recent events. Avoid politics, religion, or personal finances.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 16,
          endTime: 24,
          text: "To start: Nice weather today, isn't it? Or: Do you have any plans for the weekend?",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 24,
          endTime: 32,
          text: "Keep the conversation going with follow-up questions: That's interesting! Tell me more. Or: Really? How did that happen?",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 32,
          endTime: 40,
          text: "To close politely: It was nice talking to you! or I should get going, but let's catch up soon!",
          speaker: "Teacher",
        },
      ],
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
    // Business English Professional - Lesson 1
    101: {
      title: "Professional Email Writing",
      duration: "20 menit",
      content: {
        text: `Email profesional adalah keterampilan penting dalam dunia bisnis modern. Mari pelajari cara menulis email yang efektif dan profesional.

Email Structure (Struktur Email):

1. Subject Line (Subjek)
• Clear and specific - Jelas dan spesifik
• Include key information - Sertakan informasi penting
• Examples: "Meeting Request - Project Update", "Follow-up: Q4 Sales Report"

2. Greeting/Salutation (Salam Pembuka)
• Formal: "Dear Mr./Ms. [Last Name],"
• Semi-formal: "Hello [First Name],"
• Team email: "Dear Team," or "Hi everyone,"

3. Opening (Pembukaan)
• State your purpose immediately
• "I am writing to..."
• "I hope this email finds you well..."
• "Following up on our conversation..."

4. Body (Isi Utama)
• Keep it concise and clear
• Use bullet points for multiple items
• One topic per paragraph
• Be specific and actionable

5. Closing (Penutup)
• Thank you statement
• Call to action
• "Please let me know if you need any further information."
• "I look forward to hearing from you."

6. Sign-off (Salam Penutup)
• Formal: "Sincerely," "Best regards," "Kind regards,"
• Semi-formal: "Thanks," "Best," "Cheers,"

Professional Email Phrases:

Opening:
• "I hope this email finds you well."
• "Thank you for your email regarding..."
• "I am writing to inquire about..."

Requesting:
• "Could you please...?"
• "I would appreciate if you could..."
• "Would it be possible to...?"

Responding:
• "Thank you for bringing this to my attention."
• "I appreciate your prompt response."
• "As discussed in our meeting..."

Apologizing:
• "I apologize for any inconvenience."
• "Sorry for the delayed response."
• "I regret to inform you that..."

Example Professional Email:

Subject: Project Timeline - Q1 2024

Dear Ms. Johnson,

I hope this email finds you well. I am writing to follow up on our discussion about the Q1 2024 project timeline.

As discussed in our meeting, I would like to propose the following schedule:
• Project kickoff: January 15, 2024
• First milestone: February 1, 2024
• Final delivery: March 30, 2024

Could you please review this timeline and let me know if it works for your team?

I look forward to your feedback.

Best regards,
John Smith
Project Manager`,
        vocabulary: [
          {
            word: "Inquire",
            meaning: "Menanyakan",
            example: "I am writing to inquire about the position.",
          },
          {
            word: "Regarding",
            meaning: "Mengenai",
            example: "Regarding your email, I have some questions.",
          },
          {
            word: "Appreciate",
            meaning: "Menghargai",
            example: "I appreciate your quick response.",
          },
          {
            word: "Prompt",
            meaning: "Cepat/Segera",
            example: "Thank you for your prompt reply.",
          },
          {
            word: "Attach",
            meaning: "Melampirkan",
            example: "Please find attached the document.",
          },
        ],
        quiz: {
          question:
            "What is the most professional way to start a business email?",
          options: ["Hey, what's up?", "Dear Mr. Smith,", "Yo!", "Hi there!"],
          correctAnswer: 1,
        },
      },
    },
    // TOEFL Preparation - Lesson 1
    201: {
      title: "TOEFL Reading Strategies",
      duration: "25 menit",
      content: {
        text: `TOEFL Reading section mengukur kemampuan Anda memahami teks akademik dalam bahasa Inggris. Mari pelajari strategi efektif untuk menghadapi section ini.

TOEFL Reading Section Overview:

Format:
• 3-4 passages (700 words each)
• 10 questions per passage
• 54-72 minutes total
• Academic topics from various fields

Question Types:

1. Factual Information Questions
• "According to the paragraph..."
• "The author mentions X in order to..."
• Strategy: Scan for specific information

2. Negative Factual Information
• "All of the following are mentioned EXCEPT..."
• Strategy: Eliminate wrong answers

3. Inference Questions
• "What can be inferred about...?"
• "The author implies that..."
• Strategy: Read between the lines

4. Vocabulary Questions
• "The word X in the passage is closest in meaning to..."
• Strategy: Use context clues

5. Reference Questions
• "The word 'it' in the passage refers to..."
• Strategy: Check preceding sentences

6. Sentence Simplification
• "Which sentence best expresses the essential information?"
• Strategy: Identify main ideas

7. Insert Text Questions
• "Where would the sentence best fit?"
• Strategy: Look for logical transitions

8. Prose Summary
• Choose 3 main ideas from 6 options
• Strategy: Focus on big picture

9. Fill in a Table
• Categorize information
• Strategy: Understand organizational structure

Key Strategies:

1. Time Management:
• Spend 20 minutes per passage
• Don't get stuck on one question
• Flag difficult questions and return later

2. Skimming Technique:
• Read title and introduction
• Read first sentence of each paragraph
• Read conclusion
• Get the main idea before details

3. Scanning for Details:
• Use keywords from questions
• Locate specific information quickly
• Don't read every word

4. Vocabulary Building:
• Learn academic word list
• Study prefixes and suffixes
• Practice context clues

5. Note-Taking:
• Write key points briefly
• Use abbreviations
• Note paragraph main ideas

Practice Tips:

1. Read academic articles daily
• Science journals
• History texts
• Social sciences

2. Build reading speed
• Start with 250 words/minute
• Gradually increase speed

3. Practice with time limits
• Simulate test conditions
• Use official practice tests

4. Analyze mistakes
• Understand why answers are wrong
• Learn from error patterns

Common Mistakes to Avoid:

1. Reading too slowly
• Don't try to understand every word
• Focus on main ideas

2. Choosing answers based on memory
• Always refer back to passage
• Don't rely on prior knowledge

3. Overthinking
• Trust your first impression
• Don't second-guess excessively

4. Ignoring transition words
• "However," "Therefore," "In contrast"
• These signal relationships

Remember: Practice makes perfect! Take multiple practice tests to improve your skills.`,
        vocabulary: [
          {
            word: "Inference",
            meaning: "Kesimpulan",
            example: "Make an inference based on the passage.",
          },
          {
            word: "Imply",
            meaning: "Mengisyaratkan",
            example: "The author implies that climate change is serious.",
          },
          {
            word: "Paraphrase",
            meaning: "Mengungkapkan kembali",
            example: "Paraphrase the main idea in your own words.",
          },
          {
            word: "Skim",
            meaning: "Membaca sekilas",
            example: "Skim the passage to get the main idea.",
          },
          {
            word: "Scan",
            meaning: "Memindai",
            example: "Scan the text for specific information.",
          },
        ],
        quiz: {
          question:
            "How much time should you spend on each TOEFL reading passage?",
          options: ["10 minutes", "20 minutes", "30 minutes", "40 minutes"],
          correctAnswer: 1,
        },
      },
    },
  };

  const lesson = lessonData[lessonId as keyof typeof lessonData];

  // Guard clause for lessons without content
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Lesson Belum Tersedia</h2>
          <p className="text-gray-600 mb-6">
            Konten untuk lesson ini sedang dalam pengembangan. Silakan coba
            lesson lain atau kembali nanti.
          </p>
          <Button onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Course
          </Button>
        </Card>
      </div>
    );
  }

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
        <div className="max-w-5xl mx-auto">
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Header Section */}
              <div
                className="p-6 rounded-2xl mb-8 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #06b6d4 100%)",
                }}
              >
                <motion.h2
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl mb-2 text-white drop-shadow-lg"
                  style={{
                    fontFamily: '"Fredoka", "Poppins", sans-serif',
                    fontWeight: 700,
                    letterSpacing: "1px",
                  }}
                >
                  📚 Materi Pembelajaran
                </motion.h2>
                <motion.p
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-sm font-medium text-white/90"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Pelajari dengan seksama untuk memahami konsep dasar
                </motion.p>
              </div>

              {/* Magic Bento Cards for Lesson 4 (multi-section) */}
              {lessonId === 4 ? (
                <>
                  <div className="card-grid mb-8">
                    {parseLessonSections(lesson.content.text).map(
                      (section, index) => (
                        <React.Fragment key={`section-wrapper-${index}`}>
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className={section.fullWidth ? "col-span-full" : ""}
                          >
                            <MagicCard
                              theme={section.theme}
                              fullWidth={section.fullWidth}
                            >
                              <div className="magic-bento-card__header">
                                <div className="magic-bento-card__label">
                                  {section.label}
                                </div>
                              </div>
                              <div className="magic-bento-card__content">
                                <h2 className="magic-bento-card__title">
                                  {section.title}
                                </h2>
                                <p className="magic-bento-card__description">
                                  {section.content}
                                </p>
                              </div>
                            </MagicCard>
                          </motion.div>

                          {/* Insert classroom image card after INTRODUCING YOURSELF section (index 2) */}
                          {index === 2 && (
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.35 }}
                              className="col-span-full"
                            >
                              <MagicCard theme="cyan" fullWidth={true}>
                                <div className="magic-bento-card__header">
                                  <div className="magic-bento-card__label">
                                    📸 Classroom
                                  </div>
                                </div>
                                <div className="magic-bento-card__content">
                                  <h2 className="magic-bento-card__title">
                                    English Grammar in Action
                                  </h2>
                                  <div className="mt-4 rounded-xl overflow-hidden shadow-lg">
                                    <img
                                      src={classroomImage}
                                      alt="English Grammar classroom session"
                                      className="w-full h-auto object-cover rounded-xl"
                                      style={{
                                        maxHeight: "500px",
                                        objectPosition: "center",
                                      }}
                                    />
                                  </div>
                                  <p
                                    className="magic-bento-card__description mt-4"
                                    style={{ fontSize: "14px", opacity: 0.8 }}
                                  >
                                    💡 Belajar bahasa Inggris lebih menyenangkan
                                    dengan praktik langsung di kelas!
                                  </p>
                                </div>
                              </MagicCard>
                            </motion.div>
                          )}

                          {/* Insert study group image card after card 5 (index 4) */}
                          {index === 4 && (
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.65 }}
                              className="col-span-full"
                            >
                              <MagicCard theme="green" fullWidth={true}>
                                <div className="magic-bento-card__header">
                                  <div className="magic-bento-card__label">
                                    📚 Study Group
                                  </div>
                                </div>
                                <div className="magic-bento-card__content">
                                  <h2 className="magic-bento-card__title">
                                    Collaborative Learning
                                  </h2>
                                  <div className="mt-4 rounded-xl overflow-hidden shadow-lg">
                                    <img
                                      src={studyGroupImage}
                                      alt="Study group learning together"
                                      className="w-full h-auto object-cover rounded-xl"
                                      style={{
                                        maxHeight: "500px",
                                        objectPosition: "center",
                                      }}
                                    />
                                  </div>
                                  <p
                                    className="magic-bento-card__description mt-4"
                                    style={{ fontSize: "14px", opacity: 0.8 }}
                                  >
                                    🤝 Belajar bersama teman membuat pemahaman
                                    semakin mudah!
                                  </p>
                                </div>
                              </MagicCard>
                            </motion.div>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </div>
                </>
              ) : (
                /* Regular single card for other lessons */
                <Card className="p-0 overflow-hidden border-2 border-purple-200 shadow-[0_0_30px_rgba(147,51,234,0.15)] bg-white mb-8">
                  <div
                    className="p-8"
                    style={{
                      background:
                        "linear-gradient(to bottom, #faf5ff, #ffffff)",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="prose max-w-none bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-inner"
                    >
                      <pre
                        className="whitespace-pre-wrap leading-relaxed text-base"
                        style={{
                          fontFamily:
                            '"Poppins", "Segoe UI", system-ui, sans-serif',
                          lineHeight: "1.9",
                          color: "#581c87",
                        }}
                      >
                        {lesson.content.text}
                      </pre>
                    </motion.div>
                  </div>
                </Card>
              )}

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-end"
              >
                <Button
                  onClick={handleNext}
                  className="gap-2 text-white font-bold shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg border-0"
                  style={{
                    background:
                      "linear-gradient(to right, #9333ea, #ec4899, #06b6d4)",
                    fontFamily: '"Fredoka", sans-serif',
                  }}
                >
                  Lanjut ke Vocabulary
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Header Section */}
              <div
                className="p-6 rounded-2xl mb-8 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%)",
                }}
              >
                <motion.h2
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl mb-2 text-white drop-shadow-lg"
                  style={{
                    fontFamily: '"Righteous", "Poppins", sans-serif',
                    letterSpacing: "2px",
                  }}
                >
                  📖 VOCABULARY
                </motion.h2>
                <motion.p
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-sm font-medium text-white/90"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Pelajari kosakata penting dan contoh penggunaannya
                </motion.p>
              </div>

              {/* Vocabulary Cards with MagicCard */}
              <div className="card-grid mb-8">
                {lesson.content.vocabulary.map((item, index) => {
                  const vocabThemes: CardTheme[] = [
                    "orange",
                    "yellow",
                    "pink",
                    "red",
                    "cyan",
                    "green",
                    "blue",
                    "purple",
                  ];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <MagicCard
                        theme={vocabThemes[index % vocabThemes.length]}
                      >
                        <div className="magic-bento-card__header">
                          <div className="magic-bento-card__label">
                            📝 Word {index + 1}
                          </div>
                        </div>
                        <div className="magic-bento-card__content">
                          <h2
                            className="magic-bento-card__title"
                            style={{ fontSize: "1.75rem" }}
                          >
                            {item.word}
                          </h2>
                          <div
                            className="inline-block px-4 py-2 rounded-full mb-4"
                            style={{
                              background: "rgba(255,255,255,0.15)",
                              border: "1px solid rgba(255,255,255,0.3)",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: 600,
                                color: "#fff",
                              }}
                            >
                              {item.meaning}
                            </span>
                          </div>
                          <div
                            className="p-4 rounded-lg mt-2"
                            style={{
                              background: "rgba(0,0,0,0.2)",
                              borderLeft: "3px solid rgba(255,255,255,0.5)",
                            }}
                          >
                            <p
                              className="text-sm italic"
                              style={{
                                fontFamily: '"Georgia", serif',
                                color: "rgba(255,255,255,0.9)",
                              }}
                            >
                              💬 "{item.example}"
                            </p>
                          </div>
                        </div>
                      </MagicCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex justify-end"
              >
                <Button
                  onClick={handleNext}
                  className="gap-2 text-white font-bold shadow-[0_0_20px_rgba(251,146,60,0.4)] hover:shadow-[0_0_30px_rgba(251,146,60,0.6)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg border-0"
                  style={{
                    background:
                      "linear-gradient(to right, #ea580c, #f97316, #fbbf24)",
                    fontFamily: '"Righteous", sans-serif',
                    letterSpacing: "1px",
                  }}
                >
                  Lanjut ke Quiz
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="p-0 overflow-hidden border-2 border-green-200 shadow-[0_0_30px_rgba(34,197,94,0.15)] bg-white">
                {/* Header Section */}
                <div
                  className="p-6 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(to right, #16a34a, #22c55e, #06b6d4)",
                  }}
                >
                  <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl mb-2 text-white drop-shadow-lg"
                    style={{
                      fontFamily: '"Bangers", "Poppins", sans-serif',
                      letterSpacing: "3px",
                    }}
                  >
                    🎯 QUIZ TIME!
                  </motion.h2>
                  <motion.p
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm font-medium text-white/90"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Uji pemahaman Anda dengan quiz interaktif
                  </motion.p>
                </div>

                {/* Quiz Content */}
                <div
                  className="p-8"
                  style={{
                    background: "linear-gradient(to bottom, #f0fdf4, #ffffff)",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8 bg-white p-6 rounded-xl border-2 border-green-200 shadow-inner"
                  >
                    <p
                      className="text-xl leading-relaxed"
                      style={{
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 600,
                        color: "#166534",
                      }}
                    >
                      {lesson.content.quiz.question}
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    {lesson.content.quiz.options.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-5 text-left rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
                          !showResult
                            ? "border-2 border-green-200 bg-white hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                            : index === lesson.content.quiz.correctAnswer
                            ? "border-2 border-green-500 bg-green-50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                            : index === selectedAnswer
                            ? "border-2 border-red-500 bg-red-50 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                            : "border-2 border-gray-200 bg-gray-50 opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              !showResult
                                ? "border-2 border-green-300 bg-green-50"
                                : index === lesson.content.quiz.correctAnswer
                                ? "border-2 border-green-500 bg-green-500"
                                : index === selectedAnswer
                                ? "border-2 border-red-500 bg-red-500"
                                : "border-2 border-gray-300 bg-gray-100"
                            }`}
                            style={{
                              fontFamily: '"Fredoka", sans-serif',
                              fontWeight: 600,
                              color: !showResult
                                ? "#16a34a"
                                : index === lesson.content.quiz.correctAnswer ||
                                  index === selectedAnswer
                                ? "#fff"
                                : "#9ca3af",
                            }}
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
                            className="text-lg"
                            style={{
                              fontFamily: '"Poppins", sans-serif',
                              fontWeight: 500,
                              color: "#166534",
                            }}
                          >
                            {option}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="px-8 pb-6"
                  >
                    <div
                      className={`p-6 rounded-xl mb-6 border-2 ${
                        selectedAnswer === lesson.content.quiz.correctAnswer
                          ? "bg-green-50 border-green-400"
                          : "bg-red-50 border-red-400"
                      }`}
                    >
                      <p
                        className="text-lg"
                        style={{
                          fontFamily: '"Fredoka", sans-serif',
                          fontWeight: 600,
                          color:
                            selectedAnswer === lesson.content.quiz.correctAnswer
                              ? "#166534"
                              : "#dc2626",
                        }}
                      >
                        {selectedAnswer === lesson.content.quiz.correctAnswer
                          ? "🎉 Sempurna! Jawaban Anda benar!"
                          : "❌ Kurang tepat. Jawaban yang benar adalah: " +
                            lesson.content.quiz.options[
                              lesson.content.quiz.correctAnswer
                            ]}
                      </p>
                    </div>
                  </motion.div>
                )}

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="px-8 pb-8 flex justify-end bg-white"
                  >
                    <Button
                      onClick={handleNext}
                      className="gap-2 text-white font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg border-0"
                      style={{
                        background:
                          "linear-gradient(to right, #16a34a, #22c55e, #06b6d4)",
                        fontFamily: '"Bangers", sans-serif',
                        letterSpacing: "2px",
                      }}
                    >
                      SELESAIKAN LESSON
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
