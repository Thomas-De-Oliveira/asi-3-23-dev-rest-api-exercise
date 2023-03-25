import * as yup from "yup"

// generic
export const stringValidator = yup.string()
export const idValidator = yup.number().integer().min(1)

// pages
export const titleValidator = yup
  .string()
  .min(1)
  .max(300)
  .label("Title invalide")
export const contentValidator = yup.string().min(1).label("Content invalide")
export const slugValidator = yup.string().min(1).max(50).label("Slug invalide")
export const statusValidator = yup
  .string()
  .min(1)
  .max(50)
  .default("published")
  .label("Status invalide")

// users
export const emailValidator = yup.string().email()
export const firstNameValidator = yup.string().min(1).max(100)
export const lastNameValidator = yup.string().min(1).max(200)
export const passwordValidator = yup
  .string()
  .min(8)
  .matches(
    /^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*[0-9])(?=.*[^0-9\p{Lu}\p{Ll}]).*$/gu,
    "Password must contain at least 1 upper & 1 lower case letters, 1 digit, 1 spe. character"
  )
  .label("Password")

// collection (pagination, order, etc.)
export const limitValidator = yup.number().integer().min(1).max(100).default(5)
export const pageValidator = yup.number().integer().min(1).default(1)
