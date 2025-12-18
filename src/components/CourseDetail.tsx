import { Clock, Users, Star, BookOpen, PlayCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseDetailProps {
  courseId: number;
  onBack: () => void;
  onStartLesson: (lessonId: number) => void;
}

export function CourseDetail({ courseId, onBack, onStartLesson }: CourseDetailProps) {
  const courseData = {
    1: {
      title: 'English for Beginners',
      description: 'Mulai perjalanan bahasa Inggris Anda dari dasar. Pelajari vocabulary, grammar, dan conversation dasar dengan metode yang mudah dipahami dan menyenangkan.',
      level: 'Beginner',
      duration: '8 minggu',
      students: 2450,
      rating: 4.8,
      lessons: 32,
      image: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzYyMzA0NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      instructor: 'Sarah Johnson',
      modules: [
        {
          id: 1,
          title: 'Introduction & Basic Greetings',
          lessons: [
            { id: 1, title: 'Welcome to English Learning', duration: '5 menit', completed: true },
            { id: 2, title: 'Basic Greetings & Introductions', duration: '12 menit', completed: true },
            { id: 3, title: 'Practice: Self Introduction', duration: '10 menit', completed: false },
          ]
        },
        {
          id: 2,
          title: 'Alphabet & Pronunciation',
          lessons: [
            { id: 4, title: 'English Alphabet A-Z', duration: '15 menit', completed: false },
            { id: 5, title: 'Vowels & Consonants', duration: '12 menit', completed: false },
            { id: 6, title: 'Pronunciation Practice', duration: '18 menit', completed: false },
          ]
        },
        {
          id: 3,
          title: 'Numbers & Colors',
          lessons: [
            { id: 7, title: 'Numbers 1-100', duration: '10 menit', completed: false },
            { id: 8, title: 'Colors & Shapes', duration: '8 menit', completed: false },
            { id: 9, title: 'Quiz: Numbers & Colors', duration: '15 menit', completed: false },
          ]
        }
      ]
    }
  };

  const course = courseData[courseId as keyof typeof courseData];
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(l => l.completed).length, 
    0
  );
  const progress = (completedLessons / totalLessons) * 100;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-orange-100 text-orange-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="py-8 bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Kursus
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden mb-6">
              <div className="relative h-64">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl mb-3">{course.title}</h1>
                <p className="text-gray-600 mb-4">Oleh {course.instructor}</p>
                <p className="text-lg mb-6">{course.description}</p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <div>
                      <div className="text-sm">Durasi</div>
                      <div>{course.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-5 w-5" />
                    <div>
                      <div className="text-sm">Lessons</div>
                      <div>{course.lessons} materi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-5 w-5" />
                    <div>
                      <div className="text-sm">Siswa</div>
                      <div>{course.students.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Content */}
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Isi Kursus</h2>
              <Accordion type="single" collapsible defaultValue="module-1">
                {course.modules.map((module) => (
                  <AccordionItem key={module.id} value={`module-${module.id}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span>{module.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-8">
                        {module.lessons.map((lesson) => (
                          <div 
                            key={lesson.id}
                            className="flex items-center justify-between p-3 hover:bg-orange-50 rounded cursor-pointer"
                            onClick={() => onStartLesson(lesson.id)}
                          >
                            <div className="flex items-center gap-3">
                              {lesson.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <PlayCircle className="h-5 w-5 text-gray-400" />
                              )}
                              <span className={lesson.completed ? 'text-gray-600' : ''}>
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl mb-4">Progress Anda</h3>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Selesai</span>
                  <span className="text-sm">{completedLessons}/{totalLessons} lessons</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-gray-600 mt-1">
                  {Math.round(progress)}% Complete
                </div>
              </div>

              <Button 
                className="w-full mb-3"
                onClick={() => onStartLesson(3)}
              >
                Lanjutkan Belajar
              </Button>
              <Button variant="outline" className="w-full">
                Reset Progress
              </Button>

              <div className="mt-6 pt-6 border-t">
                <h4 className="mb-3">Yang Akan Anda Pelajari:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Dasar-dasar bahasa Inggris</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Grammar fundamental</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Conversation sehari-hari</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Listening & pronunciation</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}