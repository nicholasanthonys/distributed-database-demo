import Book from "models/Book";
import BookSample from "models/BookSample";

export interface InterfaceShowBookWithBookSample {
    Book : Book,
    BookSamples : Array<BookSample>
}