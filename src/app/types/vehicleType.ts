export interface Vehicle {
    id: number;
    name: string;
    model: Model;
    modelName: string;
    description: string;
    manufacturer: Manufacturer;
    manufacturerName: string;
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