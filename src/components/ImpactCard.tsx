import { useState, useEffect } from 'react';
import { Leaf, Droplets, Coins, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import impactFactors from '@/data/impact_factors.json';

interface ImpactCardProps {
  deviceClass: string;
}

const ImpactCard = ({ deviceClass }: ImpactCardProps) => {
  const [animatedValues, setAnimatedValues] = useState({
    co2: 0,
    water: 0,
    metals: 0
  });

  const impactData = impactFactors[deviceClass as keyof typeof impactFactors] || impactFactors.other;
  
  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedValues({
        co2: Math.round(impactData.co2_saved_kg * easeOutQuart * 10) / 10,
        water: Math.round(impactData.water_saved_liters * easeOutQuart),
        metals: Math.round(impactData.metals_recovered_g * easeOutQuart)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [impactData]);

  const impactMetrics = [
    {
      icon: Leaf,
      label: 'CO₂ Saved',
      value: animatedValues.co2,
      unit: 'kg',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Droplets,
      label: 'Water Saved',
      value: animatedValues.water,
      unit: 'L',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Coins,
      label: 'Metals Recovered',
      value: animatedValues.metals,
      unit: 'g',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <Card className="bg-gradient-card border-border shadow-soft-md">
      <CardHeader>
        <CardTitle className="font-heading font-semibold text-lg text-foreground flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          Environmental Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {impactMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div 
                key={metric.label}
                className={`${metric.bgColor} rounded-lg p-4 text-center animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center mb-2">
                  <IconComponent className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className={`text-2xl font-bold ${metric.color} font-mono`}>
                  {metric.value.toLocaleString()}
                  <span className="text-sm ml-1">{metric.unit}</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hazards Avoided */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-foreground mb-1">Hazards Avoided</div>
              <div className="text-sm text-muted-foreground">
                {impactData.hazards_avoided}
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Note */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-foreground leading-relaxed">
            <strong>Impact Note:</strong> {impactData.note}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactCard;