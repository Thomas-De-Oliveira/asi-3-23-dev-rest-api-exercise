import BaseModel from "./BaseModel.js"
import RelFormFieldModel from "./RelFormFieldModel.js"

class FieldModel extends BaseModel {
  static tableName = "fields"

  static relationMappings() {
    return {
      rel_form_field: {
        relation: BaseModel.HasManyRelation,
        modelClass: RelFormFieldModel,
        join: {
          from: "fields.id",
          to: "rel_form_fields.fieldId",
        },
      },
    }
  }
}

export default FieldModel
