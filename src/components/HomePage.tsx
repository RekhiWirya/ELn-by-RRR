import { BookOpen, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: BookOpen,
      title: 'Materi Lengkap',
      description: 'Dari basic hingga advanced dengan kurikulum terstruktur'
    },
    {
      icon: Users,
      title: 'Instruktur Berpengalaman',
      description: 'Belajar dari native speaker dan certified teachers'
    },
    {
      icon: Award,
      title: 'Sertifikat Resmi',
      description: 'Dapatkan sertifikat setelah menyelesaikan kursus'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Pantau perkembangan belajar Anda secara real-time'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Siswa Aktif' },
    { value: '50+', label: 'Kursus Tersedia' },
    { value: '95%', label: 'Tingkat Kepuasan' },
    { value: '24/7', label: 'Akses Materi' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-orange-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl mb-6">
                Kuasai Bahasa Inggris dengan Mudah dan Menyenangkan
              </h1>
              <p className="text-xl mb-8 text-orange-50">
                Platform e-learning terbaik untuk menguasai bahasa Inggris. Belajar kapan saja, dimana saja dengan metode yang terbukti efektif.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => onNavigate('courses')}
                  className="gap-2"
                >
                  Mulai Belajar
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Lihat Demo
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1543109740-4bdb38fda756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzYyMzA0NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="English Learning"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Mengapa Memilih ELn?</h2>
            <p className="text-xl text-gray-600">
              Platform pembelajaran bahasa Inggris terlengkap dan paling efektif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6">Siap Mulai Perjalanan Bahasa Inggris Anda?</h2>
          <p className="text-xl mb-8 text-orange-50">
            Bergabunglah dengan ribuan siswa yang telah meningkatkan kemampuan bahasa Inggris mereka
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => onNavigate('courses')}
            className="gap-2"
          >
            Jelajahi Kursus
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}