import express from 'express';
const router = express.Router();
import { search } from '../controllers/search.controller';

router.post('/', async (req, res, next) => {
    try {
        res.json(await search(req.body.q));
    } catch (err: any) {
        console.error(`Error while searching`, err.message);
        next(err);
    }
});

export default router;