import React from "react";
import { Circle, CircleCheck } from "lucide-react";
import Style from "./TaskCard.module.css";

export interface TaskCardProps {
  title: string;
  description: string;
  isCompleted: boolean;
}
const STROKE_WIDTH = 2.5;
const ICON_SIZE = 50;

/**
    Author: Julian Labbe
    Date: 1/26/26

    Purpose: 
        - TaskCard provides the layout/organzation for the individual components that make up the card's details
    @param title Title for the specific task
    @param description A brief description for the specific task
    @param isCompleted A boolean flag that represents the status of the task (completed vs. not completed)
*/
export default function TaskCard({ title, description, isCompleted }: TaskCardProps) {
  return (
    <div className={isCompleted ? Style.taskCardCompleted : Style.taskCardNotCompleted}>
      <div className={Style.taskCardContainer}>
        <div className={Style.taskCardDetails}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {isCompleted ? (
          <CircleCheck className={Style.taskCardIcon} />
        ) : (
          <Circle strokeWidth={STROKE_WIDTH} size={ICON_SIZE} />
        )}
      </div>
    </div>
  );
}
