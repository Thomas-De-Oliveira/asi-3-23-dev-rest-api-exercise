import BaseModel from "./BaseModel.js"
import FormModel from "./FormModel.js"

class FieldModel extends BaseModel {
  static tableName = "fields"

  static relationMappings() {
    return {
      forms: {
        relation: BaseModel.HasManyRelation,
        modelClass: FormModel,
        join: {
          from: "fields.id",
          through: {
            from: "rel_form_fields.fieldId",
            to: "rel_form_fields.formId",
          },
          to: "forms.id",
        },
      },
    }
  }
}

export default FieldModel
