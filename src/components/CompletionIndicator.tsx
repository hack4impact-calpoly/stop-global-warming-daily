import React from "react";
import { Check } from "lucide-react";
import Style from "../styles/CompletionIndicator.module.css";

interface CompeletionIndicatorProps {
  completed: boolean;
}

export default function CompeletionIndicator({ completed }: CompeletionIndicatorProps) {
  return (
    <div className={completed ? Style.completionIndicatorCompleted : Style.completionIndicatorInProgress}>
      <span className={Style.completionIndicatorText}>{completed ? "Completed" : "In progress"}</span>
      <div className={Style.completionIndicatorIcon}>
        {completed ? <Check className={Style.completionCheckIcon} /> : <></>}
      </div>
    </div>
  );
}
