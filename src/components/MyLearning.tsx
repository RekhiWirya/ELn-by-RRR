import { Clock, Award, TrendingUp, Target } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface MyLearningProps {
  onNavigate: (page: string, courseId?: number) => void;
}

export function MyLearning({ onNavigate }: MyLearningProps) {
  const stats = [
    { icon: Target, label: 'Lessons Selesai', value: '12', color: 'text-primary', bg: 'bg-orange-100' },
    { icon: Clock, label: 'Waktu Belajar', value: '3.5 jam', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: TrendingUp, label: 'Streak', value: '5 hari', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Award, label: 'Points', value: '450', color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const courses = [
    {
      id: 1,
      title: 'English for Beginners',
      progress: 25,
      lastLesson: 'Practice: Self Introduction',
      completedLessons: 8,
      totalLessons: 32
    },
    {
      id: 2,
      title: 'Intermediate English Mastery',
      progress: 10,
      lastLesson: 'Introduction to Intermediate Level',
      completedLessons: 4,
      totalLessons: 40
    }
  ];

  return (
    <div className="py-12 bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl mb-8">Pembelajaran Saya</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className={`h-12 w-12 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Active Courses */}
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Kursus Aktif</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Terakhir dipelajari: {course.lastLesson}
                    </p>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm text-gray-600">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                      <span className="text-sm text-gray-600">
                        {course.progress}% selesai
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <Button 
                    onClick={() => onNavigate('course-detail', course.id)}
                    className="ml-4"
                  >
                    Lanjutkan
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl mb-4">Pencapaian</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mb-1">First Steps</h3>
              <p className="text-sm text-gray-600">Selesaikan lesson pertama</p>
            </Card>
            
            <Card className="p-6 text-center opacity-50">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-1">Week Warrior</h3>
              <p className="text-sm text-gray-600">Belajar 7 hari berturut-turut</p>
            </Card>
            
            <Card className="p-6 text-center opacity-50">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-1">Course Master</h3>
              <p className="text-sm text-gray-600">Selesaikan satu kursus penuh</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}