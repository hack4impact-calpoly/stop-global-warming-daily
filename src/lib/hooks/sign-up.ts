import { useContext } from "react";
import { NewUserFormContext } from "../context/sign-up";

export const useNewUserFormContext = () => {
  const context = useContext(NewUserFormContext);
  if (!context) {
    throw new Error("useNewPropertyFormContext must be used within a NewUserFormContextProvider");
  }

  return context;
};
