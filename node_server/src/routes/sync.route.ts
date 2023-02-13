import express from 'express';
const router = express.Router();
import { sync } from '../controllers/sync/sync.controller';

router.post('/', async (req, res, next) => {
    try {
        sync();
        res.json();
    } catch (err: any) {
        console.error(`Error while syncing`, err.message);
        next(err);
    }
});

export default router;
