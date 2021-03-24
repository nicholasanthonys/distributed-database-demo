
import {
  Model,
  Optional,
} from "sequelize";

// These are all the attributes in the BookSample model
interface BookSampleAttributes {
  id: number;
  title: string;
};

// Some attributes are optional in `BookSample.build` and `BookSample.create` calls
interface BookSampleCreationAttributes extends Optional<BookSampleAttributes, "id"> {};

class BookSample extends Model<BookSampleAttributes, BookSampleCreationAttributes>

  implements BookSampleAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public title!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

export default BookSample;