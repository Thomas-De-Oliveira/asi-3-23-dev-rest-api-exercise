import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"
import PageModel from "./PageModel.js"

class RelPageUserModel extends BaseModel {
  static tableName = "rel_page_user"

  static relationMappings() {
    return {
      users: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "rel_page_user.userId",
          to: "users.id",
        },
      },
      pages: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PageModel,
        join: {
          from: "rel_page_user.pageId",
          to: "pages.id",
        },
      },
    }
  }
}

export default RelPageUserModel
