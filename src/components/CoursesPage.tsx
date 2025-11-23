import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  lessons: number;
  image: string;
}

interface CoursesPageProps {
  onSelectCourse: (courseId: number) => void;
}

export function CoursesPage({ onSelectCourse }: CoursesPageProps) {
  const courses: Course[] = [
    {
      id: 1,
      title: 'English for Beginners',
      description: 'Mulai perjalanan bahasa Inggris Anda dari dasar. Pelajari vocabulary, grammar, dan conversation dasar.',
      level: 'Beginner',
      duration: '8 minggu',
      students: 2450,
      rating: 4.8,
      lessons: 32,
      image: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzYyMzA0NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      title: 'Intermediate English Mastery',
      description: 'Tingkatkan kemampuan berbahasa Inggris Anda ke level menengah dengan fokus pada speaking dan writing.',
      level: 'Intermediate',
      duration: '10 minggu',
      students: 1820,
      rating: 4.9,
      lessons: 40,
      image: 'https://images.unsplash.com/photo-1596247290824-e9f12b8c574f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBvbmxpbmV8ZW58MXx8fHwxNzYyMjU0NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      title: 'Business English Professional',
      description: 'Kuasai bahasa Inggris untuk dunia kerja. Email, presentation, meeting, dan negotiation skills.',
      level: 'Advanced',
      duration: '12 minggu',
      students: 1560,
      rating: 4.9,
      lessons: 45,
      image: 'https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjIyOTcyODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      title: 'TOEFL Preparation Course',
      description: 'Persiapan lengkap untuk tes TOEFL dengan strategi, tips, dan latihan soal komprehensif.',
      level: 'Intermediate',
      duration: '8 minggu',
      students: 980,
      rating: 4.7,
      lessons: 36,
      image: 'https://images.unsplash.com/photo-1566314748815-2ff5db8edf2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIxOTEzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-orange-100 text-orange-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="py-12 bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl mb-4">Jelajahi Kursus</h1>
          <p className="text-xl text-gray-600">
            Pilih kursus yang sesuai dengan level dan tujuan belajar Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-2 relative h-48 md:h-auto">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-3 left-3 ${getLevelColor(course.level)}`}>
                    {course.level}
                  </Badge>
                </div>
                
                <div className="md:col-span-3 p-6 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-2xl mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        {course.students.toLocaleString()} siswa
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {course.rating} rating
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onSelectCourse(course.id)}
                    className="w-full"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}