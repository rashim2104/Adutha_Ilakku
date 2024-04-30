"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Delivery() {
  const [id, setId] = useState("");
  const [result, setResult] = useState({});
  const [kits, setKits] = useState(0);

  const idInputRef = useRef(null); 


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
        toast.success("Delivered Successfully");
        setResult({});
        setId("");
        setKits(0);
        idInputRef.current.focus();
      }else{
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  async function getDetails(id) {
    try {
      const response = await fetch(`/api/getDetails`, {
        method: "POST",
        body: JSON.stringify({ id: id, action : "short" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        if(data.message === "Already Delivered"){
          toast.error("Already Delivered");
        }
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  useEffect(() => {
    if (id.length > 3) {
      getDetails(id);
      setResult({});
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center">
      <h1 className='text-4xl font-bold mt-4 mb-10'>Short Deliver Kits</h1>
      <div className="flex p-6 flex-col justify-center">
        <label htmlFor="" className="mb-3">ID Number: </label>
        <div className="flex">
          <input className="input"    ref={idInputRef}  type="tel" value={id} placeholder="XXXX" onChange={handleChange} style={{ textAlign: 'center', outline: 'none' }}/>      
      </div>
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
