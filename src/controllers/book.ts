import express, { Request, Response } from 'express'; const bookRouter = express.Router();

bookRouter.get('/api/book', (req : Request, res: Response) => {
try {
res.status(200).json();
} catch (e) {
res.status(e.status).json(e);
}
})

bookRouter.post('/api/book', (req : Request, res: Response) => {
try {
res.status(200).json();
} catch (e) {
res.status(e.status).json(e);
}
})

export default bookRouter;
