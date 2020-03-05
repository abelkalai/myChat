import {useState} from 'react'

export const fieldInput = () => {
    const [value, setValue] = useState("s")
  
    const onChange = (event) => {
      setValue(event.target.value)
    }

    const clear=()=>{
        setValue("")
    }
  
    return {
      value,
      onChange,
      clear
    }
  }