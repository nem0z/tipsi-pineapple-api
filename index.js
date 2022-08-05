import express from 'express';
import Datastore from 'nedb-promises';
import cors from 'cors';

import swagger from 'pineapple-swagger';

import { sum, isValidOrder, sendError } from './utils.js';
import * as Err from './errors.js';

const app = express(); // Create express server

// Def db
const db = {
    products: Datastore.create('./db/products.db'),
    orders: Datastore.create('./db/orders.db'),
};
  

// settings
app.use(cors());

app.use(express.json());
app.use((err, req, res, next) => {
    return sendError(res, Err.invalidJsonError);
});

app.use(...await swagger('/api-docs'));



// Defining routes

app.get('/products', (req, res) => {

    db.products.find({})
        .then(docs => res.status(200).json(docs))
        .catch(err => sendError(res, {...Err.readingDataError, errors: [err]}));

});


app.get('/product/:id', (req, res) => {
    const id = req.params?.id;

    if(!id) return sendError(res, Err.invalidIdError);

    db.products.findOne({ _id: id })
        .then(doc => {
            if(doc === null) return sendError(res, Err.invalidIdError);
            return res.status(200).json(doc);
        })
        .catch(err => {
            return sendError(res, {...Err.readingDataError, errors: [err]});
        });

});


app.get('/orders', (req, res) => {
    
    db.orders.find({})
        .then(docs => res.status(200).json(docs))
        .catch(err => sendError(res, Err.readingDataError));

});


app.post('/order', async (req, res) => {
    if(!req.body) return sendError(res, Err.noDataError)
    if(!Array.isArray(req.body)) return sendError(res, {...Err.invalidDataFormatError, errors: ["Data must be array of Products, received data isn't an array"] });
    if(req.body.length < 1) return sendError(res, {...Err.invalidDataFormatError, errors: ["Array must contains at least one Product"] });
    const data = await isValidOrder(req.body, db.products);

    if(data === false) return sendError(res, {...Err.invalidDataFormatError, errors: ["Array must contains Product with all its properties / _id of the product as a string"] });

    const order = { order: data, date: Date.now(), price: sum(data.map(p => p.price ?? 0)) };

    db.orders.insert(order)
        .then(newDoc => res.status(201).json(newDoc))
        .catch(err => {
            sendError(res, {...Err.savingDataError, errors: [err]})
        });
});
  


app.listen(3000, () => console.log('API Server is running...')); // Test working