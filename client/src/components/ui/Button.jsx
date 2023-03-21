import clsx from "clsx"

const variants = {
  primary: "bg-slate-500 active:bg-slate-800 disabled:bg-neutral text-white",
}

const Button = (props) => {
  const { variant = "primary", className, ...otherProps } = props

  return (
    <button
      className={clsx(
        "px-4 py-4 rounded-lg text-lg",
        variants[variant],
        className
      )}
      {...otherProps}
    ></button>
  )
}

export default Button
