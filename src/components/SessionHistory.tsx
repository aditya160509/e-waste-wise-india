import { useState, useEffect } from 'react';
import { History, Trash2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface HistoryItem {
  id: string;
  deviceClass: string;
  confidence: number;
  co2Saved: number;
  timestamp: number;
}

interface SessionHistoryProps {
  currentResult?: {
    class: string;
    confidence: number;
  };
}

const SessionHistory = ({ currentResult }: SessionHistoryProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const STORAGE_KEY = 'ewaste_history';
  const MAX_HISTORY_ITEMS = 5;

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (error) {
        console.error('Error parsing history from localStorage:', error);
      }
    }
  }, []);

  // Save current result to history
  useEffect(() => {
    if (currentResult) {
      const impactFactors = {
        battery: 2.5,
        laptop: 15.8,
        smartphone: 8.2,
        mobile: 8.2,
        charger: 1.8,
        other: 5.0
      };

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        deviceClass: currentResult.class,
        confidence: currentResult.confidence,
        co2Saved: impactFactors[currentResult.class as keyof typeof impactFactors] || impactFactors.other,
        timestamp: Date.now()
      };

      setHistory(prevHistory => {
        // Remove duplicates and keep only the latest 5
        const filteredHistory = prevHistory.filter(item => item.deviceClass !== newItem.deviceClass);
        const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        
        return newHistory;
      });
    }
  }, [currentResult]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "History cleared",
      description: "Your classification history has been removed.",
    });
  };

  const getConfidenceColor = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    if (percentage >= 85) return 'bg-green-100 text-green-800';
    if (percentage >= 65) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading font-semibold text-lg text-foreground flex items-center">
            <History className="mr-2 h-5 w-5 text-primary" />
            Recent Classifications
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item, index) => (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-3 bg-muted/20 rounded-lg transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="secondary" 
                  className="capitalize font-medium"
                >
                  {item.deviceClass}
                </Badge>
                <Badge 
                  className={getConfidenceColor(item.confidence)}
                >
                  {Math.round(item.confidence * 100)}%
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Leaf className="h-3 w-3 text-green-600" />
                  <span className="font-medium">{item.co2Saved}kg CO₂</span>
                </div>
                <span>•</span>
                <span>{formatTimestamp(item.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
