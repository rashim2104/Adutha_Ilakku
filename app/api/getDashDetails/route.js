import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';

export async function POST(req){
    await connectMongoDB();
    try{
        const fullRecord = await Details.find();
        return NextResponse.json({fullRecord},{status : 200});
    }catch(e){
        return NextResponse.json({message: `An error occurred: ${e}`},{status : 500});
    }
}