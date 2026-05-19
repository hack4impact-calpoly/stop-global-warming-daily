import { UserFormData } from "@/types/user";
import { createContext, useState } from "react";

// Context interface shape
export interface UserContextProps {
  user: UserFormData | null;
  updateUserData: (user: Partial<UserFormData>) => void;
  step: number;
  updateStep: (step: number) => void;
}

//Context definition
export const NewUserFormContext = createContext<UserContextProps | null>({
  user: null,
  updateUserData: () => null,
  step: 0,
  updateStep: () => null,
});

// Context provider
export function UserFormContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserFormData | null>(null);
  const [step, setStep] = useState<number>(0);

  const updateUserData = (values: Partial<UserFormData>) => {
    setUser(
      (prev) =>
        ({
          ...(prev || {}), // keep old data or initalize if null
          ...values, //update new data
        }) as UserFormData,
    );
  };

  const updateStep = (step: number) => {
    setStep(step);
  };

  //returns the user / step data and function to update data for shared data and updates
  return (
    <NewUserFormContext.Provider value={{ user, updateUserData, step, updateStep }}>
      {children}
    </NewUserFormContext.Provider>
  );
}
