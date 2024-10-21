import { gql } from "@apollo/client";

const vehicleServices = {

  GET_ALL_VEHICLES : gql`
    query GetAllVehicles {
      getAllVehicles {
        id
        name
        description
        price
        primaryImage
        availableQty
        manufacturer {
          id
          name
        }
        model {
          id
          name
        }
      }
    }
  `,


  GET_VEHICLE_BY_ID : gql`
query GetVehicleById($id: Int!) {
  getVehicleById(id: $id) {
    id
    name
    description
    price
    primaryImage
    otherImages
    availableQty
    seats
    fuelType
    gear
    manufacturer {
      id
      name
    }
    model {
      id
      name
    }
  }
}
`,
GET_ALL_RENTABLE_VEHICLES : gql`
query GetAllVehicles {
  getAllRentableVehicles {
    id
    name
    description
    price
    primaryImage
    availableQty
    isRentable
    manufacturer {
      id
      name
    }
    model {
      id
      name
    }
  }
}
`,
SEARCH_VEHICLES : gql`
query SearchRentableVehicles($query: String!) {
  searchRentableVehicles(query: $query) {
    id
    name
    description
    price
    primaryImage
    availableQty
    isRentable
    manufacturerName
    modelName
  }
}
`,
GET_ALL_RENTABLE_VEHICLES_SORTED : gql`
query GetAllRentableVehiclesSorted($sortOrder: String!) {
  getAllRentableVehiclesSorted(sortOrder: $sortOrder) {
    id
    name
    description
    price
    primaryImage
    availableQty
    isRentable
    manufacturerName
    modelName
  }
}
`,
} 

export default vehicleServices;