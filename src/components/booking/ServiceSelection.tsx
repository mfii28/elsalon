
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatGhanaCedi } from "@/lib/utils";
import { StepProps } from "./types";

// Service data - could be moved to a constants file later
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

export function ServiceSelection({ formState, updateFormState, goToNextStep }: StepProps) {
  const { service, subservice, stylist, selectedExtras } = formState;
  
  // Get the selected service object
  const selectedService = service ? services[service as keyof typeof services] : null;
  const selectedSubservice = selectedService?.subservices.find(s => s.id === subservice);
  
  // Calculate total price
  const totalPrice = (selectedSubservice?.price || 0) + 
    extras.filter(extra => selectedExtras.includes(extra.id))
      .reduce((sum, extra) => sum + extra.price, 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label>Select Service</Label>
        <Select value={service} onValueChange={(value) => {
          updateFormState({
            service: value,
            subservice: "",
          });
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
          <Select value={subservice} onValueChange={(value) => updateFormState({ subservice: value })}>
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
          <Select value={stylist} onValueChange={(value) => updateFormState({ stylist: value })}>
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
                    updateFormState({
                      selectedExtras: checked
                        ? [...selectedExtras, extra.id]
                        : selectedExtras.filter(id => id !== extra.id)
                    });
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
        onClick={goToNextStep}
        disabled={!stylist}
      >
        Continue
      </Button>
    </div>
  );
}

export default ServiceSelection;
