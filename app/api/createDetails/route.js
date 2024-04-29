import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from '@/models/details';
import Joi from "joi";
import { useBarcode } from 'next-barcode';

const barCodeGen = (data) => { 
    const { inputRef } = useBarcode({
      value: data,
      options: {
        background: "#ffffff",
        width: 2,
        height: 60,
      },
    });
    return <svg ref={inputRef} />;
  
}

const schema = Joi.object({
  Name: Joi.string().required(),
  DOB: Joi.date().required(),
  Mobile: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
  Class: Joi.string().valid("XI", "XII", "Others").required(),
  Group: Joi.string().valid("PCMB", "PCMC", "COMM", "Other").required(),
  Parents: Joi.number().integer().min(0).required(),
  ClassOther: Joi.string().when("Class", {
    is: "Others",
    then: Joi.required(),
  }),
  GroupOther: Joi.string().when("Group", { is: "Other", then: Joi.required() }),
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
    const mobile = await Details.findOne({ Mobile: data.Mobile });
    if (mobile) {
      throw new Error("Mobile number already exists");
    }
    const count = await Details.countDocuments();
    // Create Data
    const newData = new Details({
      ...data,
      ae_id: `LMES${(count + 1).toString().padStart(4, "0")}`,
    });
    await newData.save();
    return NextResponse.json({ status: 200, message: `LMES${(count + 1).toString().padStart(4, "0")}` });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
