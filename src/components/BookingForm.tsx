
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface BookingFormProps {
  onComplete: () => void;
}

const BookingForm = ({ onComplete }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [service, setService] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking Confirmed!",
      description: "We'll send you a confirmation email shortly.",
    });
    onComplete();
  };

  return (
    <div className="p-6">
      <h2 className="heading-lg text-center mb-8">Book Your Appointment</h2>
      
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label>Select Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="haircut">Haircut & Styling</SelectItem>
                <SelectItem value="color">Color & Highlights</SelectItem>
                <SelectItem value="treatment">Treatment & Care</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-salon-gold hover:bg-salon-gold/90"
            onClick={() => service && setStep(2)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-salon-gold hover:bg-salon-gold/90"
              onClick={() => date && setStep(3)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input required placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input required type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input required type="tel" placeholder="Enter your phone number" />
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-salon-gold hover:bg-salon-gold/90"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
