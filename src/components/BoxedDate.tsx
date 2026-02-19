import React from "react";
import Style from "../styles/BoxedDate.module.css";

interface BoxedDateProps {
  date: Date;
}

export default function BoxedDate({ date }: BoxedDateProps) {
  const dayAbbr = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const dayNum = date.getDate();
  return (
    <div className={Style.boxedDateContainer}>
      <span className={Style.boxedDateDay}>{dayAbbr}</span>
      <span className={Style.boxedDateNum}>{dayNum}</span>
    </div>
  );
}
