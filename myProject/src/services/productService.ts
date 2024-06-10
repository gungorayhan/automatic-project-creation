import * as productRepository from '../repositories/productRepository';
import { Product } from '../models/product';

export const create = async (data: Product): Promise<Product> => {
    return await productRepository.create(data);
};

export const update = async (id: string, data: Product): Promise<Product> => {
    return await productRepository.update(id, data);
};

export const remove = async (id: string): Promise<void> => {
    return await productRepository.remove(id);
};

export const find = async (limit: number, offset: number): Promise<Product[]> => {
    return await productRepository.find(limit, offset);
};

export const findOne = async (id: string): Promise<Product> => {
    return await productRepository.findOne(id);
};
