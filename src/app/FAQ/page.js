"use client";
import { useState } from "react";
import faqs from "@/utils/FAQData";
import styles from "./faqs.module.css";

export default function Page() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <h2
        className={`text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-gotham text-center py-5 md:py-6 text-orange-500`}
      >
        Frequently Asked Questions (FAQ&apos;s)
      </h2>
      <br />

      {faqs.map((faq, index) => (
        <div key={index} className={styles.faqItem}>
          <button
            className={`${styles.faqButton} text-sm md:text-base lg:text-lg xl:text-xl font-gotham font-normal`}
            onClick={() => toggle(index)}
          >
            {faq.question}
            <span
              className={`${styles.icon} text-sm md:text-base lg:text-lg xl:text-xl font-gotham font-normal`}
            >
              {openIndex === index ? "▲" : "▼"}
            </span>
          </button>
          <div
            className={`${styles.answerWrapper} ${
              openIndex === index ? styles.active : ""
            }`}
          >
            <div
              className={`${styles.answer} text-justify text-base font-gotham font-light`}
            >
              {faq.answer}
            </div>
          </div>
        </div>
      ))}

      <p
        className={`${styles.backToTop} text-orange-500 font-normal font-gotham cursor-pointer`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </p>
    </div>
  );
}
