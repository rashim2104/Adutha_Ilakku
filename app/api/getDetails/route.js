import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';

export async function POST(req){
    await connectMongoDB();
    try{
    const data = await req.json();
    let student;
    if(data.action !== 'short'){
    student = await Details.findOne({ ae_id : data.id });
    }else{
    const regex = new RegExp(data.id + "$"); 
    student = await Details.findOne({ ae_id: regex });
    }
    if(!student){
        return NextResponse.json({message: "Student not found"},{status : 400});
    }
    const isDelivered = student.Delivered;
    if(isDelivered !== 0){
        return NextResponse.json({message: "Already Delivered"},{status : 400});
    }
    return NextResponse.json(student,{status : 200});
    }catch(e){
        return NextResponse.json({message: `An error occurred: ${e}`},{status : 500});
    }
}