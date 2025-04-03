"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Select from "react-select";

export default function Form({ eventId, isDisabled }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Name: "",
      Mobile: "",
      DOB: "",
      Class: "",
      Group: "",
      GroupOther: "",
      Community: "",
      Board: "",
      BoardOther: "",
      District: "",
      SchoolName: "",
      ClassXMark: "",
      ClassXIIHallTicket: "",
      PhysicsMark: "",
      ChemistryMark: "",
      MathsMark: "",
      CutoffMark: "",
      CareerChoice: "",
      CareerChoiceOther: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const classValue = watch("Class");
  const boardValue = watch("Board");
  const groupValue = watch("Group");
  const physicsValue = watch("PhysicsMark");
  const chemistryValue = watch("ChemistryMark");
  const mathsValue = watch("MathsMark");
  const districtValue = watch("District");
  const careerChoiceValue = watch("CareerChoice");

  // Districts list
  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", 
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", 
    "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", 
    "Kanniyakumari", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram", 
    "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni", 
    "Thiruvallur", "Thiruvarur", "Thoothukudi", "Tiruchirappalli", 
    "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvannamalai", 
    "The Nilgiris", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  // Calculate cutoff whenever marks change
  useEffect(() => {
    if (classValue === "Class XII" && physicsValue && chemistryValue && mathsValue) {
      const cutoff = Number(mathsValue) + (Number(physicsValue) / 2) + (Number(chemistryValue) / 2);
      setValue("CutoffMark", cutoff);
    }
  }, [physicsValue, chemistryValue, mathsValue, setValue, classValue]);

  // Fetch schools when district changes
  useEffect(() => {
    if (districtValue) {
      fetchSchools(districtValue);
    }
  }, [districtValue]);

  // Convert schools to options format when schools change
  useEffect(() => {
    if (schools && schools.length > 0) {
      const options = schools.map(school => ({
        value: school.schoolName,
        label: school.schoolName
      }));
      setSchoolOptions(options);
    } else {
      setSchoolOptions([]);
    }
  }, [schools]);

  const fetchSchools = async (district) => {
    try {
      const response = await fetch(`/api/getSchools?district=${district}`);
      const data = await response.json();
      if (response.ok) {
        setSchools(data.schools || []);
      } else {
        console.error("Failed to fetch schools:", data.message);
        setSchools([]);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      setSchools([]);
    }
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      backgroundColor: 'white',
      borderColor: '#e5e7eb',
      borderRadius: '0.375rem',
      '&:hover': {
        borderColor: '#a3a3a3'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
      color: 'black',
      padding: '8px 12px',
      '&:active': {
        backgroundColor: '#e5e7eb'
      },
      cursor: 'pointer'
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'white',
      zIndex: 50,
      color: 'black'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999
    }),
    input: (base) => ({
      ...base,
      color: 'black'
    }),
    singleValue: (base) => ({
      ...base,
      color: 'black'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6b7280'
    })
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Always include eventId if provided
      if (eventId) {
        data.eventId = eventId;
        data.location = eventId; // Use eventId as location
      } else {
        data.location = districtValue; // Fallback to district if no eventId
      }
      
      const response = await fetch("/api/createDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const respData = await response.json();
      if (response.ok) {
        toast.success("Form submitted successfully");
        setReferenceId(respData.id);
        setIsSubmitted(true);
      } else {
        toast.error(respData.message);
      }
    } catch (error) {
      console.error("Failed to submit form", error);
      toast.error("Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-lg text-gray-600 mb-6">Thank you for registering.</p>
            <div className="rounded-lg p-4 inline-block">
              <p className="text-gray-600">Your Reference ID:</p>
              <p className="text-2xl font-bold text-blue-600">{referenceId}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8"></h1>
      
      {eventId && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
          <p className="font-semibold text-blue-700">Registering for event: {eventId}</p>
          {isDisabled && (
            <p className="text-red-600 mt-2">Registration is closed as the event has ended.</p>
          )}
        </div>
      )}
      
      <form 
        className="bg-white rounded-lg p-6 md:p-8" 
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Personal Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 pb-2 border-b border-gray-200 mb-4">
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                Student Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register("Name", { required: "This field is required" })}
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-600">{errors.Name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="mobile" className="block font-medium text-gray-700 mb-1">
                Mobile Number<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                type="tel"
                {...register("Mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9",
                  },
                })}
              />
              {errors.Mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.Mobile.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dob" className="block font-medium text-gray-700 mb-1">
                Date of Birth<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                type="date"
                {...register("DOB", { required: "This field is required" })}
              />
              {errors.DOB && (
                <p className="mt-1 text-sm text-red-600">{errors.DOB.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 pb-2 border-b border-gray-200 mb-4">
            Academic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Class<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-x-4 md:space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-blue-600"
                    value="Class X"
                    {...register("Class", { required: "Please select a class" })}
                  />
                  <span className="ml-2">Class X</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-blue-600"
                    value="Class XI"
                    {...register("Class", { required: "Please select a class" })}
                  />
                  <span className="ml-2">Class XI</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-blue-600"
                    value="Class XII"
                    {...register("Class", { required: "Please select a class" })}
                  />
                  <span className="ml-2">Class XII</span>
                </label>
              </div>
              {errors.Class && (
                <p className="mt-1 text-sm text-red-600">{errors.Class.message}</p>
              )}
            </div>

            {/* Group Selection for XI and XII */}
            {(classValue === "Class XI" || classValue === "Class XII") && (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Group<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    {...register("Group", { required: "Please select your group" })}
                  >
                    <option value="">Select Group</option>
                    <option value="PCMB">Physics/Chemistry/Math/Biology</option>
                    <option value="PCMC">Physics/Chemistry/Math/Computer Science</option>
                    <option value="COMM">Commerce</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.Group && (
                    <p className="mt-1 text-sm text-red-600">{errors.Group.message}</p>
                  )}
                </div>
                
                {groupValue === "Other" && (
                  <div>
                    <label htmlFor="groupOther" className="block font-medium text-gray-700 mb-1">
                      Specify Group<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      {...register("GroupOther", {
                        required: "Please specify your group",
                      })}
                    />
                    {errors.GroupOther && (
                      <p className="mt-1 text-sm text-red-600">{errors.GroupOther.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Board Selection */}
            <div>
              <label htmlFor="board" className="block font-medium text-gray-700 mb-1">
                Board<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register("Board", { required: "Please select your board" })}
              >
                <option value="">Select Board</option>
                <option value="State Board">State Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="Other">Other</option>
              </select>
              {errors.Board && (
                <p className="mt-1 text-sm text-red-600">{errors.Board.message}</p>
              )}
            </div>
            
            {boardValue === "Other" && (
              <div>
                <label htmlFor="boardOther" className="block font-medium text-gray-700 mb-1">
                  Specify Board<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register("BoardOther", {
                    required: "Please specify your board",
                  })}
                />
                {errors.BoardOther && (
                  <p className="mt-1 text-sm text-red-600">{errors.BoardOther.message}</p>
                )}
              </div>
            )}

            {/* Community Selection */}
            <div>
              <label htmlFor="community" className="block font-medium text-gray-700 mb-1">
                Community<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register("Community", { required: "Please select your community" })}
              >
                <option value="">Select Community</option>
                <option value="OC">OC</option>
                <option value="BC">BC</option>
                <option value="BCM">BCM</option>
                <option value="MBC">MBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="SCA">SCA</option>
              </select>
              {errors.Community && (
                <p className="mt-1 text-sm text-red-600">{errors.Community.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 pb-2 border-b border-gray-200 mb-4">
            Location Information
          </h2>
          
          <div className="space-y-4">
            {/* District Selection */}
            <div>
              <label htmlFor="district" className="block font-medium text-gray-700 mb-1">
                District<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register("District", { required: "Please select your district" })}
              >
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </select>
              {errors.District && (
                <p className="mt-1 text-sm text-red-600">{errors.District.message}</p>
              )}
            </div>

            {/* School Selection */}
            <div>
              <label htmlFor="schoolName" className="block font-medium text-gray-700 mb-1">
                School Name<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="w-full">
                <Controller
                  name="SchoolName"
                  control={control}
                  rules={{ required: "Please select or enter a school name" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={schoolOptions}
                      styles={customSelectStyles}
                      isClearable
                      isSearchable
                      placeholder="Type to search for schools or enter manually"
                      noOptionsMessage={({ inputValue }) => 
                        !districtValue 
                          ? "Please select a district first" 
                          : inputValue 
                            ? "No schools found. You can continue typing to enter a new school name" 
                            : "Type to search for schools"
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption ? selectedOption.value : '');
                      }}
                      onInputChange={(inputValue, { action }) => {
                        if (action === "input-change") {
                          field.onChange(inputValue);
                        }
                      }}
                      value={field.value ? { value: field.value, label: field.value } : null}
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                      className="w-full text-black"
                      classNamePrefix="school-select"
                    />
                  )}
                />
              </div>
              {errors.SchoolName && (
                <p className="mt-1 text-sm text-red-600">{errors.SchoolName.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Career Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 pb-2 border-b border-gray-200 mb-4">
            Career Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                What are you willing to pursue?<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register("CareerChoice", { required: "Please select your career choice" })}
              >
                <option value="">Select Career Choice</option>
                <option value="Engineering">Engineering</option>
                <option value="Medicine">Medicine</option>
                <option value="Arts & Science">Arts & Science</option>
                <option value="Other">Other</option>
              </select>
              {errors.CareerChoice && (
                <p className="mt-1 text-sm text-red-600">{errors.CareerChoice.message}</p>
              )}
            </div>
            
            {careerChoiceValue === "Other" && (
              <div>
                <label htmlFor="careerChoiceOther" className="block font-medium text-gray-700 mb-1">
                  Specify Career Choice<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register("CareerChoiceOther", {
                    required: "Please specify your career choice",
                  })}
                />
                {errors.CareerChoiceOther && (
                  <p className="mt-1 text-sm text-red-600">{errors.CareerChoiceOther.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Academic Records Section */}
        {(classValue === "Class XI" || classValue === "Class XII") && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-700 pb-2 border-b border-gray-200 mb-4">
              Academic Records
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="classXMark" className="block font-medium text-gray-700 mb-1">
                  Class X Mark (out of 500)<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  min="0"
                  max="500"
                  {...register("ClassXMark", {
                    required: "Please enter your Class X mark",
                    min: {
                      value: 0,
                      message: "Mark cannot be less than 0",
                    },
                    max: {
                      value: 500,
                      message: "Mark cannot be more than 500",
                    },
                  })}
                />
                {errors.ClassXMark && (
                  <p className="mt-1 text-sm text-red-600">{errors.ClassXMark.message}</p>
                )}
              </div>

              {classValue === "Class XII" && groupValue && (groupValue === "PCMB" || groupValue === "PCMC") && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="classXIIHallTicket" className="block font-medium text-gray-700 mb-1">
                      Class XII Hall Ticket Number<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      {...register("ClassXIIHallTicket", {
                        required: "Please enter your Hall Ticket Number",
                      })}
                    />
                    {errors.ClassXIIHallTicket && (
                      <p className="mt-1 text-sm text-red-600">{errors.ClassXIIHallTicket.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Expected Marks (out of 100)<span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="physicsMark" className="block text-sm font-medium text-gray-700 mb-1">Physics</label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          type="number"
                          min="0"
                          max="100"
                          {...register("PhysicsMark", {
                            required: "Required",
                            min: 0,
                            max: 100,
                          })}
                        />
                      </div>
                      <div>
                        <label htmlFor="chemistryMark" className="block text-sm font-medium text-gray-700 mb-1">Chemistry</label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          type="number"
                          min="0"
                          max="100"
                          {...register("ChemistryMark", {
                            required: "Required",
                            min: 0,
                            max: 100,
                          })}
                        />
                      </div>
                      <div>
                        <label htmlFor="mathsMark" className="block text-sm font-medium text-gray-700 mb-1">Mathematics</label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          type="number"
                          min="0"
                          max="100"
                          {...register("MathsMark", {
                            required: "Required",
                            min: 0,
                            max: 100,
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {(physicsValue || chemistryValue || mathsValue) && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-bold text-blue-700">Calculated Cutoff: {watch("CutoffMark")}</p>
                      <p className="text-sm text-gray-600">Formula: Mathematics + (Physics/2) + (Chemistry/2)</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            className={`w-full py-3 px-6 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            }`}
            type="submit"
            disabled={loading || isDisabled}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : isDisabled ? (
              "Registration Closed"
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
