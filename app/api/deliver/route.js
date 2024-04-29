import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';

export async function POST(req){
    await connectMongoDB();
    const data = await req.json();
    if(data.Kits <= 0){
        return NextResponse.json({message: "Invalid Kit Count"},{status: 400});
    }
    const student = await Details.findOne({ Mobile : data.Mobile });
    console.log(student);
    await Details.updateOne({ Mobile: data.Mobile }, { $set: { Delivered: data.Kits } });
    return NextResponse.json(student);
}