import NextLink from "next/link"
import clsx from "clsx"

const Link = (props) => {
  const { className, ...otherProps } = props

  return (
    <NextLink {...otherProps} className={clsx("hover:underline", className)} />
  )
}

export default Link
