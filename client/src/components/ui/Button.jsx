import clsx from "clsx"

const variants = {
  primary: "bg-primary active:bg-primary-dark disabled:bg-neutral text-white",
}

const Button = (props) => {
  const { variant = "primary",className, ...otherProps } = props

  return (
    <button
      className={clsx("px-3 py-2", variants[variant], className)}
      {...otherProps}
    ></button>
  )
}

export default Button
