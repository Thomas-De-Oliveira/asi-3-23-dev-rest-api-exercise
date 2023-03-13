import clsx from "clsx"
import { useField } from "formik"

const FormField = (props) => {
  const { className, label, name, placeholder, ...otherProps } = props
  const [field, { touched, error }] = useField({ name })

  return (
    <label className={clsx("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium">{label}</span>
      <input
        className="px-3 py-1.5 border"
        {...field}
        placeholder={placeholder ?? label}
        {...otherProps}
      />
      {touched && error ? (
        <span className="text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  )
}

export default FormField
