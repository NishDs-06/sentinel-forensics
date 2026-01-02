import { Shield, Menu, History, HelpCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNavigate?: (page: 'upload' | 'history' | 'help') => void;
  currentPage?: string;
}

export function Header({ onNavigate, currentPage = 'upload' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'upload', label: 'Analyze', icon: Upload },
    { id: 'history', label: 'History', icon: History },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
              <Shield className="relative h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-mono text-lg font-bold tracking-wider text-foreground">
                EDGE<span className="text-primary">GUARD</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                Deepfake Detection
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'cyber' : 'ghost'}
                size="sm"
                onClick={() => onNavigate?.(item.id as 'upload' | 'history' | 'help')}
                className="gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'cyber' : 'ghost'}
                  onClick={() => {
                    onNavigate?.(item.id as 'upload' | 'history' | 'help');
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
