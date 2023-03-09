import BaseModel from "./BaseModel.js"
import FormModel from "./FormModel.js"
import FieldModel from "./FieldModel.js"

class RelFormFieldModel extends BaseModel {
  static tableName = "rel_form_fields"

  static relationMappings() {
    return {
      forms: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: FormModel,
        join: {
          from: "rel_form_fields.formId",
          to: "forms.id",
        },
      },
      fields: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: FieldModel,
        join: {
          from: "rel_form_fields.fieldId",
          to: "fields.id",
        },
      },
    }
  }
}

export default RelFormFieldModel
