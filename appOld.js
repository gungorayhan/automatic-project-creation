const fs = require('fs');

// Product Class
const productClassContent = `export class Product {
    constructor(
        public readonly name: string,
        public readonly description:string,
        public readonly price:number,
        public readonly stock:number,
        public readonly id?:number
        
    ){}
}`;

// ICatalogRepository Interface
const iCatalogRepositoryContent = `export interface ICatalogRepository{
    create(data:Product):Promise<Product>;
    update(data:Product):Promise<Product>;
    delete(id:any);
    find(limit:number,offset:number):Promise<Product[]>;
    findOne(id:number):Promise<Product>;
}`;

// Generate Mongoose Schema
const generateMongooseSchema = (className, properties) => {
    let schemaContent = `const mongoose = require('mongoose');\n\n`;
    schemaContent += `const ${className}Schema = new mongoose.Schema({\n`;
    properties.forEach(prop => {
        schemaContent += `    ${prop.name}: ${prop.type},\n`;
    });
    schemaContent += `});\n\n`;
    schemaContent += `const ${className} = mongoose.model('${className}', ${className}Schema);\n\n`;
    schemaContent += `module.exports = ${className};`;

    return schemaContent;
};

// Generate Router
const generateRouter = (className) => {
    return `const express = require('express');
const router = express.Router();
const ${className}Controller = require('../controllers/${className}Controller');

// Define routes
router.post('/', ${className}Controller.create);
router.put('/:id', ${className}Controller.update);
router.delete('/:id', ${className}Controller.delete);
router.get('/', ${className}Controller.find);
router.get('/:id', ${className}Controller.findOne);

module.exports = router;`;
};

// Generate Controller
const generateController = (className) => {
    return `const ${className}Service = require('../services/${className}Service');

// Controller methods
exports.create = async (req, res) => {
    // Implement create method
};

exports.update = async (req, res) => {
    // Implement update method
};

exports.delete = async (req, res) => {
    // Implement delete method
};

exports.find = async (req, res) => {
    // Implement find method
};

exports.findOne = async (req, res) => {
    // Implement findOne method
};
`;
};

// Generate Service
const generateService = (className) => {
    return `const ${className}Repository = require('../repositories/${className}Repository');

// Service methods
// Implement service methods`;
};

// Generate Repository
const generateRepository = (className) => {
    return `const ${className} = require('../models/${className}');

// Repository methods
// Implement repository methods`;
};

// Function to create directories and files
const generateFilesAndDirectories = (basePath, files) => {
    // Create directories
    fs.mkdirSync(basePath, { recursive: true });

    // Create files
    files.forEach(file => {
        fs.writeFileSync(`${basePath}/${file.name}`, file.content);
    });
};

// Generate files and directories
const generateProjectStructure = (basePath, className) => {
    const files = [
        { name: `${className}.ts`, content: productClassContent },
        { name: `ICatalogRepository.ts`, content: iCatalogRepositoryContent },
        { name: `mongooseSchema.js`, content: generateMongooseSchema(className, [
            { name: 'name', type: 'String' },
            { name: 'description', type: 'String' },
            { name: 'price', type: 'Number' },
            { name: 'stock', type: 'Number' },
            { name: 'id', type: 'Number' }
        ]) },
        { name: `router.js`, content: generateRouter(className) },
        { name: `controller.js`, content: generateController(className) },
        { name: `service.js`, content: generateService(className) },
        { name: `repository.js`, content: generateRepository(className) }
    ];

    generateFilesAndDirectories(basePath, files);
};

// Example usage
const basePath = './myProject';
const className = 'Product';

generateProjectStructure(basePath, className);