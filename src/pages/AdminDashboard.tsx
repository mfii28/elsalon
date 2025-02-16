
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Scissors, Timer } from "lucide-react";

const AdminDashboard = () => {
  const [appointments] = useState([
    {
      id: 1,
      client: "John Doe",
      service: "Haircut & Styling",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      client: "Jane Smith",
      service: "Color & Highlights",
      date: "2024-03-15",
      time: "2:00 PM",
      status: "Pending",
    },
  ]);

  const stats = [
    {
      icon: <Calendar className="w-6 h-6 text-salon-gold" />,
      title: "Today's Appointments",
      value: "8",
    },
    {
      icon: <Users className="w-6 h-6 text-salon-gold" />,
      title: "Total Clients",
      value: "145",
    },
    {
      icon: <Scissors className="w-6 h-6 text-salon-gold" />,
      title: "Services Completed",
      value: "289",
    },
    {
      icon: <Timer className="w-6 h-6 text-salon-gold" />,
      title: "Pending Requests",
      value: "12",
    },
  ];

  return (
    <div className="min-h-screen bg-salon-cream p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="heading-lg mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-salon-gold/10 rounded-full">{stat.icon}</div>
                <div>
                  <p className="text-sm text-salon-dark/70">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading-md">Today's Appointments</h2>
            <Button className="bg-salon-gold hover:bg-salon-gold/90">
              Add Appointment
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-salon-dark/10">
                  <th className="pb-4 font-medium">Client</th>
                  <th className="pb-4 font-medium">Service</th>
                  <th className="pb-4 font-medium">Time</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-salon-dark/5">
                    <td className="py-4">{apt.client}</td>
                    <td className="py-4">{apt.service}</td>
                    <td className="py-4">{apt.time}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          apt.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
