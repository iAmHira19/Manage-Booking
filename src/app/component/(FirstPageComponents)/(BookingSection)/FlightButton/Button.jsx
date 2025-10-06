import React from "react";
import styles from "./Button.module.css";
const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick && props.onClick}
      className={`bg-orange-500 text-white text-xs sm:text-sm md:text-xl flex justify-center items-center ${
        props.width
      } max-w-full gap-1 py-3 ${props.PYSM} ${
        props.PYXL
      } px-1 md:py-auto md:px-1 ${styles.borderRadius} ${
        props.Class ? styles.active : ""
      } font-gotham font-[400] text-nowrap`}
    >
      <span>{props.Icon && props.Icon}</span>
      {props.Text && props.Text}
    </button>
  );
};

export default Button;
