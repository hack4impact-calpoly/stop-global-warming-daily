import React from "react";
import Style from "../styles/Divider.module.css";

interface DividerProps {
  children: React.ReactNode;
}

export default function DividerProps({ children }: DividerProps) {
  const items = React.Children.toArray(children);

  return (
    <div className={Style.dividerContainer}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {item}
          {idx < items.length - 1 && <span className={Style.dividerBar}> | </span>}
        </React.Fragment>
      ))}
    </div>
  );
}
