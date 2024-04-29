import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';

export async function POST(req){
    await connectMongoDB();
    const fullRecord = await Details.find();
    return NextResponse.json(fullRecord);
}