"use client"
import { useState, useEffect } from "react";

function Card1({ heading, description, link, className }) {
  return (
    <div className={`flex gap-4 rounded-xl shadow-sm p-6 ${className}`}>
      <div className="space-y-2">
        <h3 className="text-[22px] font-semibold">{heading}</h3>
        <p className="leading-8 text-gray-500 font-normal">{description}</p>
        <br/>
      </div>
    </div>
  );
}

export default function DashPanel(){
    const [details, setDetails] = useState(0);
    const [parents, setParents] = useState(0); // New state variable for total parents

    useEffect(()=>{
      detailsGetter();
    }, [])

    async function detailsGetter(){
      try {
        const response = await fetch('/api/getDashDetails', {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          let totalStudentsCount = 0;
          let totalParentsCount = 0;

          data.forEach(detail => {
            totalStudentsCount++;
            totalParentsCount += detail.Parents;
          });

          setDetails(totalStudentsCount);
          setParents(totalParentsCount); // Update the total parents count
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error fetching:', error);
        alert('An error occurred while fetching.');
      }
    }

  return (
    <>
        <div className="flex flex-col gap-4 p-4">
            <Card1
            heading="Total Students"
            description={details}
            className="bg-blue-100"
            />
            <Card1
            heading="Total Parents"
            description={parents}
            className="bg-yellow-100"
            />
            <Card1
            heading="Total Delivered"
            description={delivered}
            className="bg-green-100"
            />
            <Card1
            heading="Total Not Delivered"
            description={notDelivered}
            className="bg-red-100"
            />
        </div>
    </>
  );
}