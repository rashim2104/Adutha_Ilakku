"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function UpdateForm(props) {
    const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
        Name: props.Name,
        DOB: new Date(props.DOB).toISOString().split('T')[0],
        Mobile: props.Mobile,
        Class: props.Class,
        Group: props.Group,
        Parents: props.Parents,
        ClassOther: props.ClassOther,
        GroupOther: props.GroupOther,
        Delivered: props.Delivered,
    },
  });
  const [loading, setLoading] = useState(false);

  const classValue = watch("Class");
  const groupValue = watch("Group");

  const onSubmit = async (data) => {
    setLoading(true);
    let respData;
    try {
      const response = await fetch("/api/updateDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      respData = await response.json();
      if (response.ok) {
        alert("Form Updated successfully");
        router.replace("/dash-panel");
        reset();
      } else {
        alert(respData.message);
      }
    } catch (error) {
      console.error("Failed to submit form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">
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
        <label htmlFor="dob">
          DOB<span className="required">*</span>
        </label>
        <input
          className="input"
          type="date"
          {...register("DOB", { required: "This field is required" })}
        />
        {errors.DOB && <p className="required text-sm">{errors.DOB.message}</p>}

        {/* Mobile Number Input */}
        <label htmlFor="mobile">
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
        <label>
          Class<span className="required">*</span>
        </label>
        <label>
          <input
            type="radio"
            value="XI"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          XI
        </label>
        <label>
          <input
            type="radio"
            value="XII"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          XII
        </label>
        <label>
          <input
            type="radio"
            value="Other"
            {...register("Class", { required: "This field is required" })}
          />{" "}
          Others
        </label>
        {classValue === "Others" && (
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

        {/* Group Radio Input */}
        <label>
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

        {/* No of parents Input */}
        <label htmlFor="parents">
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
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </>
  );
}
