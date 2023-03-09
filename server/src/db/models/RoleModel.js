import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"
import PermissionModel from "./RoleModel.js"

class RoleModel extends BaseModel {
  static tableName = "roles"

  static relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: UserModel,
        join: {
          from: "roles.id",
          to: "users.roleId",
        },
      },
      permission: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PermissionModel,
        join: {
          from: "roles.permissionId",
          to: "permissions.id",
        },
      },
    }
  }
}

export default RoleModel
