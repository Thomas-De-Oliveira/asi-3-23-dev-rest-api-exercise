import BaseModel from "./BaseModel.js"
import PageModel from "./PageModel.js"
import RoleModel from "./RoleModel.js"
import RelPageUserModel from "./RelPageUserModel.js"
import hashPassword from "../hashPassword.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static relationMappings() {
    return {
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.roleId",
          to: "roles.id",
        },
      },
      pages: {
        relation: BaseModel.HasManyRelation,
        modelClass: PageModel,
        join: {
          from: "users.id",
          to: "pages.creator",
        },
      },
      rel_user_page: {
        relation: BaseModel.HasManyRelation,
        modelClass: RelPageUserModel,
        join: {
          from: "users.id",
          to: "rel_page_user.userId",
        },
      },
    }
  }

  checkPassword = async (password) => {
    const [passwordHash] = await hashPassword(password, this.passwordSalt)

    return passwordHash === this.passwordHash
  }
}

export default UserModel
