
import {
  Model,
  Optional,
} from "sequelize";

// These are all the attributes in the Book model
interface BookAttributes {
  id: number;
  title: string;
  publisher : string;
};

// Some attributes are optional in `Book.build` and `Book.create` calls
interface BookCreationAttributes extends Optional<BookAttributes, "id"> {};

class Book extends Model<BookAttributes, BookCreationAttributes>

  implements BookAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public title!: string;
  public publisher! : string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

export default Book;