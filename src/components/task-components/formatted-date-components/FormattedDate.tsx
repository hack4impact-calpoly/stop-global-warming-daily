import React from "react";
import Style from "./FormattedDate.module.css";

interface FormattedDateProps {
  date: Date;
}

/**
    Author: Julian Labbe
    Date: 1/26/26

    Purpose: 
        - FormattedDate formats the provided date to match the following form: DAY_STRING, DAY_NUMBER
    @param date Date object to be formatted
*/
export default function FormattedDate({ date }: FormattedDateProps) {
  const dayStringAbbr = date.toLocaleDateString("en-US");
  const dayOfTheMonth = date.getDate();
  return (
    <div className={Style.formattedDateContainer}>
      <p>{`${dayStringAbbr}, ${dayOfTheMonth}${calculateOrdinalSuffix(dayOfTheMonth)}`}</p>
    </div>
  );
}

/*
    Author: Julian Labbe
    Date: 1/26/26

    Purpose: 
        - Calculate the suffix to add onto the day number, based on the number of the month
        - Will be one of the following: "st", "nd", "rd", "th" 
        - Any values ending with digits 1, 2, or 3 will have one of the fist 3 options (exception for 11, 12 and 13)
*/
function calculateOrdinalSuffix(dayOfTheMonth: number) {}
