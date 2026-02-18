import React from "react";
import BoxedDate from "./BoxedDate";
import Divider from "./Divider";
import Style from "../styles/TaskCard.module.css";

interface TaskCardProps {
  date: Date; // Date for the task
  title: String; // Title of the task
  minEstimate: Number; // Estimated number of minutes to complete the task
}

export default function TaskCard({ date, title, minEstimate }: TaskCardProps) {
  return (
    <div className={Style.taskCardContainer}>
      <BoxedDate date={date} />
      <div className={Style.taskCardDetailsContainer}>
        <span className={Style.taskCardTitle}>{title}</span>
        <Divider>
          <span className={Style.taskCardEstimate}>{`~${minEstimate} min`}</span>
        </Divider>
      </div>
    </div>
  );
}
