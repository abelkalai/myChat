import {useState} from 'react'

export const fieldInput = () => {
    const [value, setValue] = useState("")
  
    const onChange = (event) => {
      setValue(event.target.value)
    }

    const clear = ()=>{
        setValue("")
    }
  
    return {
      value,
      onChange,
      clear
    }
  }