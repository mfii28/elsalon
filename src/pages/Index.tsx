import { motion } from "framer-motion";
import { Calendar, Clock, Scissors, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-salon-cream">
      <nav className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-playfair font-bold">
            Salon
          </Link>
          <div className="space-x-4">
            <Link to="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-salon-gold hover:bg-salon-gold/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-salon-gold/10 text-salon-gold">
            Premium Salon Experience
          </span>
          <h1 className="heading-xl mb-6">
            Transform Your Look with Expert Care
          </h1>
          <p className="body-text max-w-2xl mx-auto mb-8">
            Experience the perfect blend of artistry and care. Our expert stylists are ready to help you achieve your dream look.
          </p>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-salon-gold hover:bg-salon-gold/90 text-white px-8 py-6 rounded-full text-lg"
          >
            Book Your Appointment
          </Button>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-lg text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <h3 className="heading-md mb-3">{service.title}</h3>
                <p className="body-text mb-4">{service.description}</p>
                <p className="text-salon-gold font-semibold">{service.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-lg text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-salon-gold/10 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="font-playfair font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-salon-dark/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
    price: "From $50"
  },
  {
    title: "Color & Highlights",
    description: "Full color or partial highlights with premium products",
    price: "From $120"
  },
  {
    title: "Treatment & Care",
    description: "Deep conditioning and specialized hair treatments",
    price: "From $80"
  }
];

const steps = [
  {
    icon: <Scissors className="w-6 h-6 text-salon-gold" />,
    title: "Choose Service",
    description: "Select from our range of premium services"
  },
  {
    icon: <Calendar className="w-6 h-6 text-salon-gold" />,
    title: "Pick Date",
    description: "Choose your preferred appointment date"
  },
  {
    icon: <Clock className="w-6 h-6 text-salon-gold" />,
    title: "Select Time",
    description: "Pick a time that works best for you"
  },
  {
    icon: <User className="w-6 h-6 text-salon-gold" />,
    title: "Confirm Booking",
    description: "Complete your booking in seconds"
  }
];

export default Index;
