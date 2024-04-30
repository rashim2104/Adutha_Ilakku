"use client";
import { useState } from "react";
import QrCode from "@/components/QrCode";
import { toast } from "sonner";

export default function ViewToken() {
  const [mobile, setMobile] = useState("");
  const [formData, setFormData] = useState(null);
  const [date, setDate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/fetchData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Mobile: mobile }),
      });
      const respData = await response.json();
      if (response.ok) {
        setFormData(respData.fullRecord);
        const date = new Date(respData.fullRecord.DOB);
        const formattedDate = date.toLocaleDateString("en-GB"); // Use 'en-GB' locale to get the date in 'dd/mm/yyyy' format
        setDate(formattedDate);
      } else {
        toast.error(respData.message);
      }
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };
  return (
    <div className="flex flex-col">
      <center>
        <h1 className="text-4xl font-bold mb-10 mt-4">View Details</h1>
      </center>
      <div className="flex flex-col p-4">
        <label htmlFor="">Enter Mobile Number</label>
        <input
          type="tel"
          className="input"
          name=""
          id=""
          onChange={(e) => setMobile(e.target.value)}
        />
        <center>
          {" "}
          <button
            className="bg-green-300 p-4 mt-4 rounded-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </center>
      </div>
      {formData && (
        <div className="flex flex-col p-4">
          {
            <div>
              <p>Name: {formData.Name}</p>
              <p>DOB: {date}</p>
              <p>Mobile: {formData.Mobile}</p>
              <p>Class: {formData.Class}</p>
              <p>Group: {formData.Group}</p>
              <p>Parents Accompanied: {formData.Parents}</p>
              <p>Delivered: {formData.Delivered}</p>
              <center>{<QrCode data={formData.ae_id} />}</center>
            </div>
          }
        </div>
      )}
    </div>
  );
}
