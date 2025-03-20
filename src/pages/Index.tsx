
import { motion } from "framer-motion";
import { Calendar, Clock, Scissors, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { formatGhanaCedi } from "@/lib/utils";

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-salon-cream">
      <nav className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo className="text-xl md:text-2xl" />
          </Link>
          <div className="space-x-2 md:space-x-4">
            <Link to="/signin">
              <Button variant="outline" className="text-sm md:text-base">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-salon-gold hover:bg-salon-gold/90 text-sm md:text-base">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-12 md:section-padding relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-salon-gold/10 text-salon-gold">
            Premium Salon Experience
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-playfair tracking-tight mb-6">
            Transform Your Look with Expert Care
          </h1>
          <p className="body-text max-w-2xl mx-auto mb-8 text-sm md:text-base">
            Experience the perfect blend of artistry and care. Our expert stylists are ready to help you achieve your dream look.
          </p>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-salon-gold hover:bg-salon-gold/90 text-white px-6 py-5 md:px-8 md:py-6 rounded-full text-base md:text-lg"
          >
            Book Your Appointment
          </Button>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="px-4 py-12 md:section-padding bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center mb-8 md:mb-12 font-playfair">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 md:p-6 rounded-2xl"
              >
                <h3 className="text-xl md:text-2xl font-medium mb-3 font-playfair">{service.title}</h3>
                <p className="body-text mb-4 text-sm md:text-base">{service.description}</p>
                <p className="text-salon-gold font-semibold">{service.priceDisplay}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-12 md:section-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center mb-8 md:mb-12 font-playfair">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-salon-gold/10 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="font-playfair font-semibold mb-2 text-sm md:text-base">{step.title}</h3>
                <p className="text-xs md:text-sm text-salon-dark/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-auto max-h-[95vh] md:max-h-[85vh]">
          <DialogDescription className="sr-only">Book Appointment</DialogDescription>
          <BookingForm onComplete={() => setIsBookingOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const services = [
  {
    title: "Haircut & Styling",
    description: "Professional cut and style tailored to your preferences",
    price: 50,
    priceDisplay: "From " + formatGhanaCedi(50)
  },
  {
    title: "Color & Highlights",
    description: "Full color or partial highlights with premium products",
    price: 120,
    priceDisplay: "From " + formatGhanaCedi(120)
  },
  {
    title: "Treatment & Care",
    description: "Deep conditioning and specialized hair treatments",
    price: 80,
    priceDisplay: "From " + formatGhanaCedi(80)
  }
];

const steps = [
  {
    icon: <Scissors className="w-5 h-5 md:w-6 md:h-6 text-salon-gold" />,
    title: "Choose Service",
    description: "Select from our range of premium services"
  },
  {
    icon: <Calendar className="w-5 h-5 md:w-6 md:h-6 text-salon-gold" />,
    title: "Pick Date",
    description: "Choose your preferred appointment date"
  },
  {
    icon: <Clock className="w-5 h-5 md:w-6 md:h-6 text-salon-gold" />,
    title: "Select Time",
    description: "Pick a time that works best for you"
  },
  {
    icon: <User className="w-5 h-5 md:w-6 md:h-6 text-salon-gold" />,
    title: "Confirm Booking",
    description: "Complete your booking in seconds"
  }
];

export default Index;
