import React from "react";
import BoxedDate from "./BoxedDate";
import Divider from "./Divider";
import CompeletionIndicator from "./CompletionIndicator";
import Style from "../styles/TaskCard.module.css";

interface TaskCardProps {
  date: Date; // Date for the task
  title: String; // Title of the task
  description: String; // Brief description for the task
  minEstimate: Number; // Estimated number of minutes to complete the task
  completed: boolean; // Has the task been marked as completed or not
}

export default function TaskCard({ date, title, description, minEstimate, completed }: TaskCardProps) {
  return (
    <div className={Style.taskCardContainer}>
      <BoxedDate date={date} />
      <div className={Style.taskCardDetailsContainer}>
        <span className={Style.taskCardTitle}>{title}</span>
        <Divider>
          <span className={Style.taskCardEstimate}>{`~${minEstimate} min`}</span>
          <CompeletionIndicator completed={completed} />
        </Divider>
        <p className={Style.taskCardDescription}>{description}</p>
      </div>
    </div>
  );
}
