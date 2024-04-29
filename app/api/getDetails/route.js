import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';

export async function POST(req){
    await connectMongoDB();
    const data = await req.json();
    const student = await Details.findOne({ ae_id : data.id });
    if(!student){
        return NextResponse.json({message: "Student not found"});
    }
console.log(student);
const isDelivered = student.Delivered; // Correct the spelling here
console.log(isDelivered);
console.log(typeof(isDelivered));
    if(isDelivered !== 0){
        return NextResponse.json({message: "Already Delivered"});
    }
    return NextResponse.json(student);
}