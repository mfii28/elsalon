
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Scissors, Timer, TrendingUp, Wallet } from "lucide-react";
import { formatGhanaCedi } from "@/lib/utils";

const AdminDashboard = () => {
  const [appointments] = useState([
    {
      id: 1,
      client: "John Doe",
      service: "Haircut & Styling",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "Confirmed",
      price: 150
    },
    {
      id: 2,
      client: "Jane Smith",
      service: "Color & Highlights",
      date: "2024-03-15",
      time: "2:00 PM",
      status: "Pending",
      price: 300
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
      icon: <TrendingUp className="w-6 h-6 text-salon-gold" />,
      title: "Monthly Revenue",
      value: formatGhanaCedi(15000),
    },
    {
      icon: <Wallet className="w-6 h-6 text-salon-gold" />,
      title: "Today's Revenue",
      value: formatGhanaCedi(2500),
    },
  ];

  const recentServices = [
    { name: "Haircut & Styling", count: 45, revenue: 6750 },
    { name: "Color & Highlights", count: 28, revenue: 8400 },
    { name: "Treatment & Care", count: 32, revenue: 4800 },
  ];

  return (
    <div className="min-h-screen bg-salon-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-lg">Admin Dashboard</h1>
          <div className="space-x-4">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button className="bg-salon-gold hover:bg-salon-gold/90">
              <Scissors className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>

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

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="glass-card p-6 rounded-2xl md:col-span-2">
            <h2 className="heading-md mb-6">Today's Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-salon-dark/10">
                    <th className="pb-4 font-medium">Client</th>
                    <th className="pb-4 font-medium">Service</th>
                    <th className="pb-4 font-medium">Time</th>
                    <th className="pb-4 font-medium">Price</th>
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
                      <td className="py-4">{formatGhanaCedi(apt.price)}</td>
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
                      <td className="py-4 space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h2 className="heading-md mb-6">Popular Services</h2>
            <div className="space-y-4">
              {recentServices.map((service, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-salon-dark/70">
                        {service.count} bookings
                      </p>
                    </div>
                    <p className="text-salon-gold font-medium">
                      {formatGhanaCedi(service.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
