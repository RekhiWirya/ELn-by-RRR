import { BookOpen, User, Menu, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';
import logoELn from 'figma:asset/18192ba0538c1cdc87aea4b14687c02b7524a781.png';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <img src={logoELn} alt="ELn Logo" className="h-10 w-auto" />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-primary transition-colors ${
              currentPage === 'home' ? 'text-primary' : ''
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className={`hover:text-primary transition-colors ${
              currentPage === 'courses' ? 'text-primary' : ''
            }`}
          >
            Kursus
          </button>
          <button
            onClick={() => onNavigate('games')}
            className={`hover:text-primary transition-colors flex items-center gap-2 ${
              currentPage === 'games' || currentPage.includes('game-') ? 'text-primary' : ''
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            Mini Games
          </button>
          <button
            onClick={() => onNavigate('my-learning')}
            className={`hover:text-primary transition-colors ${
              currentPage === 'my-learning' ? 'text-primary' : ''
            }`}
          >
            Pembelajaran Saya
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}