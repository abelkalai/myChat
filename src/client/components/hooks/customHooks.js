import { useState, useEffect } from "react";

export const useFieldInput = () => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const manualChange = (value) => {
    setValue(value);
  };

  const clear = () => {
    setValue("");
  };

  return {
    value,
    onChange,
    manualChange,
    clear,
  };
};

export const useActiveElement = () => {
  const [value, setValue] = useState(document.activeElement.id);

  const onChange = (event) => {
    setValue(document.activeElement.id);
  };

  const addEventListener = () => {
    return document.addEventListener("focusin", onChange);
  };

  return { value, addEventListener};
};
