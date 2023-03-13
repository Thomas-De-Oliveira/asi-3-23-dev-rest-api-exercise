import Form from "@/components/ui/Form.jsx"
import FormField from "@/components/ui/FormField.jsx"
import SubmitButton from "@/components/ui/SubmitButton.jsx"
import { Field, Formik } from "formik"
import * as yup from "yup"

const validationSchema = yup.object().shape({
  firstName: yup.string().min(1).required().label("First name"),
  lastName: yup.string().min(1).required().label("Last name"),
  email: yup.string().min(1).required().label("E-mail"),
  roleId: yup.string().ensure().required(),
})

const defaultInitialValues = {
  firstName: "",
  lastName: "",
  email: "",
  roleId: "",
}

const UserFormEdit = (props) => {
  const {
    className,
    initialValues = defaultInitialValues,
    roles,
    ...otherProps
  } = props

  return (
    <Formik
      {...otherProps}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      <Form className={className}>
        <FormField name="firstName" label="First name" />
        <FormField name="lastName" label="Last name" />
        <FormField name="email" label="E-mail" />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Role</span>
          <Field as="select" name="roleId">
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Field>
        </label>
        <SubmitButton>SUBMIT</SubmitButton>
      </Form>
    </Formik>
  )
}

export default UserFormEdit
