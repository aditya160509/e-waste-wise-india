import { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import ResultCard from './ResultCard';

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
}

const Demo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const classifyImage = async (file: File) => {
    // Mock API call - replace with actual Hugging Face endpoint
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on file name or random selection
      const mockResults = [
        {
          class: 'smartphone',
          confidence: 0.92,
          rationale: 'Detected smartphone features including screen, camera, and typical form factor.',
          advice: 'Remove battery if possible. Find authorized e-waste recycler. Data wiping recommended.',
          suggested_centres: [
            { city: 'Mumbai', name: 'Mumbai E-waste Recycler', maps: 'https://maps.google.com/?q=Mumbai+e-waste+recycler' },
            { city: 'Delhi', name: 'Delhi Electronics Recycling', maps: 'https://maps.google.com/?q=Delhi+electronics+recycling' }
          ]
        },
        {
          class: 'laptop',
          confidence: 0.87,
          rationale: 'Identified laptop characteristics including keyboard, screen, and hinge mechanism.',
          advice: 'Remove hard drive for data security. Contact manufacturer take-back program or authorized recycler.',
          suggested_centres: [
            { city: 'Bengaluru', name: 'Bengaluru Tech Recycling', maps: 'https://maps.google.com/?q=Bengaluru+tech+recycling' },
            { city: 'Chennai', name: 'Chennai E-waste Solutions', maps: 'https://maps.google.com/?q=Chennai+e-waste+solutions' }
          ]
        },
        {
          class: 'battery',
          confidence: 0.95,
          rationale: 'Detected battery features and chemical indicators.',
          advice: 'HAZARDOUS: Do not dispose in regular trash. Take to battery collection point or authorized e-waste center immediately.',
          suggested_centres: [
            { city: 'Kolkata', name: 'Kolkata Battery Recycling', maps: 'https://maps.google.com/?q=Kolkata+battery+recycling' }
          ]
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      
      toast({
        title: "Classification complete!",
        description: `Detected: ${randomResult.class} (${Math.round(randomResult.confidence * 100)}% confidence)`,
      });
      
    } catch (error) {
      toast({
        title: "Classification failed",
        description: "Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassify = () => {
    if (selectedFile) {
      classifyImage(selectedFile);
    }
  };

  return (
    <section id="demo" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            Try the Demo
          </h2>
          <p className="font-body text-xl text-muted-foreground">
            Upload a photo of your electronic device to see AI classification in action
          </p>
        </div>

        <Card className="bg-gradient-card shadow-soft-lg border-border">
          <CardContent className="p-8">
            {!result ? (
              <div className="space-y-6">
                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors duration-300 cursor-pointer"
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

                {/* Action Buttons */}
                {selectedFile && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    >
                      Clear Image
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <ResultCard 
                result={result}
                imageUrl={previewUrl}
                onNewClassification={() => {
                  setResult(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Demo;