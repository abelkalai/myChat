import { useState} from "react";

export const useFieldInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

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

