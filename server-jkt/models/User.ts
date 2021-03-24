import {
  Model,
  Optional,
} from "sequelize";

// These are all the attributes in the User model
interface UserAttributes {
  id: number;
  username: string;
  password: string ;
  isAdmin : boolean;
};

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {};

class User extends Model<UserAttributes, UserCreationAttributes>

  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public username!: string;
  public password!: string;
  public isAdmin! : boolean

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

export default User;