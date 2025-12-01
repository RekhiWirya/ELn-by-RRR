import { useState } from "react";
import { MaterialCard, LessonMaterial } from "./MaterialCard";
import { Card } from "./ui/card";

export function MaterialsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);

  const materials: LessonMaterial[] = [
    {
      id: 1,
      title: "Introduction to English Grammar",
      description:
        "Pelajari dasar-dasar tata bahasa Inggris meliputi parts of speech, sentence structure, dan basic tenses.",
      type: "reading",
      duration: "15 menit",
      difficulty: "easy",
      completed: false,
      content:
        "Grammar is the foundation of any language. In this lesson, we'll explore the basic building blocks of English sentences including nouns, verbs, adjectives, and more...",
    },
    {
      id: 2,
      title: "Present Tense Mastery",
      description:
        "Kuasai penggunaan present simple dan present continuous dalam berbagai konteks percakapan sehari-hari.",
      type: "video",
      duration: "20 menit",
      difficulty: "medium",
      completed: true,
      content:
        "The present tense is one of the most commonly used tenses in English. Learn when to use present simple vs present continuous with real-life examples...",
    },
    {
      id: 3,
      title: "Vocabulary Building Exercise",
      description:
        "Latihan interaktif untuk memperluas kosakata dengan 50 kata umum yang sering digunakan dalam percakapan.",
      type: "exercise",
      duration: "10 menit",
      difficulty: "easy",
      completed: false,
      content:
        "Expand your vocabulary with these essential English words. Practice pronunciation, meaning, and usage in context...",
    },
    {
      id: 4,
      title: "Grammar Quiz: Tenses",
      description:
        "Uji pemahaman Anda tentang berbagai tenses dengan 20 pertanyaan pilihan ganda dan essay.",
      type: "quiz",
      duration: "25 menit",
      difficulty: "hard",
      completed: false,
      content:
        "Test your knowledge of English tenses including present, past, future, and perfect tenses. This comprehensive quiz covers all major tense forms...",
    },
    {
      id: 5,
      title: "Business Email Writing",
      description:
        "Pelajari cara menulis email bisnis yang profesional dengan struktur yang tepat dan vocabulary formal.",
      type: "reading",
      duration: "18 menit",
      difficulty: "medium",
      completed: false,
      content:
        "Writing professional emails is an essential skill in the business world. Learn the proper format, tone, and language for different types of business correspondence...",
    },
    {
      id: 6,
      title: "Conversation Practice: Daily Activities",
      description:
        "Video interaktif untuk berlatih percakapan tentang aktivitas sehari-hari dengan native speaker.",
      type: "video",
      duration: "30 menit",
      difficulty: "medium",
      completed: true,
      content:
        "Practice real conversations about daily routines, hobbies, and activities. Listen to native speakers and learn natural expressions...",
    },
  ];

  const handleSelectMaterial = (materialId: number) => {
    setSelectedMaterial(materialId);
    // Di sini nanti bisa navigate ke detail page atau buka modal
    console.log("Selected material:", materialId);
  };

  return (
    <div className="py-12 bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-5xl mb-4 font-extrabold bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Materi Pembelajaran
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pilih materi yang ingin Anda pelajari dan tingkatkan kemampuan
            bahasa Inggris Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-scale-in">
          <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="text-4xl font-bold text-primary mb-2">
              {materials.length}
            </div>
            <div className="text-gray-600">Total Materi</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {materials.filter((m) => m.completed).length}
            </div>
            <div className="text-gray-600">Selesai</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {materials.filter((m) => !m.completed).length}
            </div>
            <div className="text-gray-600">Belum Selesai</div>
          </Card>
        </div>

        {/* Materials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {materials.map((material, index) => (
            <MaterialCard
              key={material.id}
              material={material}
              onSelect={handleSelectMaterial}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
