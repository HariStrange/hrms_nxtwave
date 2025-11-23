import { Label } from "@radix-ui/react-label";
import React, { type FC } from "react";
import { Input } from "./ui/input";

interface InputComponentProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const InputComponent: FC<InputComponentProps> = ({ label, ...props }) => {
  return (
    <div>
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
};

export default InputComponent;
