
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
  returnedAt?: Date;

};

// Some attributes are optional in `Lend.build` and `Lend.create` calls
interface LendCreationAttributes extends Optional<LendAttributes, "id"> { };

class Lend extends Model<LendAttributes, LendCreationAttributes>

  implements LendAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
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
    returnedAt: {
      type: new DataTypes.INTEGER,
      allowNull: false,
    },

  },
  {
    tableName: "lends",
    sequelize, // passing the `sequelize` instance is required
    underscored : true
  }
);


export default Lend;