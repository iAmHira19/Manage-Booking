"use client";
import React from "react";
import { Select, Button } from "antd";
import { useState, useEffect } from "react";
import { usePriorityApi } from "@/utils/getPriority";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { useRouter } from "next/navigation";
import setSavePriorityData from "@/services/setPriorityData";
import toast from "react-hot-toast";

const Page = () => {
  const { isSignedIn } = useSignInContext();
  const router = useRouter();
  const { getPriorityApi } = usePriorityApi();
  const [pageloading, setPageLoading] = useState(true);
  const [dataToSave, setDataToSave] = useState([]);
  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setPageLoading(false);
    }
  }, [isSignedIn]);

  const [apiResponse, setApiResponse] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await getPriorityApi();
        setApiResponse(response);
        setDataToSave(response);
        const uniqueGdsCodes = new Set();
        response.forEach((category) => {
          category.lstGDS.forEach((gds) => {
            uniqueGdsCodes.add(gds.tpGDS_CODE);
          });
        });
        setColumns([...uniqueGdsCodes]);
      } catch (error) {
        console.log("Error: ", error.message);
      }
    };
    fetchData();
  }, []);

  if (pageloading) {
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

  return (
    <>
      <div className="flex w-full gap-1 justify-center py-10 mx-auto">
        <div className=" w-[900px] flex items-center flex-col px-5">
          <h2 className="text-xl md:text-3xl font-semibold mb-2 text-orange-500">
            Priority Setup
          </h2>
          <div className="table mt-3">
            <table className="border-collapse border border-slate-400">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="!px-2 !py-1 border border-slate-400 w-32 text-sm">
                    Priority
                  </th>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className="!px-2 !py-1 border border-slate-400 w-44 text-sm"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="!px-2 !py-1 border border-slate-400 w-44 text-sm">
                    Lowest Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiResponse.map((category, catIndex) => (
                  <tr key={catIndex}>
                    <td
                      className="py-1 border border-slate-400 text-center text-xs sm:text-sm"
                      onClick={() => console.log("api response: ", apiResponse)}
                    >
                      {category.tpCATEGORYNAME}
                    </td>
                    {columns.map((col, index) => {
                      let columnVal = category.lstGDS.find(
                        (item) => item.tpGDS_CODE === col
                      );
                      return (
                        <td
                          key={index}
                          className="border border-slate-400 text-sm priority"
                        >
                          {category.lstGDS?.some(
                            (gds) => gds.tpGDS_CODE === col
                          ) ? (
                            <Select
                              className="w-full rounded-none border-none outline-none text-center appearance-none"
                              value={columnVal.tp_SORTORDER}
                              onChange={(value) => {
                                let data = category.lstGDS.map((item) => {
                                  if (item.tpGDS_CODE === col) {
                                    return { ...item, tp_SORTORDER: value };
                                  }
                                  return item;
                                });
                                let otherItems = apiResponse.filter(
                                  (item) =>
                                    item.tpCATEGORYCODE !=
                                    category.tpCATEGORYCODE
                                );
                                let record = { ...category, lstGDS: data };
                                let allData = [...otherItems, record].sort(
                                  (a, b) => a.tpCATEGORYCODE - b.tpCATEGORYCODE
                                );
                                setApiResponse(allData);
                              }}
                              placeholder="Please Select an option"
                              options={[
                                { value: "1", label: "1" },
                                { value: "2", label: "2" },
                                { value: "3", label: "3" },
                                { value: "4", label: "4" },
                                { value: "5", label: "5" },
                              ]}
                            />
                          ) : null}
                        </td>
                      );
                    })}
                    <td className="text-center py-1 border border-slate-400 text-sm">
                      <input
                        type="checkbox"
                        checked={category.tpCATEGORYPRICEORDER == 1}
                        onChange={(e) => {
                          let data = category;
                          data = {
                            ...data,
                            tpCATEGORYPRICEORDER: e.target.checked ? "1" : "0",
                          };
                          let otherItems = apiResponse.filter(
                            (item) =>
                              item.tpCATEGORYCODE != category.tpCATEGORYCODE
                          );
                          let record = [...otherItems, data];
                          setApiResponse(
                            record.sort(
                              (a, b) => a.tpCATEGORYCODE - b.tpCATEGORYCODE
                            )
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full flex justify-center mt-10 mb-3 gap-2">
              <Button
                className="!bg-orange-500 !text-white"
                onClick={async () => {
                  let resp = await setSavePriorityData(apiResponse);
                  toast.success(resp);
                }}
              >
                Save
              </Button>
              <Button
                className="!bg-orange-500 !text-white"
                onClick={() => setApiResponse(dataToSave)}
              >
                Undo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
