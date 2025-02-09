import { gql } from "@apollo/client";

const vehicleServices = {

  ADD_VEHICLE : gql`
  mutation CreateVehicle(
    $name: String!
    $gear: String
    $fuelType: String
    $seats: Int
    $description: String!
    $price: Float!
    $primaryImageFile: Upload!
    $availableQty: Int!
    $manufacturerId: Int!
    $modelId: Int!
    $otherImageFiles: [Upload]
  ) {
    createVehicle(
      name: $name
      gear: $gear
      fuelType: $fuelType
      seats: $seats
      description: $description
      price: $price
      primaryImageFile: $primaryImageFile
      availableQty: $availableQty
      manufacturerId: $manufacturerId
      modelId: $modelId
      otherImageFiles: $otherImageFiles
    ) {
      availableQty
      description
      id
      manufacturer {
        id
        name
        image
      }
      model {
        id
        name
      }
      name
      price
      primaryImage
      otherImages
    }
  }
`,

  GET_ALL_VEHICLES : gql`
    query GetAllVehicles {
      getAllVehicles {
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
TOGGLE_RENTABLE : gql`
  mutation ToggleRentable($id: Int!) {
    toggleRentable(id: $id) {
      id
      isRentable
    }
  }
`,
GET_ALL_MANUFACTURERS : gql`
query GetAllManufacturers {
  getAllManufacturers {
    id
    name
    image
  }
}`,
DELETE_VEHICLE : gql`
mutation DeleteVehicle($id: Int!) {
  deleteVehicle(id: $id)
}`,
DELETE_MANUFACTURER : gql`
mutation DeleteManufacturer($id: Int!) {
  deleteManufacturer(id: $id)
}`,
DELETE_MODEL : gql`
mutation DeleteModel($id: Int!) {
  deleteModel(id: $id)
}`,
GET_MODELS_BY_MANUFACTURER : gql`
query  GetModelsByManufacturer($manufacturerId: Int!) {
    getModelsByManufacturer(manufacturerId: $manufacturerId) {
      id
      name
    }
  }
`,
CREATE_MODEL : gql`
  mutation CreateModel($name: String!, $manufacturerId: Int!) {
    createModel(name: $name, manufacturerId: $manufacturerId) {
      id
      name
    }
  }
`,
CREATE_MANUFACTURER : gql`
  mutation CreateManufacturer($name: String!, $imageFile: Upload) {
    createManufacturer(name: $name, imageFile: $imageFile) {
      id
      name
      image
    }
  }
`,

IMPORT_MANUFACTURERS : gql`
  mutation ImportManufacturers($file: Upload) {
    importManufacturers(file: $file)
  }
`,

IMPORT_VEHICLES : gql`
  mutation ImportVehicles($file: Upload) {
    importVehicles(file: $file)
  }
`,


 SEARCH_VEHICLES : gql`
query SearchVehicles($query: String!) {
  searchVehicles(query: $query) {
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

UPDATE_VEHICLE : gql`
mutation UpdateVehicle($id: Int!, $data: VehicleInput, $primaryImageFile: Upload , $otherImageFiles: [Upload]) {
    updateVehicle(id: $id, data: $data, primaryImageFile: $primaryImageFile, otherImageFiles: $otherImageFiles) {
      id
      name
      description
      price
      availableQty
      seats
      fuelType
      gear
    }
  }`

} 

export default vehicleServices;