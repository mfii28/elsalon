import { useState, useEffect } from "react";
import { format, addDays, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Check, ChevronRight, Clock } from "lucide-react";
import dataService, { Service, Stylist } from "@/lib/dataService";
import { formatGhanaCedi } from "@/lib/utils";
import Logo from "@/components/Logo";

const BookingPage = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStylist, setSelectedStylist] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load services and stylists on mount
  useEffect(() => {
    setServices(dataService.getServices());
    setStylists(dataService.getStylists());
  }, []);

  // Function to calculate max date (30 days from today)
  const getMaxDate = () => {
    return addDays(new Date(), 30);
  };

  // Update available stylists when service changes
  const availableStylists = selectedService
    ? stylists
    : [];

  // Update available times when stylist and date change
  useEffect(() => {
    if (selectedStylist && selectedDate) {
      const date = format(selectedDate, 'yyyy-MM-dd');
      const stylist = stylists.find(s => s.id === selectedStylist);
      
      if (stylist) {
        const daySchedule = stylist.schedule.find(s => s.date === date);
        
        if (daySchedule) {
          const availableSlots = daySchedule.slots
            .filter(slot => !slot.isBooked)
            .map(slot => slot.time);
          
          setAvailableTimes(availableSlots);
        } else {
          setAvailableTimes([]);
        }
      }
    } else {
      setAvailableTimes([]);
    }
  }, [selectedStylist, selectedDate, stylists]);

  // Handle booking submission
  const handleBooking = () => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime || !clientName) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before booking.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const service = services.find(s => s.id.toString() === selectedService);
      const stylist = stylists.find(s => s.id === selectedStylist);
      
      if (!service || !stylist) {
        throw new Error("Invalid service or stylist selected");
      }
      
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Check availability one more time
      const isAvailable = dataService.checkStylistAvailability(
        selectedStylist,
        formattedDate,
        selectedTime
      );
      
      if (!isAvailable) {
        throw new Error("The selected time slot is no longer available");
      }
      
      // Book the appointment
      const newAppointment = dataService.bookAppointment({
        client: clientName,
        service: service.name,
        date: formattedDate,
        time: selectedTime,
        price: service.price,
        stylistId: selectedStylist,
        status: "Pending"
      });
      
      toast({
        title: "Booking Successful!",
        description: `Your appointment with ${stylist.name} on ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime} has been booked.`,
      });
      
      // Reset form
      setSelectedService("");
      setSelectedStylist("");
      setSelectedTime("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setSelectedDate(new Date());
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-salon-cream to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Logo className="text-4xl mx-auto mb-4" />
          <h1 className="heading-lg text-salon-dark mb-4">Book Your Appointment</h1>
          <p className="text-salon-dark/70 max-w-2xl mx-auto">
            Select your preferred service, stylist, date and time to schedule your next salon visit.
            Our automated system will ensure your booking is confirmed instantly.
          </p>
        </div>
        
        <div className="glass-card p-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="service" className="text-salon-dark mb-2 block">
                  Select Service
                </Label>
                <Select 
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger id="service" className="w-full">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        <div className="flex justify-between w-full">
                          <span>{service.name}</span>
                          <span className="text-salon-dark/70">
                            {formatGhanaCedi(service.price)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="stylist" className="text-salon-dark mb-2 block">
                  Select Stylist
                </Label>
                <Select 
                  value={selectedStylist}
                  onValueChange={setSelectedStylist}
                  disabled={!selectedService}
                >
                  <SelectTrigger id="stylist" className="w-full">
                    <SelectValue placeholder={
                      selectedService 
                        ? "Choose a stylist" 
                        : "Select a service first"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStylists.map(stylist => (
                      <SelectItem key={stylist.id} value={stylist.id}>
                        <div className="flex justify-between w-full">
                          <span>{stylist.name}</span>
                          <span className="text-salon-dark/70">{stylist.specialty}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date" className="text-salon-dark mb-2 block">
                  Select Date
                </Label>
                <div className="border rounded-md p-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today || date > getMaxDate();
                    }}
                    className="mx-auto pointer-events-auto"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="time" className="text-salon-dark mb-2 block">
                  Select Time
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTimes.length > 0 ? (
                    availableTimes.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`justify-start ${
                          selectedTime === time ? "bg-salon-gold hover:bg-salon-gold/90" : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {time}
                        {selectedTime === time && <Check className="w-4 h-4 ml-auto" />}
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-3 py-3 text-salon-dark/70 text-center">
                      {selectedStylist && selectedDate
                        ? "No available time slots for this date"
                        : "Select a stylist and date to see available times"}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="text-salon-dark mb-2 block">
                    Your Name
                  </Label>
                  <Input 
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientEmail" className="text-salon-dark mb-2 block">
                    Email Address
                  </Label>
                  <Input 
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientPhone" className="text-salon-dark mb-2 block">
                    Phone Number
                  </Label>
                  <Input 
                    id="clientPhone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-salon-dark/10">
            <Button 
              onClick={handleBooking}
              disabled={isLoading || !selectedService || !selectedStylist || !selectedDate || !selectedTime || !clientName}
              className="w-full bg-salon-gold hover:bg-salon-gold/90 py-6 text-lg"
            >
              {isLoading ? "Processing..." : "Book Appointment"}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
