"use client";

import styles from "./test.module.css";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery, gql } from "@apollo/client";

const ADD_TEST = gql`
mutation CreateTest(
  $name: String!
  $otherImageFiles: [Upload]
) {
  createTest(
    name: $name
    otherImageFiles: $otherImageFiles
  ) {
    name
    otherImages
  }
}
`;

const GET_TEST_BY_ID = gql`
query GetTestById($id: Int!) {
  getTestById(id:$id) {
    id
    name
otherImages
  }
}
`;

const TestPage = () => {
  const [name, setName] = useState("");
  const [otherImageFiles, setOtherImageFiles] = useState<[File] | null>(null);
  // const { data, loading, error, refetch } = useQuery(
  //   GET_ALL_TESTS
  // );
  
const vehicleId = 1;
  const { data, loading, error } = useQuery(GET_TEST_BY_ID, {
    variables: { id: vehicleId  },
    skip: !vehicleId, 
  });

  const [addTest] = useMutation(ADD_TEST, {
    onCompleted: (data) => {
      // Reset form or show success message if needed
      setName("");
      setOtherImageFiles(null);
    },
  });


  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (otherImageFiles) {
      try {
        const result = await addTest({
          variables: {
            name,
           otherImageFiles
          },
        });

        console.log("Mutation result:", result);
      } catch (error: any) {
        console.error("Error adding vehicle:", error);
        if (error.networkError) {
          const { result } = error.networkError;
          console.error("GraphQL Error:", result.errors);
        }
      }
    }
  };

  return (
   <><div>
      {data?.getTestById && (
        <div className={styles.container}>
          <div className={styles.vehicle}>
            <div className={styles.vehicleDetails}>
              <div className={styles.name}>
                <h2>
                  {data.getTestById.manufacturer?.name}{" "}
                  {data.getTestById.model?.name}{" "}
                </h2>
                <h3>Rs {data.getTestById.price} / day</h3>
              </div>
              {data.getTestById.otherImages.map((url, index) => (
              <img key={index} src={url} alt={`Vehicle Image ${index + 1}`} />
            ))}
              <img
                src={data.getTestById.primaryImage}
                alt={data.getTestById.name}
              />
            </div>

          </div>

          <div className={styles.specification}>
            <div className={styles.description}>
              <p>{data.getTestById.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    <form onSubmit={(e) => handleFormSubmit(e)}>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            setOtherImageFiles(e.target.files); // Set file if available
          } else {
            setOtherImageFiles(null); // Handle null case if needed
          }
        }}
        required
      />
      <button type="submit" className={styles.submitButton}>
        Add
      </button>
    </form></> 
    );
};

export default TestPage;