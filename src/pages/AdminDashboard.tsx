
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Scissors, Timer, TrendingUp, Wallet } from "lucide-react";
import { formatGhanaCedi } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { addDays, format, isSameDay } from "date-fns";

interface TimeSlot {
  time: string;
  isBooked: boolean;
  clientName?: string;
  service?: string;
}

interface StylistSchedule {
  date: string;
  slots: TimeSlot[];
}

interface Stylist {
  id: string;
  name: string;
  specialty: string;
  schedule: StylistSchedule[];
  dailyBookingLimit: number;
  workingHours: {
    start: string;
    end: string;
  };
}

const WORKING_HOURS = {
  start: "09:00",
  end: "17:00",
};

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stylists, setStylists] = useState<Stylist[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      specialty: "Color Specialist",
      dailyBookingLimit: 14, // 7 clients with 2 slots each
      workingHours: WORKING_HOURS,
      schedule: generateInitialSchedule()
    },
    {
      id: "2",
      name: "Michael Brown",
      specialty: "Cutting Expert",
      dailyBookingLimit: 14,
      workingHours: WORKING_HOURS,
      schedule: generateInitialSchedule()
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      client: "John Doe",
      service: "Haircut & Styling",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "Confirmed",
      price: 150,
      stylist: "Sarah Johnson"
    },
    {
      id: 2,
      client: "Jane Smith",
      service: "Color & Highlights",
      date: "2024-03-15",
      time: "2:00 PM",
      status: "Pending",
      price: 300,
      stylist: "Michael Brown"
    },
  ]);

  function generateInitialSchedule(): StylistSchedule[] {
    const schedule: StylistSchedule[] = [];
    const today = new Date();
    
    // Generate schedule for next 30 days
    for (let i = 0; i < 30; i++) {
      const currentDate = addDays(today, i);
      schedule.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        slots: TIME_SLOTS.map(time => ({
          time,
          isBooked: false
        }))
      });
    }
    
    return schedule;
  }

  // Automatically check and update appointment statuses
  useEffect(() => {
    const updatedAppointments = appointments.map(apt => {
      const appointmentDate = new Date(`${apt.date} ${apt.time}`);
      const now = new Date();
      
      // Automatically confirm appointments 24h before
      if (appointmentDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000 
          && apt.status === "Pending") {
        return { ...apt, status: "Confirmed" };
      }
      
      return apt;
    });

    setAppointments(updatedAppointments);
  }, [appointments]);

  // Check stylist availability for a specific date and time
  const checkStylistAvailability = (
    stylistId: string,
    date: string,
    time: string
  ): boolean => {
    const stylist = stylists.find(s => s.id === stylistId);
    if (!stylist) return false;

    const daySchedule = stylist.schedule.find(s => s.date === date);
    if (!daySchedule) return false;

    // Check if stylist has reached daily booking limit
    const dailyBookings = daySchedule.slots.filter(slot => slot.isBooked).length;
    if (dailyBookings >= stylist.dailyBookingLimit) return false;

    // Check specific time slot availability
    const timeSlot = daySchedule.slots.find(slot => slot.time === time);
    return timeSlot ? !timeSlot.isBooked : false;
  };

  // Automatically update stylist schedule when new booking is made
  const updateStylistSchedule = (
    stylistId: string,
    date: string,
    time: string,
    booking: { clientName: string; service: string; }
  ) => {
    setStylists(prev => prev.map(stylist => {
      if (stylist.id !== stylistId) return stylist;

      const updatedSchedule = stylist.schedule.map(day => {
        if (day.date !== date) return day;

        const updatedSlots = day.slots.map(slot => {
          if (slot.time !== time) return slot;
          return {
            ...slot,
            isBooked: true,
            clientName: booking.clientName,
            service: booking.service
          };
        });

        return { ...day, slots: updatedSlots };
      });

      return { ...stylist, schedule: updatedSchedule };
    }));

    toast({
      title: "Schedule Updated",
      description: "Stylist schedule has been automatically updated.",
    });
  };

  const stats = [
    {
      icon: <Calendar className="w-6 h-6 text-salon-gold" />,
      title: "Today's Appointments",
      value: appointments.filter(apt => 
        isSameDay(new Date(apt.date), new Date())
      ).length.toString(),
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-md">Today's Appointments</h2>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-salon-dark/10">
                    <th className="pb-4 font-medium">Client</th>
                    <th className="pb-4 font-medium">Service</th>
                    <th className="pb-4 font-medium">Time</th>
                    <th className="pb-4 font-medium">Stylist</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.filter(apt => 
                    isSameDay(new Date(apt.date), new Date())
                  ).map((apt) => (
                    <tr key={apt.id} className="border-b border-salon-dark/5">
                      <td className="py-4">{apt.client}</td>
                      <td className="py-4">{apt.service}</td>
                      <td className="py-4">{apt.time}</td>
                      <td className="py-4">{apt.stylist}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h2 className="heading-md mb-6">Stylist Availability</h2>
            <div className="space-y-6">
              {stylists.map((stylist) => (
                <div key={stylist.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{stylist.name}</h3>
                    <span className="text-sm text-salon-dark/70">
                      {stylist.specialty}
                    </span>
                  </div>
                  {stylist.schedule
                    .filter(day => isSameDay(new Date(day.date), new Date()))
                    .map((day) => (
                    <div key={day.date} className="bg-white/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-2">{day.date}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {day.slots.map((slot, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded text-sm ${
                              slot.isBooked 
                                ? "bg-salon-gold/10 text-salon-gold"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            <Timer className="w-4 h-4 inline-block mr-2" />
                            {slot.time}
                            {slot.isBooked && slot.clientName && (
                              <p className="text-xs mt-1 text-salon-dark/70">
                                {slot.clientName}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
