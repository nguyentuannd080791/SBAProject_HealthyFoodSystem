import { useState } from 'react'

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }

  function handleBlur(event) {
    const { name } = event.target
    setErrors({ ...errors, [name]: validate(values)[name] })
  }

  function handleSubmit(onValid) {
    return (event) => {
      event.preventDefault()
      const foundErrors = validate(values)
      setErrors(foundErrors)
      if (Object.keys(foundErrors).length === 0) onValid(values)
    }
  }

  return { values, setValues, errors, handleChange, handleBlur, handleSubmit }
}
