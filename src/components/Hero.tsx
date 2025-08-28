import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
              AI-Powered{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                E-Waste Classifier
              </span>
            </h1>
            
            <p className="font-body text-xl text-muted-foreground mb-8 leading-relaxed">
              Upload one photo — know how to recycle it responsibly in India. 
              Get instant AI classification with actionable disposal guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium shadow-soft-md"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Try Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Download className="mr-2 h-5 w-5" />
                Read Report
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-soft-lg">
              <img 
                src={heroImage}
                alt="Electronic devices including smartphones, laptops, and circuit boards arranged for e-waste recycling"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-soft-md border border-border">
              <div className="text-center">
                <div className="font-heading font-bold text-2xl text-primary">1000+</div>
                <div className="font-body text-sm text-muted-foreground">Images Trained</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card rounded-xl p-4 shadow-soft-md border border-border">
              <div className="text-center">
                <div className="font-heading font-bold text-2xl text-primary">95%</div>
                <div className="font-body text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;