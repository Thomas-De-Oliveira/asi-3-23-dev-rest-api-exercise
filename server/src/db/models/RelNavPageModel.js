import BaseModel from "./BaseModel.js"
import NavigationModel from "./NavigationModel.js"
import PageModel from "./PageModel.js"

class RelNavPageModel extends BaseModel {
  static tableName = "rel_nav_pages"

  static relationMappings() {
    return {
      navigation: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: NavigationModel,
        join: {
          from: "rel_nav_pages.navId",
          to: "navigation.id",
        },
      },
      pages: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PageModel,
        join: {
          from: "rel_nav_pages.pageId",
          to: "pages.id",
        },
      },
    }
  }
}

export default RelNavPageModel
