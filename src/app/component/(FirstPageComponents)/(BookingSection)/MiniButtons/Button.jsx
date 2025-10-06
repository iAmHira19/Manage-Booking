import React from "react";
import styles from "./Button.module.css";
const Button = (props) => {
  return (
    <button
      className={`${
        styles.fbtn
      } font-gotham font-light w-full md:w-auto md:py-1 border-2 ${
        props.Class ? styles.active : ""
      }`}
      onClick={props.onClick}
    >
      {props.Text}
    </button>
  );
};

export default Button;
