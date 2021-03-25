
import User from './User';
import Book from './Book';
import BookSample from './BookSample';
import Lend from './Lend';
import sequelize from 'database/sequelize';



export const syncrhonize = async function () {
    sequelize.sync({ force: true })
    // Here we associate which actually populates out pre-declared `association` static and other methods.
    BookSample.belongsToMany(User, {
        through: Lend,
    });

    // Here we associate which actually populates out pre-declared `association` static and other methods.
    User.belongsToMany(BookSample, {
        through: Lend,
    });


    Book.belongsTo(BookSample);

    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
}