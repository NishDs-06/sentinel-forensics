import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Globe, 
  HelpCircle,
  Link as LinkIcon,
  Calendar,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SourceInfo } from '@/store/analysisStore';

interface SourceInfoFormProps {
  onSubmit: (info: SourceInfo) => void;
  isLoading?: boolean;
}

const platforms = [
  { id: 'WhatsApp', icon: MessageSquare, color: 'text-success' },
  { id: 'Twitter', icon: Globe, color: 'text-info' },
  { id: 'Facebook', icon: Globe, color: 'text-info' },
  { id: 'Telegram', icon: MessageSquare, color: 'text-info' },
  { id: 'Instagram', icon: Globe, color: 'text-warning' },
  { id: 'Email', icon: Mail, color: 'text-muted-foreground' },
  { id: 'Direct Device', icon: Smartphone, color: 'text-success' },
  { id: 'Unknown', icon: HelpCircle, color: 'text-destructive' },
];

export function SourceInfoForm({ onSubmit, isLoading }: SourceInfoFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [url, setUrl] = useState('');
  const [forwardCount, setForwardCount] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = () => {
    if (!selectedPlatform) return;

    onSubmit({
      platform: selectedPlatform,
      url: url || undefined,
      forwardCount: forwardCount ? parseInt(forwardCount) : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Platform Selection */}
      <div className="space-y-3">
        <label className="font-mono text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full" />
          Where did you get this media?
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              disabled={isLoading}
              className={cn(
                "relative p-3 rounded-lg border transition-all duration-200 text-left group",
                selectedPlatform === platform.id
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border bg-secondary hover:border-primary/50 hover:bg-secondary/80"
              )}
            >
              <div className="flex items-center gap-2">
                <platform.icon className={cn(
                  "h-4 w-4 transition-colors",
                  selectedPlatform === platform.id ? "text-primary" : platform.color
                )} />
                <span className={cn(
                  "font-mono text-xs",
                  selectedPlatform === platform.id ? "text-primary" : "text-foreground"
                )}>
                  {platform.id}
                </span>
              </div>
              {selectedPlatform === platform.id && (
                <motion.div
                  layoutId="platform-indicator"
                  className="absolute inset-0 border-2 border-primary rounded-lg"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Fields */}
      {selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          {/* URL Input */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="h-3 w-3" />
              Original URL (optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Forward Count */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="h-3 w-3" />
              Times forwarded/shared (optional)
            </label>
            <select
              value={forwardCount}
              onChange={(e) => setForwardCount(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">Unknown</option>
              <option value="0">Original / First hand</option>
              <option value="1">1 forward</option>
              <option value="2">2 forwards</option>
              <option value="5">5+ forwards</option>
              <option value="10">10+ forwards (viral)</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedPlatform || isLoading}
          variant="cyber"
          size="xl"
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Initializing Analysis...
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
              Analyze Media
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
