import React from "react";
import Styles from "./MultipleImages.module.css";

function MultipleImages(props) {
  return (
    <>
      <div className={` ${Styles.item} ${props.Style} ${props.CustomStyles}`}>
        <div className={`${Styles.text}`}>
          <div className={`${props.TextStyle} pt-9 font-bold text-3xl`}>
            {props.Title}
            <div className={`${props.Content} `}>
              <div
                className="duration text-sm font-normal"
                style={{ fontFamily: "Gotham" }}
              >
                {props.Date}
              </div>
              <div className={`type ${props.TypeStyle} `}>
                {props.Type}
                <span
                  className="font-bold text-xl"
                  style={{ fontFamily: "Gotham" }}
                >
                  {props.Price}
                </span>
              </div>
            </div>
            <div>
              <button
                type="button"
                className={` mb-3  ${props.Btn}`}
                style={{ fontFamily: "Gotham" }}
              >
                Book Now
              </button>
              <div
                className="text-sm text-justify pr-6"
                style={{ fontFamily: "Gotham" }}
              >
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde
                quae quis possimus eaque ducimus? Fugiat nam commodi enim
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MultipleImages;
