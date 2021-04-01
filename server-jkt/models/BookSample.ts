
import sequelize from "database/sequelize";
import {
  Model,
  Optional,

  DataTypes,
  BelongsToCreateAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from "sequelize";
import Book from "./Book";




// These are all the attributes in the BookSample model
interface BookSampleAttributes {
  id: string;
  location: string;
  lendable: boolean;
  bookId: Number;

};

// Some attributes are optional in `BookSample.build` and `BookSample.create` calls
interface BookSampleCreationAttributes extends Optional<BookSampleAttributes, "id"> { };

class BookSample extends Model<BookSampleAttributes, BookSampleCreationAttributes>

  implements BookSampleAttributes {
  public id!: string; // Note that the `null assertion` `!` is required in strict mode.
  public location!: string;
  public lendable!: boolean;
  public bookId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public setBook!: BelongsToManyAddAssociationMixin<Book, number>
}

BookSample.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    lendable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    location: {
      type: new DataTypes.STRING,
      allowNull: false
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull : false
    }

  },
  {
    tableName: "book_samples",
    sequelize, // passing the `sequelize` instance is required
    underscored: true,
  }
);




export default BookSample;