import Form from "@/components/ui/Form.jsx"
import FormField from "@/components/ui/FormField.jsx"
import SubmitButton from "@/components/ui/SubmitButton.jsx"
import { Formik } from "formik"
import * as yup from "yup"

const validationSchema = yup.object().shape({
  name: yup.string().min(1).required().label("Name"),
})

const defaultInitialValues = {
  name: "",
}

const NavForm = (props) => {
  const {
    className,
    initialValues = defaultInitialValues,
    ...otherProps
  } = props

  return (
    <Formik
      {...otherProps}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      <Form className={className}>
        <FormField name="name" label="Name" />
        <SubmitButton>SUBMIT</SubmitButton>
      </Form>
    </Formik>
  )
}

export default NavForm
