import Form from "@/components/ui/Form.jsx"
import SubmitButton from "@/components/ui/SubmitButton.jsx"
import { Field, Formik } from "formik"
import * as yup from "yup"

const validationSchema = yup.object().shape({
  content: yup.string().min(1).required().label("Content"),
})

const defaultInitialValues = {
  content: "",
}

const PageForm = (props) => {
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
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Content</span>
          <Field as="textarea" className="pb-28 border" name="content" />
        </label>
        <SubmitButton>SUBMIT</SubmitButton>
      </Form>
    </Formik>
  )
}

export default PageForm
