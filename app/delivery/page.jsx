"use client";
import { useState, useEffect } from "react";

export default function Delivery() {
  const [id, setId] = useState("");
  const [result, setResult] = useState({});
  const [kits, setKits] = useState(0);

  const handleChange = (e) => {
    setId(e.target.value);
  }
  const handleDeliver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/deliver`, {
        method: "POST",
        body: JSON.stringify({ Mobile: result.Mobile, Kits: kits }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert("Delivered Successfully");
        setResult({});
        setKits(0);
      }else{
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  async function getDetails(id) {
    try {
      const response = await fetch(`/api/getDetails`, {
        method: "POST",
        body: JSON.stringify({ id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setResult(data);
        setId("");
        if(data.message === "Already Delivered"){
          alert("Already Delivered");
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  useEffect(() => {
    if (id.length > 7) {
      getDetails(id);
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex p-6 w-1/4 flex-col justify-center">
        <label htmlFor="">ID Number: </label>
        <input
          className="input"
          value={id}
          type="text"
          onChange={handleChange}
        />
      </div>
      {result.Name && (
        <>
          <div className="flex flex-col p-6">
            <p>Name: {result.Name}</p>
            <p>Mobile: {result.Mobile}</p>
            <p>No of Parents accompanied: {result.Parents}</p>
          </div>
          <div className="flex p-6 flex-col justify-center">
            <label htmlFor="">No of Kits Distributed:</label>
            <input
              value={kits}
              type="tel"
              className="input"
              onChange={(e) => setKits(e.target.value)}
            />
            <center>
              <button
                className="bg-green-200 rounded-full p-4 w-1/2 mt-6"
                onClick={handleDeliver}
              >
                Update
              </button>
            </center>
          </div>
        </>
      )}
    </div>
  );
}
