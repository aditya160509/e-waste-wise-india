import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  Smartphone, 
  Laptop, 
  Skull, 
  Recycle, 
  AlertTriangle, 
  Gem, 
  Droplets, 
  Lightbulb,
  BookOpen,
  ArrowRight,
  Flag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FlagCorrectForm from '@/components/FlagCorrectForm';
import factsData from '@/data/facts_long.json';

const iconMap = {
  Globe,
  Zap,
  Smartphone,
  Laptop,
  Skull,
  Recycle,
  AlertTriangle,
  Gem,
  Droplets,
  Lightbulb
};

// Group facts into themed sections - distribute all 10 facts evenly
const factsSections = [
  {
    title: "Global Perspective",
    facts: factsData.filter(f => [1, 8].includes(f.id)), // Global crisis, Critical materials
    bgClass: "bg-background"
  },
  {
    title: "India Focus", 
    facts: factsData.filter(f => [7, 9].includes(f.id)), // Informal sector, Water contamination
    bgClass: "bg-secondary/20"
  },
  {
    title: "Health & Environmental Hazards",
    facts: factsData.filter(f => [2, 5].includes(f.id)), // Battery dangers, Toxic metals
    bgClass: "bg-background"
  },
  {
    title: "Recycling Benefits",
    facts: factsData.filter(f => [3, 4, 6].includes(f.id)), // Mobile impact, Laptop lifecycle, Circular economy
    bgClass: "bg-secondary/20"
  },
  {
    title: "What You Can Do",
    facts: factsData.filter(f => [10].includes(f.id)), // Future solutions
    bgClass: "bg-background"
  }
];

const FlagCorrectFormSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <motion.section 
      className="py-16 bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 1.0 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-4">
            Help Us Improve
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Found incorrect information or have suggestions? Your feedback helps us provide better e-waste education and classification.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => setIsFormOpen(true)}
              variant="outline"
              size="lg"
              className="glass-button border-primary/20 hover:border-primary/40"
            >
              <Flag className="mr-2 h-5 w-5" />
              Submit Feedback
            </Button>
          </motion.div>
        </motion.div>

        {/* Flag & Correct Form */}
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            <FlagCorrectForm 
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              title="Submit Feedback & Corrections"
            />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

const Education = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-8 pb-16">
        {/* Header */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-primary mr-3" />
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
              E-Waste Education
            </h1>
          </div>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about the environmental impact of electronic waste and discover 
            how proper recycling can help protect our planet and communities.
          </p>
        </motion.div>

        {/* Fact Sections */}
        {factsSections.map((section, sectionIndex) => (
          <motion.section
            key={section.title}
            className={`py-16 ${section.bgClass}`}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <motion.h2 
                className="font-heading font-bold text-3xl text-foreground text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {section.title}
              </motion.h2>

              {/* Facts Grid */}
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {section.facts.map((fact) => {
                  const IconComponent = iconMap[fact.icon as keyof typeof iconMap];
                  
                  return (
                    <motion.div
                      key={fact.id}
                      variants={cardVariants}
                      className="glass-card rounded-2xl p-6 group cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Icon & Title */}
                      <div className="flex items-start mb-4">
                        <div className="bg-gradient-primary p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-foreground leading-tight">
                          {fact.title}
                        </h3>
                      </div>
                      
                      {/* Description */}
                      <p className="font-body text-muted-foreground leading-relaxed">
                        {fact.description}
                      </p>

                      {/* Bottom Accent */}
                      <div className="mt-6 h-1 bg-gradient-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.section>
        ))}

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="font-body text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Now that you understand the impact, let's help you classify and properly dispose of your electronic devices.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg"
                  onClick={() => window.location.href = '/demo'}
                >
                  <Zap className="mr-2 h-6 w-6" />
                  Try Device Classification
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <FlagCorrectFormSection />
      </main>

      <Footer />
    </div>
  );
};

export default Education;