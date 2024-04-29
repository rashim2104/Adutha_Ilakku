"use client";
import React, { useState, useEffect } from 'react';
import UpdateForm from '@/components/UpdateForm';

export default function GenUpdate() {
    const [mobile, setMobile] = useState("");
    const [details, setDetails] = useState(null);

    const fetchDetails = async () => {
        const response = await fetch('/api/fetchData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Mobile: mobile }),
        });

        if (response.ok) {
            const data = await response.json();
            setDetails(data.fullRecord);
        } else {
            const errorData = await response.json();
            toast.error(`Error: ${errorData.message}`);
        }
    };

    const onSubmit = (data) => {
        // handle form submission here
    };

    return (
        <div className='flex flex-col '>
            <h1 className='text-4xl font-bold mt-4 mb-10'>Update Details</h1>
            {!details ? (
                <>
                    <label htmlFor="mobile">Enter Mobile No</label>
                    <input
                        type="text"
                        className="input"
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <center><button className='bg-green-200 mt-4 p-3 rounded-full' onClick={fetchDetails}>Fetch Details</button></center>
                </>
            ) : (
                <UpdateForm {...details}/>
            )}
        </div>
    );
}