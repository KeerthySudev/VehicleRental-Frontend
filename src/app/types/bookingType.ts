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