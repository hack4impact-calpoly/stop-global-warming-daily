import React from "react";
import Style from "./TaskCard.module.css";

interface TaskCardProps {
  title: string;
  date: Date | string;
  points: number;
  description: string;
}

/*
    IMPORTANT:
        - When dates are fetched from the database using JSON.stringify(), they will be converted into their string representations
*/

/**
    Author: Julian Labbe
    Date: 1/26/26

    Purpose: 
        - TaskCard provides the layout/organzation for the individual components that make up the card's details
    @param title Title for the specific task
    @param date Date or string for the specific task (see IMPORTANT comment block for more details)
    @param points The number of points the user will gain from completing the task
    @param description A brief description for the specific task
*/
export default function TaskCard({ title, date, points, description }: TaskCardProps) {
  return <></>;
}
