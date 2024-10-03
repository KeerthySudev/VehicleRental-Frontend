export interface Vehicle {
    id: number;
    name: string;
    model: Model;
    description: string;
    manufacturer: Manufacturer;
    price: number;
    availableQty: number;
    primaryImage: string;
    secondaryImage: string;
    isRentable : boolean;
  }
 export  interface Manufacturer {
    id: number;
    name: string;
    image : string;
  }
  export interface Model {
    id: number;
    name: string;
  }