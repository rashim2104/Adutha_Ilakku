import Form from "@/components/Form";
import Image from "next/image";

export default function Register() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Student Education Expo Registration
                </h1>
                <p className="text-gray-600">
                  Fill out the form below to register for the upcoming academic year.
                </p>
              </div>
              <div className="mb-6 p-4 rounded-full bg-[#000]">
                <Image
                  src="/image/sairam_logo.svg"
                  alt="Sairam Logo"
                  width={120}
                  height={120}
                  className="w-24 h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl border border-gray-200">
          <Form />
        </div>
      </div>
    </div>
  );
}