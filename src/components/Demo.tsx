import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import ResultCard from './ResultCard';
import EducationalDrawer from './EducationalDrawer';
import SessionHistory from './SessionHistory';
import ImpactCard from './ImpactCard';
import confetti from 'canvas-confetti';
import impactFactors from '@/data/impact_factors.json';
import recyclingCenters from '@/data/recycling_centers_in.json';

interface ClassificationResult {
  class: string;
  confidence: number;
  rationale: string;
  advice: string;
  co2_saved_kg: number;
  water_saved_liters: number;
  metals_recovered_g: number;
  hazards_avoided: string;
  suggested_centres: Array<{
    id: number;
    name: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    verified: boolean;
    types: string[];
    maps: string;
  }>;
  source: 'dropdown';
}

const Demo = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Get all categories dynamically from impact_factors.json
  const deviceCategories = Object.keys(impactFactors);

  // Load drawer state from sessionStorage
  useEffect(() => {
    const savedDrawerState = sessionStorage.getItem('educational_drawer_open');
    if (savedDrawerState === 'true') {
      setIsDrawerOpen(true);
    }
  }, []);

  // Save drawer state to sessionStorage
  const handleDrawerChange = (open: boolean) => {
    setIsDrawerOpen(open);
    sessionStorage.setItem('educational_drawer_open', open.toString());
  };

  // Trigger confetti for battery classification
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const processClassification = async (deviceType: string) => {
    setIsLoading(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get impact data from impact_factors.json
      const impactKey = deviceType === 'smartphone' ? 'mobile' : deviceType;
      const impactData = impactFactors[impactKey as keyof typeof impactFactors] || impactFactors.other;
      
      // Filter recycling centers that accept this device type - show ALL matches
      const matchingCenters = recyclingCenters.filter(center => 
        center.types.includes(deviceType) || center.types.includes('other')
      );
      
      // Create result with ALL fields from impact_factors.json
      const mockResult: ClassificationResult = {
        class: deviceType,
        confidence: 1.0,
        rationale: `Selected category: ${deviceType}`,
        advice: impactData.note,
        co2_saved_kg: impactData.co2_saved_kg,
        water_saved_liters: impactData.water_saved_liters,
        metals_recovered_g: impactData.metals_recovered_g,
        hazards_avoided: impactData.hazards_avoided,
        suggested_centres: matchingCenters,
        source: 'dropdown'
      };
      
      setResult(mockResult);
      
      // Trigger confetti for battery classification
      if (deviceType === 'battery') {
        setTimeout(() => triggerConfetti(), 500);
      }
      
      toast({
        title: "Processing complete!",
        description: `Selected: ${deviceType} (100% confidence)`,
      });
      
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = () => {
    if (selectedCategory) {
      processClassification(selectedCategory);
    }
  };

  return (
    <section id="demo" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            Try the Demo
          </h2>
          <p className="font-body text-xl text-muted-foreground">
            Select your device type or upload a photo for AI classification
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="glass-card rounded-2xl shadow-soft-lg border-border">
            <CardContent className="p-8">
              {!result ? (
                <div className="space-y-8">
                  {/* Device Category Dropdown */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-center mb-4">
                      <Zap className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        Select Device Type
                      </h3>
                    </div>
                    
                    <div className="glass-panel p-4 rounded-xl">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="glass-panel border-0 h-12">
                          <SelectValue placeholder="Select your device type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedCategory && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <Button 
                            onClick={handleCategorySelect}
                            disabled={isLoading}
                            className="bg-gradient-primary hover:opacity-90 text-primary-foreground w-full"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Zap className="mr-2 h-5 w-5" />
                                Get Impact Data
                              </>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                // Single clean results block - no duplicates
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Source Badge */}
                  <div className="flex justify-center">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      From Dropdown Selection
                    </Badge>
                  </div>
                  
                  {/* Single ResultCard displaying classification results */}
                  <ResultCard 
                    result={result}
                    imageUrl={null}
                    onNewClassification={() => {
                      setResult(null);
                      setSelectedCategory('');
                    }}
                  />
                  
                  {/* Single ImpactCard displaying environmental impact */}
                  <ImpactCard 
                    deviceClass={result.class}
                  />
                  
                  {/* Session History - prevents duplicates internally */}
                  <SessionHistory currentResult={result} />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Educational Drawer */}
        <EducationalDrawer 
          isOpen={isDrawerOpen}
          onOpenChange={handleDrawerChange}
        />
      </div>
    </section>
  );
};

export default Demo;