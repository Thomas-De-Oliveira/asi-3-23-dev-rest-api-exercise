import Form from "@/components/ui/Form.jsx"
import FormField from "@/components/ui/FormField.jsx"
import SubmitButton from "@/components/ui/SubmitButton.jsx"
import { Field,Formik } from "formik"
import * as yup from "yup"

const validationSchema = yup.object().shape({
  title: yup.string().min(1).required().label("Title"),
  content: yup.string().min(1).required().label("Content"),
  slug: yup.string().min(1).required().label("Slug"),
  status: yup.string().ensure().required().label("Status"),
  navId: yup.string().ensure().required().label("Navigation hierarchie"),
})

const status = [{value: "published" ,name: "published"}, {value: "draft" ,name: "draft"}]

const defaultInitialValues = {
  title: "",
  content: "",
  slug: "",
  status: "",
  navId: ""
}

const PageForm = (props) => {
  const {
    className,
    initialValues = defaultInitialValues,
    navigation,
    ...otherProps
  } = props

  return (
    <Formik
      {...otherProps}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      <Form className={className}>
        <FormField name="title" variant="primary" label="Title" />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Content</span>
        <Field as="textarea" className="pb-28 border" name="content" />
        </label>
        <FormField name="slug" label="slug" />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Status</span>
          <Field as="select" name="status">
            {status.map((statu, index) => (
              <option  key={index} value={statu.value}>
                {statu.name}
              </option>
            ))}
          </Field>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Navigation hierarchie</span>
          <Field as="select" name="navId">
            {navigation.map((nav, index) => (
              <option  key={index} value={nav.id}>
                {nav.name}
              </option>
            ))}
          </Field>
        </label>
        <SubmitButton>SUBMIT</SubmitButton>
      </Form>
    </Formik>
  )
}

export default PageForm
