import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, BookOpen, FileText, CheckCircle2 } from "lucide-react";
import { ScrollRevealText } from "./ui/ScrollRevealText";

export interface LessonMaterial {
  id: number;
  title: string;
  description: string;
  type: "reading" | "video" | "exercise" | "quiz";
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  completed?: boolean;
  image?: string;
  content: string;
}

interface MaterialCardProps {
  material: LessonMaterial;
  onSelect: (materialId: number) => void;
  index?: number;
}

export function MaterialCard({
  material,
  onSelect,
  index = 0,
}: MaterialCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reading":
        return <BookOpen className="h-5 w-5" />;
      case "video":
        return <FileText className="h-5 w-5" />;
      case "exercise":
        return <FileText className="h-5 w-5" />;
      case "quiz":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reading":
        return "bg-blue-100 text-blue-700";
      case "video":
        return "bg-purple-100 text-purple-700";
      case "exercise":
        return "bg-green-100 text-green-700";
      case "quiz":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2 border-transparent hover:border-primary/30 animate-[fadeInUp_0.6s_ease-out] hover-lift"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Animated Title Section */}
      <div className="bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <ScrollRevealText
            containerClassName="mb-4"
            textClassName="text-white drop-shadow-2xl"
          >
            {material.title}
          </ScrollRevealText>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-4 right-4 flex gap-2">
          {material.completed && (
            <Badge className="bg-green-500 text-white shadow-lg animate-bounce">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Selesai
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 bg-white">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={`${getTypeColor(material.type)} shadow-sm`}>
            <span className="mr-1">{getTypeIcon(material.type)}</span>
            {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
          </Badge>
          <Badge
            className={`${getDifficultyColor(material.difficulty)} shadow-sm`}
          >
            {material.difficulty.charAt(0).toUpperCase() +
              material.difficulty.slice(1)}
          </Badge>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-800 transition-colors">
          {material.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{material.duration}</span>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 group-hover:bg-gray-100 transition-colors">
          <p className="text-sm text-gray-600 line-clamp-2">
            {material.content}
          </p>
        </div>

        <Button
          onClick={() => onSelect(material.id)}
          className="w-full group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 hover-shine"
        >
          {material.completed ? "Lihat Lagi" : "Mulai Belajar"}
        </Button>
      </div>

      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Card>
  );
}
