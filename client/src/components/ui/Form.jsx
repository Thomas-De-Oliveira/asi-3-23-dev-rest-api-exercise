import clsx from "clsx"
import { Form as FormikForm } from "formik"

const Form = (props) => {
  const { className, ...otherProps } = props

  return (
    <FormikForm
      {...otherProps}
      className={clsx("p-3 flex flex-col gap-4 mx-auto", className)}
    />
  )
}

export default Form
