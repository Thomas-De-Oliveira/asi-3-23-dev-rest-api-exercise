import BaseModel from "./BaseModel.js"
import RelFormFieldModel from "./RelFormFieldModel.js"

class FormModel extends BaseModel {
  static tableName = "forms"

  static relationMappings() {
    return {
      rel_form_field: {
        relation: BaseModel.HasManyRelation,
        modelClass: RelFormFieldModel,
        join: {
          from: "forms.id",
          to: "rel_form_fields.formId",
        },
      },
    }
  }
}

export default FormModel
