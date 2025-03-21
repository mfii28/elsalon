
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";
import { StepProps } from "./types";
import { getAvailableTimeSlots } from "@/lib/stylistService";
import { TimeSlot } from "@/lib/types";

export function DateTimeSelection({ formState, updateFormState, goToNextStep, goToPrevStep }: StepProps) {
  const { date, selectedTime, stylist } = formState;
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Function to calculate max date (30 days from today)
  const getMaxDate = () => {
    return addDays(new Date(), 30);
  };

  // Update available times when stylist and date change
  useEffect(() => {
    if (stylist && date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const slots = getAvailableTimeSlots(stylist, formattedDate);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [stylist, date]);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label>Select Date</Label>
        <div className="border rounded-md p-2 md:p-3 mx-auto max-w-md">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              updateFormState({ 
                date: newDate,
                selectedTime: ""
              });
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
            {availableSlots.length > 0 ? (
              availableSlots.filter(slot => !slot.isBooked).map((slot, idx) => (
                <Button
                  key={idx}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFormState({ selectedTime: slot.time })}
                  className={selectedTime === slot.time ? "bg-salon-gold hover:bg-salon-gold/90" : ""}
                >
                  {slot.time}
                </Button>
              ))
            ) : (
              <div className="col-span-full text-center py-2 text-sm text-gray-500">
                {stylist && date ? "No available time slots for this date" : "Select a date to see available times"}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={goToPrevStep}
        >
          Back
        </Button>
        <Button
          className="flex-1 bg-salon-gold hover:bg-salon-gold/90"
          onClick={goToNextStep}
          disabled={!date || !selectedTime}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
