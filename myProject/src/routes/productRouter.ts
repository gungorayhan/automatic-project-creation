import express from 'express';
import { create, update, remove, find, findOne } from '../controllers/productController';

const router = express.Router();

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/', find);
router.get('/:id', findOne);

export default router;
