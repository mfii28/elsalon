
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [appointments] = useState([
    {
      id: 1,
      service: "Haircut & Styling",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "Upcoming",
    },
    {
      id: 2,
      service: "Color & Highlights",
      date: "2024-03-20",
      time: "2:00 PM",
      status: "Confirmed",
    },
  ]);

  const navigate = useNavigate();

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

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="heading-md mb-6">Upcoming Appointments</h2>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{apt.service}</h3>
                    <div className="flex items-center text-sm text-salon-dark/70 mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      {apt.date} at {apt.time}
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-salon-gold/10 text-salon-gold">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h2 className="heading-md mb-6">Recent Services</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/50 rounded-lg">
                <h3 className="font-semibold">Haircut & Styling</h3>
                <p className="text-sm text-salon-dark/70 mt-1">Completed on March 1, 2024</p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg">
                <h3 className="font-semibold">Treatment & Care</h3>
                <p className="text-sm text-salon-dark/70 mt-1">Completed on February 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
