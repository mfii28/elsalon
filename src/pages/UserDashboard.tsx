
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, History, Ticket, User, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatGhanaCedi } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const UserDashboard = () => {
  const [appointments] = useState([
    {
      id: 1,
      service: "Haircut & Styling",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "Upcoming",
      price: 150,
      ticketNo: "APT001",
      stylist: "Sarah Johnson"
    },
    {
      id: 2,
      service: "Color & Highlights",
      date: "2024-03-20",
      time: "2:00 PM",
      status: "Confirmed",
      price: 300,
      ticketNo: "APT002",
      stylist: "Michael Brown"
    },
  ]);

  const [loyaltyPoints] = useState(250);
  const [totalSpent] = useState(2500);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateTicket = (appointmentId: number) => {
    // Mock ticket generation
    toast({
      title: "Ticket Generated",
      description: "Your appointment ticket has been generated. Check your downloads.",
    });
  };

  const handleReschedule = (appointmentId: number) => {
    toast({
      title: "Reschedule Request Sent",
      description: "We'll contact you shortly to confirm your new appointment time.",
    });
  };

  return (
    <div className="min-h-screen bg-salon-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-lg">My Dashboard</h1>
          <Button
            onClick={() => navigate("/")}
            className="bg-salon-gold hover:bg-salon-gold/90"
          >
            Book New Appointment
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-salon-gold/10 rounded-full">
                <Ticket className="w-6 h-6 text-salon-gold" />
              </div>
              <div>
                <p className="text-sm text-salon-dark/70">Upcoming Appointments</p>
                <p className="text-2xl font-semibold">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-salon-gold/10 rounded-full">
                <Wallet className="w-6 h-6 text-salon-gold" />
              </div>
              <div>
                <p className="text-sm text-salon-dark/70">Total Spent</p>
                <p className="text-2xl font-semibold">{formatGhanaCedi(totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-salon-gold/10 rounded-full">
                <User className="w-6 h-6 text-salon-gold" />
              </div>
              <div>
                <p className="text-sm text-salon-dark/70">Loyalty Points</p>
                <p className="text-2xl font-semibold">{loyaltyPoints} pts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="heading-md mb-6">Upcoming Appointments</h2>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 bg-white/50 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{apt.service}</h3>
                      <div className="flex items-center text-sm text-salon-dark/70 mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        {apt.date} at {apt.time}
                      </div>
                      <div className="text-sm text-salon-dark/70 mt-1">
                        <span className="font-medium">Stylist:</span> {apt.stylist}
                      </div>
                      <div className="text-sm text-salon-dark/70 mt-1">
                        <span className="font-medium">Ticket No:</span> {apt.ticketNo}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 text-sm rounded-full bg-salon-gold/10 text-salon-gold mb-2 inline-block">
                        {apt.status}
                      </span>
                      <p className="font-medium mt-1">{formatGhanaCedi(apt.price)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-salon-dark/10">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateTicket(apt.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate Ticket
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReschedule(apt.id)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="heading-md">Recent Services</h2>
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Haircut & Styling</h3>
                      <p className="text-sm text-salon-dark/70 mt-1">Completed on March 1, 2024</p>
                      <p className="text-sm text-salon-dark/70">Stylist: Sarah Johnson</p>
                    </div>
                    <p className="text-salon-gold font-medium">{formatGhanaCedi(150)}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Treatment & Care</h3>
                      <p className="text-sm text-salon-dark/70 mt-1">Completed on February 15, 2024</p>
                      <p className="text-sm text-salon-dark/70">Stylist: Michael Brown</p>
                    </div>
                    <p className="text-salon-gold font-medium">{formatGhanaCedi(200)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h2 className="heading-md mb-4">Loyalty Program</h2>
              <div className="space-y-3">
                <p className="text-sm text-salon-dark/70">
                  You have <span className="font-semibold text-salon-gold">{loyaltyPoints} points</span>
                </p>
                <div className="h-2 bg-white rounded-full">
                  <div 
                    className="h-full bg-salon-gold rounded-full" 
                    style={{ width: `${(loyaltyPoints / 500) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-salon-dark/70">
                  Earn 250 more points to receive a free styling session!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
