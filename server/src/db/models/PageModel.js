import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"
import NavigationModel from "./NavigationModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static relationMappings() {
    return {
      userCreator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.creator",
          to: "users.id",
        },
      },
      users: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: "pages.id",
          through: {
            from: "rel_page_user.pageId",
            to: "rel_page_user.userId",
          },
          to: "users.id",
        },
      },
      navigation: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: NavigationModel,
        join: {
          from: "pages.id",
          through: {
            from: "rel_nav_pages.pageId",
            to: "rel_nav_pages.navId",
          },
          to: "navigation.id",
        },
      },
    }
  }
}

export default PageModel
