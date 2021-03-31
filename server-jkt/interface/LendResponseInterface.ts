
export interface BookSample {
    id : string,
    lendable: boolean, 
    location: string,
    bookId: number,
    createdAt: Date,
    updatedAt: Date,

}
export interface BookSampleWithLend extends BookSample{
    Lends : Array<LendInterface>,
    Lend? : LendInterface,
    Book : Book
}
export interface BookSamplesJKT extends BookSample{
    Lend: LendInterface,
    Book: Book
}

export interface UserResponseJKT {
    id: number,
    name: string,
    email: string,
    isAdmin: boolean,
    createdAt: Date,
    updatedAt: Date,
    BookSamples: Array<BookSamplesJKT>
}

export interface LendInterface {
    id: number,
    returnedAt?: Date,
    bookSampleId: string,
    userId: number,
    createdAt: Date,
    updatedAt: Date,
}
export interface LendResponseBDG extends LendInterface {
    BookSample:  BookSample
}

export interface BookWithBokSampleAndLend extends Book{
    BookSample : Array<BookSampleWithLend>
}

export interface Book {
    id: number,
    title: string,
    publisher: string,
    coverUrl: string,
    author: string,
    createdAt: Date,
    updatedAt: Date
}

export interface UserLendResponseUniversal {
    id: number,
    name: string,
    email: string,
    isAdmin: boolean,
    createdAt: Date,
    updatedAt: Date,
    BookSamples : Array<BookSampleWithLend>

}