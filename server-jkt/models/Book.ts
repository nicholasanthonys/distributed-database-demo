
import sequelize from "database/sequelize";
import {
  Model,
  Optional,
  DataTypes
} from "sequelize";

import BookSample from "./BookSample";


// These are all the attributes in the Book model
interface BookAttributes {
  id: Number;
  title: String;
  publisher : String;
};

// Some attributes are optional in `Book.build` and `Book.create` calls
interface BookCreationAttributes extends Optional<BookAttributes, "id"> {};

class Book extends Model<BookAttributes, BookCreationAttributes>

  implements BookAttributes {
  public id!: Number; // Note that the `null assertion` `!` is required in strict mode.
  public title!: String;
  public publisher! : String;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : true
    },
    publisher: {
      type: DataTypes.STRING,
    },
    
  },
  {
    tableName: "books",
    sequelize, // passing the `sequelize` instance is required
  }
);


export default Book
