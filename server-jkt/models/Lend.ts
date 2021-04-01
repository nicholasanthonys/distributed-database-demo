
import {
  DataTypes,
  Model,
  Optional,
  Sequelize
} from "sequelize";


import sequelize from "database/sequelize";
import BookSample from "./BookSample";
import User from "./User";
// These are all the attributes in the Lend model
interface LendAttributes {
  id: number;
  returnedAt?: Date;
  bookSampleId: string;
  userId : number
};

// Some attributes are optional in `Lend.build` and `Lend.create` calls
interface LendCreationAttributes extends Optional<LendAttributes, "id"> { };

class Lend extends Model<LendAttributes, LendCreationAttributes>

  implements LendAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public returnedAt?: Date;
  public bookSampleId!: string;
  public userId!  : number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Lend.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    returnedAt: {
      type: new DataTypes.DATE,
      allowNull: true,
    },
    bookSampleId: {
      type: DataTypes.UUID,
      allowNull: false,
    } ,
    userId : {
      type : DataTypes.INTEGER,
      allowNull : false,
    }

  },
  {
    tableName: "lends",
    sequelize, // passing the `sequelize` instance is required
    underscored: true
  }
);


// User.belongsToMany(BookSample, { through: Lend })
// BookSample.belongsToMany(User, { through: Lend })

export default Lend;