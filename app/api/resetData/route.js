import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';

export async function POST(req){
    await connectMongoDB();
    try{
    const data = await req.json();
    if(data.key !== 'reset@SAIRAM'){
        return NextResponse.json({message: "Invalid Key"}, {status : 400});
    }
    const fuk = await Details.deleteMany({});
    
    return NextResponse.json({message: "Reset Success!"}, {status : 200});
}catch(e){
    return NextResponse.json({message: `An error occurred: ${e}`}, {status : 500});
}
}