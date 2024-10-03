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
        secondaryImage
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
    secondaryImage
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
GET_ALL_RENTABLE_VEHICLES : gql`
query GetAllVehicles {
  getAllRentableVehicles {
    id
    name
    description
    price
    primaryImage
    secondaryImage
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
} 

export default vehicleServices;