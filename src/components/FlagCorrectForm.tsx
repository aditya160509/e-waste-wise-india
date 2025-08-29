import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Upload, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface FlagCorrectFormProps {
  isOpen: boolean;
  onClose: () => void;
  originalClass: string;
  originalConfidence: number;
}

const deviceCategories = [
  'Laptop',
  'Mobile',
  'Battery', 
  'Charger',
  'Printer',
  'Monitor',
  'TV',
  'Refrigerator',
  'Other Small Electronics'
];

const FlagCorrectForm = ({ isOpen, onClose, originalClass, originalConfidence }: FlagCorrectFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reason, setReason] = useState('');
  const [correctedImage, setCorrectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCorrectedImage(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !reason.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Mock API submission - replace with actual webhook/API endpoint
    const submissionData = {
      originalClass: originalClass,
      originalConfidence: originalConfidence,
      correctedClass: selectedCategory,
      reason: reason,
      timestamp: new Date().toISOString(),
      hasImage: !!correctedImage
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, send to Google Sheets/Airtable webhook:
      // const response = await fetch('/api/submit-correction', {
      //   method: 'POST',
      //   body: formData
      // });

      console.log('Submission data:', submissionData);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your correction helps us improve our AI model.",
      });

      // Analytics tracking placeholder
      if (window.gtag) {
        window.gtag('event', 'flag_submission', {
          original_class: originalClass,
          corrected_class: selectedCategory,
          confidence: originalConfidence
        });
      }

      // Reset form
      setSelectedCategory('');
      setReason('');
      setCorrectedImage(null);
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="glass-card border-primary/20 bg-primary/5 dark:bg-primary/10">
            <CardHeader>
              <CardTitle className="font-heading font-medium text-foreground flex items-center justify-between">
                <div className="flex items-center">
                  <Flag className="mr-2 h-5 w-5 text-primary" />
                  Flag & Correct Classification
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="glass-button h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Classification Info */}
              <div className="glass-panel p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Current classification: <span className="font-medium text-foreground">{originalClass}</span> 
                  ({Math.round(originalConfidence * 100)}% confidence)
                </p>
              </div>

              {/* Correct Category Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Correct device category *
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="glass-panel border-0">
                    <SelectValue placeholder="Select the correct category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceCategories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason Text Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Why is this incorrect? *
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe what's wrong with this classification and any additional context..."
                  className="glass-panel border-0 resize-none"
                  rows={3}
                />
              </div>

              {/* Optional Corrected Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Upload a clearer image (optional)
                </label>
                <div className="glass-panel p-3 rounded-lg">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border-0 bg-transparent"
                  />
                  {correctedImage && (
                    <p className="text-xs text-primary mt-1">
                      ✓ {correctedImage.name} selected
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedCategory || !reason.trim()}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Correction
                    </>
                  )}
                </Button>
                <Button 
                  onClick={onClose}
                  variant="outline"
                  className="glass-button"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlagCorrectForm;