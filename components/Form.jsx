"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import QrCode from "./QrCode";
import { toast } from "sonner";

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm(
    {
      defaultValues: {
        Name: "",
        DOB: "",
        Mobile: "",
        Class: "",
        Group: "-",
        Parents: 0,
        ClassOther: "",
        GroupOther: "",
      },
    }
  );
  const [loading, setLoading] = useState(false);
  const [isDownload, setIsDownload] = useState("");

  const classValue = watch("Class");
  const groupValue = watch("Group");

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    let respData;
    try {
      const response = await fetch("/api/createDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      respData = await response.json();
      if (response.ok) {
        toast.success("Form submitted successfully");
        console.log(respData.message);
        setIsDownload(respData.message);
        reset();
      } else {
        toast.error(respData.message);
      }
    } catch (error) {
      console.error("Failed to submit form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='text-4xl font-bold mt-4 mb-10'>Registration Form</h1>
      { isDownload === "" && (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label className="font-bold" htmlFor="name">
          Student Name<span className="required">*</span>
        </label>
        <input
          className="input"
          {...register("Name", { required: "This field is required" })}
        />
        {errors.Name && (
          <p className="required text-sm">{errors.Name.message}</p>
        )}

        {/* DOB Input */}
        <label className="font-bold" htmlFor="dob">
          DOB<span className="required">*</span>
        </label>
        <input
          className="input"
          type="date"
          {...register("DOB", { required: "This field is required" })}
        />
        {errors.DOB && <p className="required text-sm">{errors.DOB.message}</p>}

        {/* Mobile Number Input */}
        <label className="font-bold" htmlFor="mobile">
          Mobile Number<span className="required">*</span>
        </label>
        <input
          className="input"
          type="tel"
          {...register("Mobile", {
            required: "This field is required",
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: "Invalid phone number",
            },
          })}
        />
        {errors.Mobile && (
          <p className="required text-sm">{errors.Mobile.message}</p>
        )}

        {/* Class Radio Input */}
        <label className="font-bold">
          Class<span className="required">*</span>
        </label>
        <label>
          <input
            type="radio"
            value="Class 9"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          Class 9
        </label>
        <label>
          <input
            type="radio"
            value="Class 10"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          Class 10
        </label>
        <label>
          <input
            type="radio"
            value="Class 11"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          Class 11
        </label>
        <label>
          <input
            type="radio"
            value="Class 12"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          Class 12
        </label>
        <label>
          <input
            type="radio"
            value="Other"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          Others
        </label>
        {classValue === "Other" && (
          <>
            <span className="">
              Please Specify<span className="required">*</span>
            </span>
            <input
              className="input"
              {...register("ClassOther", {
                required: "This field is required",
              })}
            />
          </>
        )}
        {errors.Class && (
          <p className="required text-sm">{errors.Class.message}</p>
        )}
        {errors.ClassOther && (
          <p className="required">{errors.ClassOther.message}</p>
        )}

        {(classValue === "Class 11" || classValue === "Class 12") && (
          <>
          {/* Group Radio Input */}
        <label className="font-bold">
          Group<span className="required">*</span>
        </label>
        <label>
          <input
            type="radio"
            value="PCMB"
            {...register("Group", { required: "This field is required" })}
          />{" "}
          Phy/Chem/Math/Bio
        </label>
        <label>
          <input
            type="radio"
            value="PCMC"
            {...register("Group", { required: "This field is required" })}
          />{" "}
          Phy/Chem/Math/CS
        </label>
        <label>
          <input
            type="radio"
            value="COMM"
            {...register("Group", { required: "This field is required" })}
          />{" "}
          Commerce
        </label>
        <label>
          <input
            type="radio"
            value="Other"
            {...register("Group", { required: "This field is required" })}
          />{" "}
          Other
        </label>
        {groupValue === "Other" && (
          <>
            <span className="">
              Please Specify<span className="required">*</span>
            </span>
            <input
              className="input"
              {...register("GroupOther", {
                required: "This field is required",
              })}
            />
          </>
        )}
        {errors.Group && (
          <p className="required text-sm">{errors.Group.message}</p>
        )}
        {errors.GroupOther && (
          <p className="required text-sm">{errors.GroupOther.message}</p>
        )}
          </>
        )}

        {/* No of parents Input */}
        <label className="font-bold" htmlFor="parents">
          No of parents accompanied<span className="required">*</span>
        </label>
        <input
          min={0}
          className="input"
          type="tel"
          {...register("Parents", { required: true, min: 0 })}
        />
        {errors.Parents && (
          <p className="required text-sm">{errors.Parents.message}</p>
        )}

        <button
          id="submit-btn"
          className="button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      )}
      {isDownload !== "" && (
        <div className="h-[46.5vh] pt-16 w-full">
        <center>{isDownload !== "" && <QrCode data={isDownload} />}</center>
      </div>  
      )}
    </>
  );
}
