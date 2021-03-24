
import {
  DataTypes,
  Model,
  Optional,
  Sequelize
} from "sequelize";


import sequelize from "database/sequelize";
// These are all the attributes in the Lend model
interface LendAttributes {
  id: number;
  userId: number;
  bookSampleId: number;
  returnedAt?: Date;

};

// Some attributes are optional in `Lend.build` and `Lend.create` calls
interface LendCreationAttributes extends Optional<LendAttributes, "id"> { };

class Lend extends Model<LendAttributes, LendCreationAttributes>

  implements LendAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public userId!: number;
  public bookSampleId!: number;
  public returnedAt?: Date;


  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Lend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    bookSampleId: {
      type: DataTypes.INTEGER,
    },
    returnedAt: {
      type: new DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },

  },
  {
    tableName: "lends",
    sequelize, // passing the `sequelize` instance is required
  }
);


export default Lend;