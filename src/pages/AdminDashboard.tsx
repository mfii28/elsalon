
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Scissors, Timer, TrendingUp, Wallet, ChevronRight, RefreshCw } from "lucide-react";
import { formatGhanaCedi } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import dataService, { Stylist, Appointment, TimeSlot, StylistSchedule } from "@/lib/dataService";
import Logo from "@/components/Logo";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load data on mount and when refresh is triggered
  useEffect(() => {
    const loadData = () => {
      try {
        // Auto-update appointment statuses
        const updatedAppointments = dataService.autoUpdateAppointmentStatuses();
        setAppointments(updatedAppointments);
        
        // Load stylists
        setStylists(dataService.getStylists());
        
        toast({
          title: "Data Refreshed",
          description: "Dashboard data has been updated.",
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [refreshTrigger, toast]);

  // Calculate stats for the dashboard
  const todayAppointments = appointments.filter(apt => 
    isSameDay(parseISO(apt.date), new Date())
  );
  
  const todaysRevenue = todayAppointments.reduce((sum, apt) => sum + apt.price, 0);
  const totalClients = Array.from(new Set(appointments.map(apt => apt.client))).length;
  const monthlyRevenue = appointments.reduce((sum, apt) => {
    const appointmentMonth = parseISO(apt.date).getMonth();
    const currentMonth = new Date().getMonth();
    
    if (appointmentMonth === currentMonth) {
      return sum + apt.price;
    }
    return sum;
  }, 0);

  const stats = [
    {
      icon: <Calendar className="w-6 h-6 text-salon-gold" />,
      title: "Today's Appointments",
      value: todayAppointments.length.toString(),
    },
    {
      icon: <Users className="w-6 h-6 text-salon-gold" />,
      title: "Total Clients",
      value: totalClients.toString(),
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-salon-gold" />,
      title: "Monthly Revenue",
      value: formatGhanaCedi(monthlyRevenue),
    },
    {
      icon: <Wallet className="w-6 h-6 text-salon-gold" />,
      title: "Today's Revenue",
      value: formatGhanaCedi(todaysRevenue),
    },
  ];

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-salon-cream to-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <div className="mb-8">
          <Logo className="text-3xl mb-2" />
          <p className="text-sm text-salon-dark/60">Managing your salon made easy</p>
        </div>
        
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="w-4 h-4 mr-3" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="w-4 h-4 mr-3" />
            Stylists
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Scissors className="w-4 h-4 mr-3" />
            Services
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="heading-lg text-salon-dark">Welcome Back</h1>
              <p className="text-salon-dark/60">Here's what's happening in your salon today</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              <Button className="bg-salon-gold hover:bg-salon-gold/90">
                <Scissors className="w-4 h-4 mr-2" />
                Add New Booking
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-2xl hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-salon-gold/10 rounded-full">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-salon-dark/70">{stat.title}</p>
                    <p className="text-2xl font-semibold text-salon-dark">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Appointments Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="heading-md text-salon-dark">Today's Schedule</h2>
                    <p className="text-sm text-salon-dark/60">
                      {format(new Date(), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Stylist</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAppointments.length > 0 ? (
                        todayAppointments.map((apt) => {
                          // Find stylist name
                          const stylist = stylists.find(s => s.id === apt.stylistId);
                          
                          return (
                            <TableRow key={apt.id}>
                              <TableCell className="font-medium">{apt.client}</TableCell>
                              <TableCell>{apt.service}</TableCell>
                              <TableCell>{apt.time}</TableCell>
                              <TableCell>{stylist?.name || "Unknown"}</TableCell>
                              <TableCell>{formatGhanaCedi(apt.price)}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-3 py-1 text-sm rounded-full ${
                                    apt.status === "Confirmed"
                                      ? "bg-green-100 text-green-700"
                                      : apt.status === "Cancelled"
                                      ? "bg-red-100 text-red-700" 
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-salon-dark/60">
                            No appointments scheduled for today
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 text-salon-dark">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col items-center">
                    <Calendar className="w-5 h-5 mb-2" />
                    <span>Schedule Appointment</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col items-center">
                    <Users className="w-5 h-5 mb-2" />
                    <span>Manage Stylists</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col items-center">
                    <TrendingUp className="w-5 h-5 mb-2" />
                    <span>View Reports</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stylist Availability Section */}
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="heading-md mb-6 text-salon-dark">Today's Availability</h2>
              <div className="space-y-6">
                {stylists.map((stylist) => {
                  // Find today's schedule
                  const todaySchedule = stylist.schedule.find(day => 
                    isSameDay(parseISO(day.date), new Date())
                  );
                  
                  const bookedCount = todaySchedule 
                    ? todaySchedule.slots.filter(s => s.isBooked).length 
                    : 0;
                  
                  return (
                    <div key={stylist.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-salon-dark">{stylist.name}</h3>
                          <span className="text-sm text-salon-dark/60">{stylist.specialty}</span>
                        </div>
                        <div className="text-sm text-salon-dark/60">
                          <span className="font-medium">
                            {bookedCount}
                          </span>
                          /{stylist.dailyBookingLimit} slots booked
                        </div>
                      </div>
                      
                      {todaySchedule && (
                        <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            {todaySchedule.slots.map((slot, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg text-sm ${
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
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
