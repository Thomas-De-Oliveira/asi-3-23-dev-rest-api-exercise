import BaseModel from "./BaseModel.js"
import RelNavPageModel from "./RelNavPageModel.js"

class NavigationModel extends BaseModel {
  static tableName = "navigation"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static relationMappings() {
    return {
      rel_nav_page: {
        relation: BaseModel.HasManyRelation,
        modelClass: RelNavPageModel,
        join: {
          from: "navigation.id",
          to: "rel_nav_page.navId",
        },
      },
    }
  }
}

export default NavigationModel
