import AppContext from "@/components/AppContext.jsx"
import Page from "@/components/Pages.jsx"
import Form from "@/components/ui/Form.jsx"
import FormField from "@/components/ui/FormField.jsx"
import SubmitButton from "@/components/ui/SubmitButton.jsx"
import routes from "@/routes.js"
import { Formik } from "formik"
import { useRouter } from "next/router.js"
import { useCallback, useContext } from "react"
import * as yup from "yup"

const initialValues = {
  email: "",
  password: "",
}

const validationSchema = yup.object().shape({
  email: yup.string().email().required().label("E-mail"),
  password: yup.string().min(8).required().label("Password"),
})

const SignInPage = () => {
  const router = useRouter()
  const { signIn } = useContext(AppContext)
  const handleSubmit = useCallback(
    async (values) => {
      await signIn(values)

      router.push(routes.home())
    },
    [signIn, router]
  )

  return (
    <Page>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        <Form>
          <FormField name="email" type="email" label="E-mail" />
          <FormField name="password" type="password" label="Password" />
          <SubmitButton />
        </Form>
      </Formik>
    </Page>
  )
}

SignInPage.isPublic = true

export default SignInPage
