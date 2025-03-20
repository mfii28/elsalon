
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import dataService from "@/lib/dataService";
import { ServiceSelection } from "./ServiceSelection";
import { DateTimeSelection } from "./DateTimeSelection";
import { ClientInfoForm } from "./ClientInfoForm";
import { BookingFormProps, FormState } from "./types";

const BookingForm = ({ onComplete }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  // Initialize form state
  const [formState, setFormState] = useState<FormState>({
    service: "",
    subservice: "",
    stylist: "",
    selectedExtras: [],
    date: new Date(),
    selectedTime: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
  });

  // Update form state handler
  const updateFormState = (updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (step === 3) {
      handleSubmit();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    setStep(prev => prev - 1);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    // This would use the same calculation logic as in ServiceSelection
    // For now, we'll use a placeholder value
    return 0;
  };

  // Form submission handler
  const handleSubmit = () => {
    const { service, subservice, stylist, date, selectedTime, clientName } = formState;
    
    if (!date || !selectedTime || !stylist || !subservice || !clientName) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const formattedDate = date.toISOString().split('T')[0];
      
      // Find the selected service details
      const serviceType = service as keyof typeof services;
      const services = {
        haircut: {
          name: "Haircut & Styling",
          subservices: [
            { id: "mens-cut", name: "Men's Haircut", price: 50 },
            { id: "ladies-cut", name: "Ladies' Haircut", price: 80 },
            { id: "kids-cut", name: "Kids' Haircut", price: 40 },
            { id: "styling", name: "Styling Only", price: 60 },
          ],
        },
        color: {
          name: "Color & Highlights",
          subservices: [
            { id: "full-color", name: "Full Color", price: 200 },
            { id: "highlights", name: "Highlights", price: 250 },
            { id: "balayage", name: "Balayage", price: 300 },
            { id: "root-touch", name: "Root Touch-up", price: 150 },
          ],
        },
        treatment: {
          name: "Treatment & Care",
          subservices: [
            { id: "deep-cond", name: "Deep Conditioning", price: 100 },
            { id: "keratin", name: "Keratin Treatment", price: 400 },
            { id: "protein", name: "Protein Treatment", price: 150 },
            { id: "scalp", name: "Scalp Treatment", price: 120 },
          ],
        },
      };
      
      const selectedService = services[serviceType]?.subservices.find(s => s.id === subservice);
      
      if (!selectedService) {
        throw new Error("Service not found");
      }
      
      // Calculate total price including extras
      const extras = [
        { id: "head-massage", name: "Head Massage", price: 30 },
        { id: "hair-spa", name: "Hair Spa", price: 50 },
        { id: "scalp-treatment", name: "Scalp Treatment", price: 40 },
        { id: "hair-mask", name: "Hair Mask", price: 35 },
      ];
      
      const totalPrice = selectedService.price + 
        extras.filter(extra => formState.selectedExtras.includes(extra.id))
          .reduce((sum, extra) => sum + extra.price, 0);
      
      dataService.bookAppointment({
        client: clientName,
        service: selectedService.name,
        date: formattedDate,
        time: selectedTime,
        price: totalPrice,
        stylistId: stylist,
        status: "Pending"
      });
      
      toast({
        title: "Booking Confirmed!",
        description: "We'll send you a confirmation email shortly.",
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error while booking your appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-y-auto">
      <div className="text-center mb-4 md:mb-6">
        <Logo className="text-2xl md:text-3xl mx-auto mb-2" />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold font-playfair text-center mb-6 md:mb-8">Book Your Appointment</h2>
      
      {step === 1 && (
        <ServiceSelection 
          formState={formState}
          updateFormState={updateFormState}
          goToNextStep={goToNextStep}
        />
      )}

      {step === 2 && (
        <DateTimeSelection 
          formState={formState}
          updateFormState={updateFormState}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
        />
      )}

      {step === 3 && (
        <ClientInfoForm 
          formState={formState}
          updateFormState={updateFormState}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
        />
      )}
    </div>
  );
};

export default BookingForm;
