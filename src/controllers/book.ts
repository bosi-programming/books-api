import express, { Request, Response } from 'express';
import axios from 'axios';

import { Book } from '../models/book';

const bookRouter = express.Router();

const searchBooks = async (title: string, page: number) => {
  const googleBooks: any = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=inname:${title}&startIndex=${
      (page - 1) * 10
    }&projection=lite&key=AIzaSyBfGUh7fFi78wNfYbmsM0p0SyIcrLTsv6c`,
  );
  const appBooks = await Book.searchBookByTitle(title, page);
  return [googleBooks.data.items, appBooks];
};

const listAllBooks = async (page: number) => {
  try {
    const googleBooks: any = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=lord&startIndex=${
        (page - 1) * 10
      }&projection=lite&key=AIzaSyBfGUh7fFi78wNfYbmsM0p0SyIcrLTsv6c`,
    );
    const appBooks = await Book.list();
    return [googleBooks.data.items, appBooks];
  } catch (e) {
    throw new Error(e);
  }
};

bookRouter.get('/api/book', async (req: Request, res: Response) => {
  const { title, page = 1 } = req.query;
  if (title && typeof title === 'string' && typeof page === 'number') {
    try {
      const books = await searchBooks(title, page);
      res.status(200).json({ books });
    } catch (e) {
      res.status(e.status | 400).json(e);
    }
  } else if (!title && typeof page === 'number') {
    try {
      const books = await listAllBooks(page);
      res.status(200).json({ books });
    } catch (e) {
      res.status(e.status | 400).json(e);
    }
  } else {
    res.status(400).json({ error: `Something is wrong on title: ${title} or page: ${page}` });
  }
});

bookRouter.get('/api/book/google/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const googleBook: any = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=AIzaSyBfGUh7fFi78wNfYbmsM0p0SyIcrLTsv6c`);
    res.json(googleBook.data);
  } catch (e) {
    res.status(404).json(e);
  }
});


bookRouter.get('/api/book/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    res.json(book);
  } catch (e) {
    res.status(404).json(e);
  }
});

bookRouter.post('/api/book', async (req: Request, res: Response) => {
  const { title, author, description } = req.body;
  try {
    const newBook = await Book.createBook({ title, author, description });
    res.status(200).json(newBook);
  } catch (e) {
    res.status(e.status).json(e);
  }
});

export default bookRouter;
