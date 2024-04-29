import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';

export async function POST(req){
    await connectMongoDB();
    try{
        const data = await req.json();
        const fullRecord = await Details.findOne({Mobile : data.Mobile});
        if(!fullRecord){
            return NextResponse.json({message: "Student not found"},{status : 400});
        }
        return NextResponse.json({fullRecord},{status : 200});
    }catch(e){
        return NextResponse.json({message: `An error occurred: ${e}`},{status : 500});
    }
}