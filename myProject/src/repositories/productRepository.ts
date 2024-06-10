import ProductModel, { IProduct } from '../models/product';
import { Product } from '../models/product';

export const create = async (data: Product): Promise<IProduct> => {
    const product = new ProductModel(data);
    return await product.save();
};

export const update = async (id: string, data: Product): Promise<IProduct | null> => {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string): Promise<void> => {
    await ProductModel.findByIdAndDelete(id);
};

export const find = async (limit: number, offset: number): Promise<IProduct[]> => {
    return await ProductModel.find().skip(offset).limit(limit);
};

export const findOne = async (id: string): Promise<IProduct | null> => {
    return await ProductModel.findById(id);
};
