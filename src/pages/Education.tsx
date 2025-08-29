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
  BookOpen 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

const Education = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
      {/* SEO Meta Tags handled in index.html */}
      <Navbar />
      
      <main className="pt-8 pb-16">
        {/* Header */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center mb-4">
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

        {/* Educational Cards Grid */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factsData.map((fact, index) => {
              const IconComponent = iconMap[fact.icon as keyof typeof iconMap];
              
              return (
                  <motion.div
                    key={fact.id}
                    variants={cardVariants}
                    className="glass-card p-6 hover-lift hover-glow group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                  {/* Icon */}
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-primary p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      {fact.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="font-body text-muted-foreground leading-relaxed text-sm">
                    {fact.description}
                  </p>

                  {/* Bottom Border Accent */}
                  <div className="mt-4 h-1 bg-gradient-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="glass-card p-8">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="font-body text-muted-foreground mb-6 text-lg">
              Use our AI-powered classifier to properly identify and recycle your electronic devices.
            </p>
            <motion.button
              className="bg-gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/#demo'}
            >
              Try the Classifier
            </motion.button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Education;