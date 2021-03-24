import {Sequelize,DataTypes} from 'sequelize'

class Connection {
  
  static  db : Sequelize;
  constructor(host : String , username : String, password : String, port : String, dbName : String) {
    Connection.db = new Sequelize(
      `postgres://${username}:${password}@${host}:${port}/${dbName}`
    );
  }

  static getOrmObject() : Sequelize {
    return Connection.db;
  }

  async testConnection() {
    try {
      await Connection.db.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}



export default Connection