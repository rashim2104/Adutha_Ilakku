import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';
import Joi from "joi";

const schema = Joi.object({
  Name: Joi.string().required(),
  DOB: Joi.date().required(),
  Mobile: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
  Class: Joi.string().required(),
  Group: Joi.string().allow(""),
  Parents: Joi.number().integer().min(0).required(),
  ClassOther: Joi.string().allow(""),
  GroupOther: Joi.string().allow(""),
  Delivered : Joi.number().integer().min(0).required(),
});

export async function POST(req) {
  await connectMongoDB();
  const data = await req.json();
  console.log(data);
  try {
    const { error } = schema.validate(data);
    if (error) {
      throw new Error(`Invalid data: ${error.details[0].message}`);
    }
    // Mob Num Check
    const mobile = await Details.findOneAndUpdate({ Mobile: data.Mobile },{ $set: { Name: data.Name, DOB: data.DOB, Class: data.Class, Group: data.Group, Parents: data.Parents, ClassOther: data.ClassOther, GroupOther: data.GroupOther,Delivered:data.Delivered } });
    return NextResponse.json({ status: 200}, {message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
