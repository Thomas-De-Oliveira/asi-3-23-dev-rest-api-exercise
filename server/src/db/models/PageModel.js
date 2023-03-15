import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"
import RelPageUserModel from "./RelPageUserModel.js"
import RelNavPageModel from "./RelNavPageModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static modifiers = {
    paginate: (query, limit, page) =>
      query.limit(limit).offset((page - 1) * limit),
  }

  static relationMappings() {
    return {
      users: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.creator",
          to: "users.id",
        },
      },
      rel_page_user: {
        relation: BaseModel.HasManyRelation,
        modelClass: RelPageUserModel,
        join: {
          from: "pages.id",
          to: "rel_page_user.pageId",
        },
      },
      rel_nav_page: {
        relation: BaseModel.HasManyRelation,
        modelClass: RelNavPageModel,
        join: {
          from: "pages.id",
          to: "rel_nav_page.pageId",
        },
      },
    }
  }
}

export default PageModel
