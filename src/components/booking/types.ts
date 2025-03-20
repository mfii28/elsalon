
export interface BookingFormProps {
  onComplete: () => void;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface FormState {
  service: string;
  subservice: string;
  stylist: string;
  selectedExtras: string[];
  date?: Date;
  selectedTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export interface StepProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  goToNextStep: () => void;
  goToPrevStep?: () => void;
}
