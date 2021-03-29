
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
  id: number;
  location: string;
  lendable: boolean;
};

// Some attributes are optional in `BookSample.build` and `BookSample.create` calls
interface BookSampleCreationAttributes extends Optional<BookSampleAttributes, "id"> { };

class BookSample extends Model<BookSampleAttributes, BookSampleCreationAttributes>

  implements BookSampleAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public location!: string;
  public lendable!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public setBook!: BelongsToManyAddAssociationMixin<Book, number>
}

BookSample.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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


  },
  {
    tableName: "book_samples",
    sequelize, // passing the `sequelize` instance is required
    underscored: true,
  }
);




export default BookSample;