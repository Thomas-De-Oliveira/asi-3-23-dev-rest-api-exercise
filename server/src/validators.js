import * as yup from "yup"

// generic
export const stringValidator = yup.string()
export const idValidator = yup.number().integer().min(1)

// pages
export const titleValidator = yup.string().min(1).max(300)

export const contentValidator = yup.string().min(1)

// users
export const emailValidator = yup.string().email()

export const passwordValidator = yup.string().min(8)

// collection (pagination, order, etc.)
export const limitValidator = yup.number().integer().min(1).max(100).default(10)

export const pageValidator = yup.number().integer().min(1).default(1)
