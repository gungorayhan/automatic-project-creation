import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const create = async (req: Request, res: Response) => {
    try {
        const product = await productService.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const product = await productService.update(req.params.id, req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await productService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const find = async (req: Request, res: Response) => {
    try {
        const products = await productService.find(parseInt(req.query.limit as string), parseInt(req.query.offset as string));
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const product = await productService.findOne(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
