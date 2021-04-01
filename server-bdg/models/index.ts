
import BookSample from './BookSample';
import Lend from './Lend';
import sequelize from 'database/sequelize';



export const syncrhonize = async function () {
    // //  uncomment this will drop and recreate related table which model is changes
    // await sequelize.sync({ force: true });
    BookSample.hasMany(Lend, {
        foreignKey: {
            name: "book_sample_id",
        },
        constraints: true
    })

    Lend.belongsTo(BookSample, {
        foreignKey: {
            name: 'book_sample_id',
            allowNull: false
        },
        constraints: true
    });

    // uncomment this will drop and recreate related table which model is changes
    // await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
}