import BookSample from "models/BookSample";
import { error } from "node:console";
import ApiService from "utils/ApiService";

class BookSampleController {
    constructor() { }

    async getCurrentSite(authorization: any, bookId?: string) {
        var bookSamples: Array<BookSample> = [];
        if (bookId) {
            try {
                bookSamples = await BookSample.findAll({
                    where: {
                        bookId
                    }
                });
                return bookSamples

            } catch (error) {

                return error
            }
        }
        return await BookSample.findAll()
    }

    async getBandung(authorization: any, bookId: string | null,) {
        try {
            ApiService.init(process.env.SITE_URL_BDG!, authorization)
            let response = await ApiService.get('/book-sample', {
                bookId, location
            });

            // bandung
            return response.data
        } catch (error) {
            return error

        }
    }

    async getByBookId(bookId: string) {
        try {
            let bookSample = await BookSample.findAll({
                where: {
                    bookId
                }
            });
            return bookSample;
        } catch (error) {
            return error;
        }
    }

    async getById(id: string) {
        try {
            let bookSample = await BookSample.findByPk(id);
            return bookSample;
        } catch (error) {
            return error;
        }
    }
}

export default BookSampleController;