
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProps } from "./types";

export function ClientInfoForm({ formState, updateFormState, goToPrevStep, goToNextStep }: StepProps) {
  const { clientName, clientEmail, clientPhone } = formState;

  const handleInputChange = (field: string, value: string) => {
    updateFormState({ [field]: value });
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="clientName">Your Name</Label>
        <Input 
          id="clientName"
          required 
          placeholder="Enter your full name" 
          value={clientName}
          onChange={(e) => handleInputChange('clientName', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientEmail">Email</Label>
        <Input 
          id="clientEmail"
          required 
          type="email" 
          placeholder="Enter your email" 
          value={clientEmail}
          onChange={(e) => handleInputChange('clientEmail', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientPhone">Phone</Label>
        <Input 
          id="clientPhone"
          required 
          type="tel" 
          placeholder="Enter your phone number" 
          value={clientPhone}
          onChange={(e) => handleInputChange('clientPhone', e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={goToPrevStep}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={goToNextStep}
          className="flex-1 bg-salon-gold hover:bg-salon-gold/90"
          disabled={!clientName}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}
