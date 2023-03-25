import BaseModel from "./BaseModel.js"
import FieldModel from "./FieldModel.js"

class FormModel extends BaseModel {
  static tableName = "forms"

  static relationMappings() {
    return {
      fields: {
        relation: BaseModel.HasManyRelation,
        modelClass: FieldModel,
        join: {
          from: "forms.id",
          through: {
            from: "rel_form_fields.formId",
            to: "rel_form_fields.fieldId",
          },
          to: "fields.id",
        },
      },
    }
  }
}

export default FormModel
