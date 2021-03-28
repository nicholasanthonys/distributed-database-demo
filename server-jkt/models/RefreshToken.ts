import {
    Model,
    Optional,
    DataTypes,
  } from "sequelize";
  
  import sequelize from "database/sequelize";
  // These are all the attributes in the RefreshToken model
  export interface RefreshTokenAttributes {
    id: Number;
    refreshToken: String;
  };
  
  // Some attributes are optional in `RefreshToken.build` and `RefreshToken.create` calls
  interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, "id"> { };
  
  class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  
    implements RefreshTokenAttributes {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public refreshToken!: string;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  
  
  }
  
  RefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    },
    {
      tableName: "refreshtokens",
      sequelize, // passing the `sequelize` instance is required
      underscored: true,
        
    }
  );
  
  
  
  export default RefreshToken;