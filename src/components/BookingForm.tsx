
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
import { Checkbox } from "@/components/ui/checkbox";
import { formatGhanaCedi } from "@/lib/utils";

interface BookingFormProps {
  onComplete: () => void;
}

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

const stylists = [
  { id: "sarah", name: "Sarah Johnson", specialty: "Color Specialist" },
  { id: "michael", name: "Michael Brown", specialty: "Cutting Expert" },
  { id: "emma", name: "Emma Wilson", specialty: "Treatment Specialist" },
  { id: "john", name: "John Davis", specialty: "Styling Expert" },
];

const extras = [
  { id: "head-massage", name: "Head Massage", price: 30 },
  { id: "hair-spa", name: "Hair Spa", price: 50 },
  { id: "scalp-treatment", name: "Scalp Treatment", price: 40 },
  { id: "hair-mask", name: "Hair Mask", price: 35 },
];

const BookingForm = ({ onComplete }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [service, setService] = useState("");
  const [subservice, setSubservice] = useState("");
  const [stylist, setStylist] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const { toast } = useToast();

  const selectedService = service ? services[service as keyof typeof services] : null;
  const selectedSubservice = selectedService?.subservices.find(s => s.id === subservice);
  
  const totalPrice = (selectedSubservice?.price || 0) + 
    extras.filter(extra => selectedExtras.includes(extra.id))
      .reduce((sum, extra) => sum + extra.price, 0);

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
            <Select value={service} onValueChange={(value) => {
              setService(value);
              setSubservice("");
            }}>
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

          {service && (
            <div className="space-y-2">
              <Label>Select Specific Service</Label>
              <Select value={subservice} onValueChange={setSubservice}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose specific service" />
                </SelectTrigger>
                <SelectContent>
                  {selectedService?.subservices.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name} - {formatGhanaCedi(sub.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {subservice && (
            <div className="space-y-2">
              <Label>Select Stylist</Label>
              <Select value={stylist} onValueChange={setStylist}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your stylist" />
                </SelectTrigger>
                <SelectContent>
                  {stylists.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} - {s.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {stylist && (
            <div className="space-y-2">
              <Label>Add Extra Services</Label>
              <div className="space-y-2">
                {extras.map((extra) => (
                  <div key={extra.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={extra.id}
                      checked={selectedExtras.includes(extra.id)}
                      onCheckedChange={(checked) => {
                        setSelectedExtras(prev =>
                          checked
                            ? [...prev, extra.id]
                            : prev.filter(id => id !== extra.id)
                        );
                      }}
                    />
                    <label
                      htmlFor={extra.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {extra.name} - {formatGhanaCedi(extra.price)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stylist && (
            <div className="p-4 bg-salon-gold/10 rounded-lg">
              <p className="font-medium mb-2">Total Price:</p>
              <p className="text-2xl font-semibold text-salon-gold">
                {formatGhanaCedi(totalPrice)}
              </p>
            </div>
          )}

          <Button
            className="w-full bg-salon-gold hover:bg-salon-gold/90"
            onClick={() => stylist && setStep(2)}
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
