import express from 'express';
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
    console.log(`Server running on port ${port}`);
});
