import Button from "@/components/ui/Button.jsx"
import { useFormikContext } from "formik"

const SubmitButton = (props) => {
  const { children = "SUBMIT", ...otherProps } = props
  const { isSubmitting, isValid } = useFormikContext()

  return (
    <Button
      type="submit"
      className="px-4 py-4"
      disabled={isSubmitting || !isValid}
      {...otherProps}
    >
      {children}
    </Button>
  )
}

export default SubmitButton
