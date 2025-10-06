import React from "react";
import MultipleImages from "../MultipleImagesAB/MultipleImages";
import Styles from "./multiImages.module.css";

const MultipleImageCall = () => {
  return (
    <div
      className={`${Styles.container} grid grid-cols-4 grid-rows-3 gap-5 p-5`}
    >
      <MultipleImages
        CustomStyles={Styles.item1}
        TextStyle="mb-10"
        Btn="inline-block mt-4 w-11/12 mx-3 text-lg rounded-3xl bg-blue-500 p-3"
        Title="Kuwait"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal pl-56"
        Content="flex items-center"
        Style="h-80 flex justify-center p-1 col-start-1 col-end-3 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item2}
        TextStyle=""
        Btn="inline-block mt-4 w-11/12      text-lg rounded-3xl bg-blue-500 p-3"
        Title="Narobi"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal"
        Style="h-80 flex justify-center p-1 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item3}
        TextStyle=""
        Btn="inline-block mt-4 w-11/12      text-lg rounded-3xl bg-blue-500 p-3"
        Title="UAE"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal"
        Style="h-80 flex justify-center p-1 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item4}
        TextStyle=""
        Btn="inline-block mt-4 w-11/12      text-lg rounded-3xl bg-blue-500 p-3"
        Title="KSA"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal"
        Style="h-80 flex justify-center p-1 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item5}
        TextStyle=""
        Btn="inline-block mt-4 w-11/12      text-lg rounded-3xl bg-blue-500 p-3"
        Title="London"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal"
        Style="h-80 flex justify-center p-1 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item6}
        TextStyle="mb-10"
        Btn="inline-block mt-4 w-11/12 mx-3 text-lg rounded-3xl bg-blue-500 p-3"
        Title="Sweden"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal pl-56"
        Content="flex items-center"
        Style="h-80 flex justify-center p-1 col-start-3 col-end-5 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item7}
        TextStyle="mb-10"
        Btn="inline-block mt-4 w-11/12 mx-3 text-lg rounded-3xl bg-blue-500 p-3"
        Title="Denmark"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal pl-56"
        Content="flex items-center"
        Style="h-80 flex justify-center p-1 col-start-1 col-end-3 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item8}
        TextStyle=""
        Btn="inline-block mt-4 w-11/12      text-lg rounded-3xl bg-blue-500 p-3"
        Title="Finland"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal"
        Style="h-80 flex justify-center p-1 rounded-3xl"
      ></MultipleImages>
      <MultipleImages
        CustomStyles={Styles.item9}
        TextStyle=""
        Btn="inline-block mt-4 w-11/12      text-lg rounded-3xl bg-blue-500 p-3"
        Title="India"
        Date="5 Days 4 Nights"
        Type="Economy from"
        Price=" Rs 124343"
        TypeStyle="text-lg font-normal"
        Style="h-80 flex justify-center p-1 rounded-3xl"
      ></MultipleImages>
    </div>
  );
};

export default MultipleImageCall;
