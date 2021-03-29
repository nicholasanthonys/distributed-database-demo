
import sequelize from "database/sequelize";
import { HasManyAddAssociationsMixin, HasManyCreateAssociationMixin, HasManyRemoveAssociationMixin } from "sequelize";
import {
  Model,
  Optional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasOneCreateAssociationMixin
} from "sequelize";

import BookSample from "./BookSample";


// These are all the attributes in the Book model
interface BookAttributes {
  id: string;
  title: String;
  publisher: String;
  coverUrl: String;
  author: String;
  
};

// Some attributes are optional in `Book.build` and `Book.create` calls
interface BookCreationAttributes extends Optional<BookAttributes, "id"> { 
};

class Book extends Model<BookAttributes, BookCreationAttributes>

  implements BookAttributes {
  public id!: string; // Note that the `null assertion` `!` is required in strict mode.
  public title!: String;
  public publisher!: String;
  public coverUrl!: String;
  public author!: String;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public addBookSample!: HasManyAddAssociationMixin<BookSample,number>;
  public removeBookSample!: HasManyRemoveAssociationMixin<BookSample,number>;
}

Book.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    publisher: {
      type: DataTypes.STRING,
    },
    coverUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    }

  },
  {
    tableName: "books",
    sequelize, // passing the `sequelize` instance is required
    underscored: true
  }
);

export default Book
