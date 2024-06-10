const fs = require('fs');
const path = require('path');

const productClassContent = `export class Product {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly stock: number,
        public readonly id?: number
    ) {}
}`;

const iCatalogRepositoryContent = `export interface ICatalogRepository {
    create(data: Product): Promise<Product>;
    update(data: Product): Promise<Product>;
    delete(id: any): void;
    find(limit: number, offset: number): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
}`;

const generateMongooseSchema = () => {
    return `import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

export default mongoose.model<IProduct>('Product', ProductSchema);
`;
};

const generateRouter = () => {
    return `import express from 'express';
import { create, update, remove, find, findOne } from '../controllers/productController';

const router = express.Router();

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/', find);
router.get('/:id', findOne);

export default router;
`;
};

const generateController = () => {
    return `import { Request, Response } from 'express';
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
`;
};

const generateService = () => {
    return `import * as productRepository from '../repositories/productRepository';
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
`;
};

const generateRepository = () => {
    return `import ProductModel, { IProduct } from '../models/product';
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
`;
};

const generateIndex = () => {
    return `import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter';

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/products', productRouter);

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});
`;
};

const generatePackageJson = () => {
    return `{
    "name": "myProject",
    "version": "1.0.0",
    "main": "dist/index.js",
    "scripts": {
        "start": "ts-node-dev src/index.ts",
        "build": "tsc"
    },
    "dependencies": {
        "express": "^4.17.1",
        "mongoose": "^5.12.3"
    },
    "devDependencies": {
        "@types/express": "^4.17.11",
        "@types/mongoose": "^5.10.3",
        "@types/node": "^14.14.31",
        "ts-node-dev": "^1.1.1",
        "typescript": "^4.2.4"
    }
}`;
};

const generateTsConfigJson = () => {
    return `{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": ["src/**/*.ts"],
    "exclude": ["node_modules"]
}`;
};

const generateFilesAndDirectories = (basePath) => {
    const dirs = [
        'src',
        'src/controllers',
        'src/models',
        'src/repositories',
        'src/routes',
        'src/services',
        'src/interfaces'
    ];

    const files = [
        { path: 'src/models/product.ts', content: generateMongooseSchema() },
        { path: 'src/controllers/productController.ts', content: generateController() },
        { path: 'src/repositories/productRepository.ts', content: generateRepository() },
        { path: 'src/routes/productRouter.ts', content: generateRouter() },
        { path: 'src/services/productService.ts', content: generateService() },
        { path: 'src/interfaces/ICatalogRepository.ts', content: iCatalogRepositoryContent },
        { path: 'src/index.ts', content: generateIndex() },
        { path: 'package.json', content: generatePackageJson() },
        { path: 'tsconfig.json', content: generateTsConfigJson() }
    ];

    dirs.forEach(dir => {
        fs.mkdirSync(path.join(basePath, dir), { recursive: true });
    });

    files.forEach(file => {
        fs.writeFileSync(path.join(basePath, file.path), file.content);
    });
};

const basePath = './myProject';
generateFilesAndDirectories(basePath);
