import {
  Association,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
  DataTypes,
  Sequelize
} from "sequelize";
import BookSample from "./BookSample";

import sequelize from "database/sequelize";
import Lend from "./Lend";
// These are all the attributes in the User model
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, "id"> { };

class User extends Model<UserAttributes, UserCreationAttributes>

  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  public email!: string;
  public password!: string;
  public isAdmin!: boolean

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getBookSamples!: HasManyGetAssociationsMixin<BookSample>
  public addBookSample!: HasManyAddAssociationMixin<BookSample, number>;
  public hasBookSample!: HasManyHasAssociationMixin<BookSample, number>;
  public countBookSamples!: HasManyCountAssociationsMixin;
  public createBookSample!: HasManyCreateAssociationMixin<BookSample>;
  public getLends! : HasManyGetAssociationsMixin<Lend>

  // public static associations: {
  //   bookSamples: Association<User, BookSample>;
  // };

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
 
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      
    }
  },
  {
    tableName: "users",
    sequelize, // passing the `sequelize` instance is required
    underscored: true,
    defaultScope: {
      // exclude password from select : https://stackoverflow.com/questions/27972271/sequelize-dont-return-password
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] },
      },
      withPassword : {
        attributes: {include :  ["password"] },
      }
    }

  }
  
);



export default User;