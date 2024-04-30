"use client";
import React, { useState, useEffect, useRef } from 'react';
import { set } from "mongoose";
import { toast } from "sonner";

export default function Delivery() {
  const [id, setId] = useState("");
  const [result, setResult] = useState({});
  const idInputRef = useRef();
  const [kits, setKits] = useState(0);
  const [isOther, setIsOther] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setId(e.target.value);
  }
  const handleDeliver = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/deliver`, {
        method: "POST",
        body: JSON.stringify({ Mobile: result.Mobile, Kits: kits}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        toast.success("Delivered Successfully");
        setResult({});
        idInputRef.current.focus();
        setId("");
        setKits(0);
        idInputRef.current.focus();

      }else{
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
       setLoading(false);
    }
  };

  const handleDeliverFast = async (count) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/deliver`, {
        method: "POST",
        body: JSON.stringify({ Mobile: result.Mobile, Kits: count}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        toast.success("Delivered Successfully");
        setResult({});
        idInputRef.current.focus();
        setId("");
        setKits(0);
        idInputRef.current.focus();
      }else{
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
       setLoading(false);
    }
  };

  async function getDetails(id) {
    try {
      const response = await fetch(`/api/getDetails`, {
        method: "POST",
        body: JSON.stringify({ id: id , action : "long"}),
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
    if (id.length > 11) {
      getDetails(id);
      setResult({});
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center">
      <h1 className='text-4xl font-bold mt-4 mb-10'>Deliver Kits</h1>
      <div className="flex p-6 flex-col justify-center">
        <label htmlFor="" className="mb-3">ID Number: </label>
        <div className="flex">
        <input
        ref={idInputRef}
        className="input"
        type="tel"
        value={id}
        placeholder="XXXX"
        onChange={handleChange}
        style={{ textAlign: 'center', outline: 'none' }}
      />
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
            <div className="flex gap-3">
            <button className="button" onClick={((e) => {handleDeliverFast(1);})}>1</button>
            <button className="button" onClick={((e) => {handleDeliverFast(2);})}>2</button>
            <button className="button" onClick={() => {
              setIsOther((prev) => !prev);
            }}>Other</button></div>
           {isOther && (<><input
              value={kits}
              type="tel"
              className="input"
              onChange={(e) => setKits(e.target.value)}
            />
            <center>

              <button
                className="bg-green-200 rounded-full p-4 w-1/2 mt-6"
                disabled={loading}
                onClick={handleDeliver}
              >
                Update
              </button>
            </center></>)}
          </div>
        </>
      )}
    </div>
  );
}
