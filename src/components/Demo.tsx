import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Loader2, Zap } from 'lucide-react';
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

interface ClassificationResult {
  class: string;
  confidence: number;
  rationale: string;
  advice: string;
  suggested_centres: Array<{
    city: string;
    name: string;
    maps: string;
  }>;
  source: 'dropdown' | 'upload';
}

const Demo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const processClassification = async (deviceType: string, source: 'dropdown' | 'upload' = 'dropdown') => {
    setIsLoading(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, source === 'upload' ? 2000 : 1000));
      
      // Get impact data from impact_factors.json
      const impactKey = deviceType === 'smartphone' ? 'mobile' : deviceType;
      const impactData = impactFactors[impactKey as keyof typeof impactFactors] || impactFactors.other;
      
      // Create result based on source
      const mockResult: ClassificationResult = {
        class: deviceType,
        confidence: source === 'dropdown' ? 1.0 : Math.random() * 0.3 + 0.7,
        rationale: source === 'dropdown' 
          ? `Selected category: ${deviceType}` 
          : `Detected ${deviceType} features from uploaded image.`,
        advice: impactData.note,
        suggested_centres: [
          { city: 'Mumbai', name: 'Mumbai E-waste Recycler', maps: 'https://maps.google.com/?q=Mumbai+e-waste+recycler' },
          { city: 'Delhi', name: 'Delhi Electronics Recycling', maps: 'https://maps.google.com/?q=Delhi+electronics+recycling' }
        ],
        source
      };
      
      setResult(mockResult);
      
      // Trigger confetti for battery classification
      if (deviceType === 'battery') {
        setTimeout(() => triggerConfetti(), 500);
      }
      
      toast({
        title: "Processing complete!",
        description: `${source === 'dropdown' ? 'Selected' : 'Detected'}: ${deviceType} (${Math.round(mockResult.confidence * 100)}% confidence)`,
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

  const classifyImage = async (file: File) => {
    // Mock classification from image - use available categories
    const randomDevice = deviceCategories[Math.floor(Math.random() * deviceCategories.length)];
    await processClassification(randomDevice, 'upload');
  };

  const handleClassify = () => {
    if (selectedFile) {
      classifyImage(selectedFile);
    }
  };

  const handleCategorySelect = () => {
    if (selectedCategory) {
      processClassification(selectedCategory, 'dropdown');
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
                  {/* Primary Option: Device Category Dropdown */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-center mb-4">
                      <Zap className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        Quick Selection (Recommended)
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

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-background px-4 text-muted-foreground">or</span>
                    </div>
                  </div>

                  {/* Secondary Option: Image Upload */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <Camera className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        AI Photo Classification
                      </h3>
                    </div>
                    
                    <div
                      className="glass-panel border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        className="hidden"
                      />
                      
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img 
                            src={previewUrl} 
                            alt="Selected device"
                            className="max-h-64 mx-auto rounded-lg shadow-soft-md"
                          />
                          <p className="font-body text-muted-foreground">
                            {selectedFile?.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="bg-muted/50 rounded-full p-4">
                              <Upload className="h-12 w-12 text-muted-foreground" />
                            </div>
                          </div>
                          <div>
                            <p className="font-body text-lg text-foreground mb-2">
                              Drag and drop your image here
                            </p>
                            <p className="font-body text-muted-foreground">
                              or click to browse files
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upload Action Buttons */}
                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                      >
                        <Button 
                          onClick={handleClassify}
                          disabled={isLoading}
                          className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Classifying...
                            </>
                          ) : (
                            <>
                              <Camera className="mr-2 h-5 w-5" />
                              Classify Image
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                          }}
                          className="glass-button"
                        >
                          Clear Image
                        </Button>
                      </motion.div>
                    )}
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
                    <Badge 
                      className={result.source === 'dropdown' 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-secondary/10 text-secondary border-secondary/20"
                      }
                    >
                      {result.source === 'dropdown' ? 'From Dropdown Selection' : 'From Uploaded Photo'}
                    </Badge>
                  </div>
                  
                  {/* Single ResultCard displaying classification results */}
                  <ResultCard 
                    result={result}
                    imageUrl={previewUrl}
                    onNewClassification={() => {
                      setResult(null);
                      setSelectedFile(null);
                      setPreviewUrl(null);
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