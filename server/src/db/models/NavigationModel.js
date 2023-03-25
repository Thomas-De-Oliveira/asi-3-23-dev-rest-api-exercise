import BaseModel from "./BaseModel.js"
import PageModel from "./PageModel.js"

class NavigationModel extends BaseModel {
  static tableName = "navigation"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static get relationMappings() {
    return {
      pages: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: PageModel,
        join: {
          from: "navigation.id",
          through: {
            from: "rel_nav_pages.navId",
            to: "rel_nav_pages.pageId",
          },
          to: "pages.id",
        },
      },
    }
  }
}

export default NavigationModel
