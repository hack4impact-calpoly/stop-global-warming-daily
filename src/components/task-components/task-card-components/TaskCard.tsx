import React from "react";
import Style from "./TaskCard.module.css";

interface TaskCardProps {
  title: string;
  date: Date;
  points: number;
  description: string;
}

/**
    Author: Julian Labbe
    Date: 1/26/26

    Purpose: TaskCard provides the layout/organzation for the individual components that make up the card's details
    @param title Title for the specific task
    @param date Date for the specific task
    @param points The number of points the user will gain from completing the task
    @param description A brief description for the specific task
*/
export default function TaskCard({ title, date, points, description }: TaskCardProps) {
  return <></>;
}
