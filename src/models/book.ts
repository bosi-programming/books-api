/**
 * Book model module
 * @module models/book
 */
import { Model, model, Document, Schema } from 'mongoose';

export interface IBook {
  _id?: string;
  title: string;
  author: string;
  description: string;
}

interface BookDocument extends Document {
  title: string;
  author: string;
  description: string;
}

interface BookModel extends Model<BookDocument> {}

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export class Book {
  static model = model<BookDocument, BookModel>('Book', bookSchema);

  /**
   * Builds a Book
   *
   * @param attr - {@link IBook }
   */
  static build(attr: IBook): BookDocument {
    return new this.model(attr);
  }

  /**
   * Find a Book by id
   *
   * @param _id - string
   */
  static async findByById(_id: string): Promise<BookDocument | null> {
    return await this.model.findOne({ _id }).exec();
  }

  /**
   * Builds a new book and save
   * @param attr
   */
  static async createBook(attr: IBook): Promise<BookDocument | null> {
    const newBook = this.build(attr);
    return await newBook.save();
  }

  /**
   * Deletes a book
   * @param _id - string
   */
  static async deleteById(_id: string) {
    return await this.model.deleteOne({ _id });
  }

  /**
   * Searches for a book on the Google API
   */
  static async list(page: number = 1) {
    return await this.model.find({}, null, { limit: 10, skip: (page - 1) * 10 }).exec();
  }

  /**
   * Searches for a book on the Google API
   */
  static async searchBookByTitle(title: string, page: number = 1) {
    return await this.model.find({ title: new RegExp(title, 'i') }, null, { limit: 10, skip: (page - 1) * 10 }).exec();
  }
}
