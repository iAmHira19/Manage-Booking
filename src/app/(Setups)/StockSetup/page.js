"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { Input, DatePicker, Select, Checkbox, Form } from "antd";
import { useRouter } from "next/navigation";
import { useSignInContext } from "@/providers/SignInStateProvider";

const Page = () => {
  const router = useRouter();
  const { isSignedIn } = useSignInContext();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Stock Limit");

  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  if (loading) {
    return (
      <>
        <div className="min-w-screen min-h-screen flex items-center justify-center">
          <p className="text-4xl text-orange-500 font-gotham font-bold ">
            Loading...
          </p>
        </div>
      </>
    );
  }

  const dropdownFilters = (
    <div className="my-5">
      <Form layout="vertical" className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Form.Item label="Airline Name" className="mb-4">
            <Input className="w-full h-10" placeholder="Enter Airline Name" />
          </Form.Item>
          <Form.Item label="IATA Code" className="mb-4">
            <Input className="w-full h-10" placeholder="Enter IATA Code" />
          </Form.Item>
          <Form.Item label="Ticket Code" className="mb-4">
            <Input className="w-full h-10" placeholder="Enter Ticket Code" />
          </Form.Item>
          <Form.Item label="Perma. Stock" className="mb-4">
            <Input
              className="w-full h-10"
              placeholder="Enter Permanent Stock"
            />
          </Form.Item>
          <Form.Item label="Supp. Stock" className="mb-4">
            <Input className="w-full h-10" placeholder="Enter Supplier Stock" />
          </Form.Item>
          <div className="flex items-end mb-4">
            <button
              type="button"
              className="rounded-md bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 h-10 transition-colors duration-200 w-full sm:w-auto min-w-24"
            >
              ADD
            </button>
          </div>
        </div>
      </Form>
    </div>
  );

  const ResponsiveTable = () => (
    <div className="overflow-x-auto mt-4 border border-gray-300 rounded-lg">
      <div className="min-w-full">
        <table className="w-full border-collapse text-sm font-normal min-w-max">
          <thead>
            <tr>
              <th
                colSpan="4"
                className="bg-red-600 text-white border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm"
              >
                Ticket Info
              </th>
              <th
                colSpan="2"
                className="bg-blue-900 text-white border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm"
              >
                Tickets Stock
              </th>
              <th
                colSpan="2"
                className="bg-orange-500 text-white border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm"
              >
                Tickets Issued
              </th>
              <th
                colSpan="4"
                className="bg-gray-400 text-white border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm"
              >
                Remaining Stock
              </th>
            </tr>
            <tr className="bg-gray-100 font-normal">
              <th className="bg-red-600 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-12">
                Sr No
              </th>
              <th className="bg-red-600 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-20">
                Carrier
              </th>
              <th className="bg-red-600 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-16">
                IATA Code
              </th>
              <th className="bg-red-600 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-24">
                Ticketing Code
              </th>
              <th className="bg-blue-900 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-24">
                Permanent Stock
              </th>
              <th className="bg-blue-900 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-24">
                Supplementary Stock
              </th>
              <th className="bg-orange-500 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-24">
                Permanent Stock
              </th>
              <th className="bg-orange-500 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-24">
                Supplementary Stock
              </th>
              <th className="bg-gray-400 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-24">
                Permanent Stock
              </th>
              <th className="bg-gray-400 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-24">
                Supplementary Stock
              </th>
              <th className="bg-gray-400 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-16">
                Total
              </th>
              <th className="bg-gray-400 text-white border border-white px-1 sm:px-2 py-2 text-xs min-w-20">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{/* Add your table rows here */}</tbody>
        </table>
      </div>
    </div>
  );

  const tabs = [
    {
      name: "Stock Limit",
      content: (
        <>
          {dropdownFilters}
          <ResponsiveTable />
        </>
      ),
    },
    {
      name: "Credit Limit",
      content: <ResponsiveTable />,
    },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="w-full px-4 sm:px-7 py-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-blue-950 break-words">
              Carrier Stock
            </h2>
            <Input.Search
              placeholder="Search Carrier"
              allowClear
              enterButton="View All"
              size="large"
              className="border-blue-400 w-full"
            />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-4 sm:px-7 py-4">
        <Form layout="vertical" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item label="GDS" className="mb-4">
              <Input
                className="w-full h-10 border-blue-400"
                placeholder="Enter GDS"
              />
            </Form.Item>
            <Form.Item label="From" className="mb-4">
              <DatePicker
                className="w-full h-10 border-blue-400"
                placeholder="Select start date"
              />
            </Form.Item>
            <Form.Item label="To" className="mb-4">
              <DatePicker
                className="w-full h-10 border-blue-400"
                placeholder="Select end date"
              />
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Tabs Section */}
      <div className="px-4 py-4">
        {/* Tab Headers */}
        <div className="flex flex-wrap border-b border-gray-300 bg-gray-100 rounded-t-md overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-lg focus:outline-none transition-all whitespace-nowrap ${
                activeTab === tab.name
                  ? "bg-blue-900 text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="border-l border-r border-b border-gray-300 rounded-b-md">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`p-2 sm:p-4 ${
                activeTab === tab.name ? "block" : "hidden"
              }`}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4 break-words">
                {tab.name}
              </h3>
              <div className="w-full overflow-hidden">{tab.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
