export interface Booking {
    id: number;
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
    amount: number;
    status: string;
    paymentStatus: string;
    pickupLocation: string;
    dropoffLocation: string;
    vehicle: Vehicle;
    createdAt: string;
    customer: Customer;
  }

  export interface Vehicle {
    id: number;
    name: string;
    modelName: string;
    manufacturerName: string;
  }

  export interface Customer {
    name: string;
  }

  export interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    handler: (response: { razorpay_payment_id: string; razorpay_signature: string; }) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
    modal?: {
      ondismiss?: () => void | Promise<void>;
    };
  }
  
  export interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }

  interface RazorpayInstance {
    open: () => void;
    on: (event: string, callback: () => void) => void;
  }

  export const windowWithRazorpay = window as typeof window & {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  };