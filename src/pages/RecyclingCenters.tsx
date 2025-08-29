import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import centersData from '@/data/recycling_centers_in.json';

const RecyclingCenters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(centersData.map(center => center.city)));
    return uniqueCities.sort();
  }, []);

  const deviceTypes = ['battery', 'laptop', 'mobile', 'charger', 'printer', 'monitor', 'tv', 'refrigerator', 'other'];

  const filteredCenters = useMemo(() => {
    return centersData.filter(center => {
      const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           center.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || center.city === selectedCity;
      const matchesType = selectedType === 'all' || center.types.includes(selectedType);
      
      return matchesSearch && matchesCity && matchesType;
    });
  }, [searchTerm, selectedCity, selectedType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-background">
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
            <MapPin className="h-8 w-8 text-primary mr-3" />
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
              Recycling Centers
            </h1>
          </div>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Find verified e-waste recycling centers across India. Choose from our 
            curated list of authorized facilities for safe and responsible disposal.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-primary mr-2" />
              <h2 className="font-heading font-semibold text-lg text-foreground">
                Filter Centers
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-panel border-0"
                />
              </div>

              {/* City Filter */}
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="glass-panel border-0">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Device Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="glass-panel border-0">
                  <SelectValue placeholder="Device Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  {deviceTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredCenters.length} of {centersData.length} centers
            </div>
          </div>
        </motion.div>

        {/* Centers List */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredCenters.map((center) => (
              <motion.div
                key={center.id}
                variants={cardVariants}
                className="glass-card p-6 hover-lift hover-glow group"
                whileHover={{ scale: 1.01 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-heading font-semibold text-lg text-foreground mr-2">
                        {center.name}
                      </h3>
                      {center.verified ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                    </div>
                    <p className="font-body text-muted-foreground text-sm">
                      {center.city}, {center.state}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start mb-4">
                  <MapPin className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="font-body text-sm text-foreground">
                    {center.address}
                  </p>
                </div>

                {/* Phone */}
                {center.phone && (
                  <div className="flex items-center mb-4">
                    <Phone className="h-4 w-4 text-primary mr-2" />
                    <a 
                      href={`tel:${center.phone}`}
                      className="font-body text-sm text-primary hover:underline"
                    >
                      {center.phone}
                    </a>
                  </div>
                )}

                {/* Device Types */}
                <div className="mb-4">
                  <p className="font-body text-xs text-muted-foreground mb-2">
                    Accepts:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {center.types.map(type => (
                      <Badge 
                        key={type} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(center.maps, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on Map
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredCenters.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card p-8 max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-medium text-lg text-foreground mb-2">
                  No Centers Found
                </h3>
                <p className="font-body text-muted-foreground text-sm">
                  Try adjusting your search filters to find recycling centers in your area.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default RecyclingCenters;