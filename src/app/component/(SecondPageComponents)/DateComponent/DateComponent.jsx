"use client";
import React from "react";
import styles from "@/app/about/page.module.css";
const DateComponent = (props) => {
  return (
    <>
      <div
        className={`${styles.dateWidth} flex-shrink-0 border-2 border-grey-200 p-3 rounded-lg`}
      >
        <div className="pb-2 font-bold text-sm">
          {props.DepDate} - {props.ArrDate}
        </div>
        <div className="text-sm justify-center flex">
          {props.Currency} {props.Price}
        </div>
      </div>
    </>
  );
};

export default DateComponent;
