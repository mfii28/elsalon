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
import Logo from "@/components/Logo";
import dataService from "@/lib/dataService";
import { addDays } from "date-fns";

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
  { id: "sarah", name: "Kofi Mensah", specialty: "Color Specialist" },
  { id: "michael", name: "Ama Darko", specialty: "Cutting Expert" },
  { id: "emma", name: "Kwame Owusu", specialty: "Treatment Specialist" },
  { id: "john", name: "Adwoa Boateng", specialty: "Styling Expert" },
];

const extras = [
  { id: "head-massage", name: "Head Massage", price: 30 },
  { id: "hair-spa", name: "Hair Spa", price: 50 },
  { id: "scalp-treatment", name: "Scalp Treatment", price: 40 },
  { id: "hair-mask", name: "Hair Mask", price: 35 },
];

interface Availability {
  date: string;
  slots: {
    time: string;
    isBooked: boolean;
  }[];
}

interface Stylist {
  id: string;
  name: string;
  specialty: string;
  schedule: Availability[];
}

const BookingForm = ({ onComplete }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [service, setService] = useState("");
  const [subservice, setSubservice] = useState("");
  const [stylist, setStylist] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const { toast } = useToast();

  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [availableStylists] = useState<Stylist[]>([
    {
      id: "sarah",
      name: "Kofi Mensah",
      specialty: "Color Specialist",
      schedule: [
        {
          date: "2024-03-15",
          slots: [
            { time: "09:00 AM", isBooked: false },
            { time: "10:00 AM", isBooked: true },
            { time: "11:00 AM", isBooked: false },
            { time: "12:00 PM", isBooked: false },
          ]
        },
        {
          date: "2024-03-16",
          slots: [
            { time: "09:00 AM", isBooked: false },
            { time: "10:00 AM", isBooked: false },
            { time: "11:00 AM", isBooked: false },
            { time: "12:00 PM", isBooked: false },
          ]
        }
      ]
    },
  ]);

  const selectedService = service ? services[service as keyof typeof services] : null;
  const selectedSubservice = selectedService?.subservices.find(s => s.id === subservice);
  
  const totalPrice = (selectedSubservice?.price || 0) + 
    extras.filter(extra => selectedExtras.includes(extra.id))
      .reduce((sum, extra) => sum + extra.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime || !stylist || !subservice || !clientName) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedServiceObj = selectedService?.subservices.find(s => s.id === subservice);
    const selectedStylistObj = stylists.find(s => s.id === stylist);

    if (!selectedServiceObj || !selectedStylistObj) {
      toast({
        title: "Error",
        description: "Invalid service or stylist selection.",
        variant: "destructive"
      });
      return;
    }

    try {
      const formattedDate = date.toISOString().split('T')[0];
      
      dataService.bookAppointment({
        client: clientName,
        service: selectedServiceObj.name,
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

  const getAvailableStylists = (selectedDate: Date) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return availableStylists.filter(stylist => 
      stylist.schedule.some(day => 
        day.date === dateStr && day.slots.some(slot => !slot.isBooked)
      )
    );
  };

  const getAvailableSlots = (stylistId: string, selectedDate: Date) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const stylist = availableStylists.find(s => s.id === stylistId);
    const daySchedule = stylist?.schedule.find(day => day.date === dateStr);
    return daySchedule?.slots.filter(slot => !slot.isBooked) || [];
  };

  const getMaxDate = () => {
    return addDays(new Date(), 30);
  };

  return (
    <div className="p-4 md:p-6 overflow-y-auto">
      <div className="text-center mb-4 md:mb-6">
        <Logo className="text-2xl md:text-3xl mx-auto mb-2" />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold font-playfair text-center mb-6 md:mb-8">Book Your Appointment</h2>
      
      {step === 1 && (
        <div className="space-y-4 md:space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label>Select Service</Label>
            <Select value={service} onValueChange={(value) => {
              setService(value);
              setSubservice("");
            }}>
              <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            disabled={!stylist}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 md:space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <div className="border rounded-md p-2 md:p-3 mx-auto max-w-md">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setSelectedTime("");
                }}
                className="mx-auto rounded-md pointer-events-auto"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || date > getMaxDate();
                }}
                initialFocus
              />
            </div>
          </div>

          {date && (
            <div className="space-y-2">
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {stylist && getAvailableSlots(stylist, date).map((slot, idx) => (
                  <Button
                    key={idx}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(slot.time)}
                    className={selectedTime === slot.time ? "bg-salon-gold hover:bg-salon-gold/90" : ""}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

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
              onClick={() => (date && selectedTime) && setStep(3)}
              disabled={!date || !selectedTime}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input 
              required 
              placeholder="Enter your full name" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              required 
              type="email" 
              placeholder="Enter your email" 
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input 
              required 
              type="tel" 
              placeholder="Enter your phone number" 
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
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
