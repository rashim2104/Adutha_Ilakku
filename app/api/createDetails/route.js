import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Details } from "@/models/details";
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
});

export async function POST(req) {
  await connectMongoDB();
  const data = await req.json();
  const sampleID = "AICLGROPXXXX";

  let newID = "AICLGROPXXXX";

  // Replace CL with class number or XX
  if (data.Class === "Class 12") {
    newID = newID.replace("CL", "12");
  } else if (data.Class === "Class 11") {
    newID = newID.replace("CL", "11");
  } else if (data.Class === "Class 10") {
    newID = newID.replace("CL", "10");
  } else if (data.Class === "Class 9") {
    newID = newID.replace("CL", "09");
  } else {
    newID = newID.replace("CL", "XX");
  }

  // Replace GROP with group code
  if (data.Group === "PCMB") {
    newID = newID.replace("GROP", "PCMB");
  } else if (data.Group === "PCMC") {
    newID = newID.replace("GROP", "PCMC");
  } else if (data.Group === "COMM") {
    newID = newID.replace("GROP", "COMM");
  } else {
    newID = newID.replace("GROP", "OTHE");
  }

  // Replace XXXX with student count + 1
  const studentCount = await Details.countDocuments(); // Replace "Student" with your actual model name
  const newCount = String(studentCount + 1).padStart(4, "0");
  newID = newID.replace("XXXX", newCount);

  console.log(newID);

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

    // Create Data
    const newData = new Details({
      ...data,
      ae_id: newID,
    });
    await newData.save();
    return NextResponse.json(
      { message: newID },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
