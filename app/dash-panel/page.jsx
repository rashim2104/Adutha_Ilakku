"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
function Card1({ heading, description, link, className, count = 0 }) {
  return (
    <div className={`flex gap-4 rounded-xl shadow-sm p-6 ${className}`}>
      {/* <div className="min-w-max">{icon}</div> */}
      <div className="space-y-2">
        <h3 className="text-[22px] font-semibold">{heading}</h3>
        <p className="leading-8 text-gray-500 font-normal">{description}</p>
        {count > 0 && (<p className="leading-8 text-gray-500 font-normal">Kits Delivered : <strong>{count}</strong></p>)}
        <br/>
        {heading === "Reset" ? (
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={(e)=>{
              const key = prompt("Enter the key to reset");
              try{
                const response = fetch('/api/resetData', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({key}),
                });
              }catch(e){
                console.error('Error fetching:', e);
                toast.error('An error occurred while fetching.');
              }
            }}>Reset</button>

        ) : (
            <>
            <Link href={`${link}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    {heading}
                </button>
            </Link>
            </>
        )}
    </div>
    </div>
  );
}

export default function DashPanel(){
    const [parents, setParents] = useState(0); // New state variable for total parents
    const [students, setStudents] = useState(0); // New state variable for total students
    const [delivered, setDelivered] = useState(0);
    const [notDelivered, setNotDelivered] = useState(0);

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
        let totalDeliveredCount = 0; // New variable for total delivered count

        data.fullRecord.forEach(detail => {
          totalStudentsCount++;
          totalParentsCount += detail.Parents;
          totalDeliveredCount += detail.Delivered; // Update the total delivered count
        });

        setStudents(totalStudentsCount);
        setParents(totalParentsCount); // Update the total parents count
        setDelivered(totalDeliveredCount); // Update the total delivered count
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error fetching:', error);
      toast.error('An error occurred while fetching.');
    }
  }

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <h1 className="text-4xl font-bold">DASHBOARD</h1>
      </div>
      <div className="relative w-full p-px mx-auto mb-4 overflow-hidden transition-shadow duration-300 border rounded lg:mb-8 lg:max-w-4xl group hover:shadow-xl">
        <div className="absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
        <div className="absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
        <div className="absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
        <div className="absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
        <div className="relative flex flex-col items-center justify-center h-full py-10 duration-300 bg-blue-50 rounded-sm transition-color sm:items-stretch sm:flex-row">
          <div className="px-12 py-8 text-center">
            <h6 className="text-4xl font-bold text-deep-purple-accent-400 sm:text-5xl">
              {students}
            </h6>
            <p className="text-center md:text-base">
              Students
            </p>
          </div>
          <div className="w-56 h-1 transition duration-300 transform bg-gray-300 rounded-full group-hover:bg-deep-purple-accent-400 group-hover:scale-110 sm:h-auto sm:w-1" />
          <div className="px-12 py-8 text-center">
            <h6 className="text-4xl font-bold text-deep-purple-accent-400 sm:text-5xl">
              {parents}
            </h6>
            <p className="text-center md:text-base">
              Parents
            </p>
          </div>
          <div className="w-56 h-1 transition duration-300 transform bg-gray-300 rounded-full group-hover:bg-deep-purple-accent-400 group-hover:scale-110 sm:h-auto sm:w-1" />
          <div className="px-12 py-8 text-center">
            <h6 className="text-4xl text-green-700 font-bold text-deep-purple-accent-400 sm:text-5xl">
              {parents + students}
            </h6>
            <p className="text-center md:text-base">
              Total
            </p>
          </div>
        </div>
      </div>
      <br/><br/>
      <p className="mx-auto mb-4 text-4xl text-gray-600 sm:text-center lg:max-w-2xl lg:mb-6 md:px-16">
        Admin Controls
      </p>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 bg-white p-3 sm:p-8">
      <Card1
        className="bg-green-50"
        heading="Update"
        link="/gen-update"
        description="Update student details."
        // icon={<GiAbstract020 size="2.5rem" className="text-[#D566FF]" />}
      />
      <Card1
        className="bg-purple-50"
        heading="View"
        link="/view-token"
        description="View the details of a registered student."
        // icon={<GiAbstract024 size="2.5rem" className="text-[#DDA10C]" />}
      />
        <Card1
        className="bg-blue-100"
        heading="Deliver Kits"
        link="/delivery"
        description="Add a New Kit Delivery."
        count = {delivered}
        // icon={<GiAbstract024 size="2.5rem" className="text-[#DDA10C]" />}
      />
        <Card1
        className="bg-orange-100"
        heading="Form"
        link="/"
        description="Register new student for Adutha Ilakku."
        // icon={<GiAbstract024 size="2.5rem" className="text-[#DDA10C]" />}
      />
      <Card1
        className="bg-red-100"
        heading="Reset"
        link="/token-clear"
        description="Reset the details of all the students."
        // icon={<GiAbstract024 size="2.5rem" className="text-[#DDA10C]" />}
      />
      </div>
      
    </div>
  );
}