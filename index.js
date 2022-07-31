import express from 'express';
import Datastore from 'nedb-promises';
import { sum, isValidOrder, sendError } from './utils.js';
import * as Err from './errors.js';
// import cors from 'cors'; // A voir

const app = express(); // Create express server

// Def db
const db = {
    products: Datastore.create('./db/products.db'),
    orders: Datastore.create('./db/orders.db'),
};
  

// settings
app.use(express.json());
// app.use(express.cors()); // A voir


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
        .catch(err => res.sendStatus(500));

});


app.post('/order', async (req, res) => {
    if(!req.body) return sendError(res, Err.noDataError)

    const data = await isValidOrder(req.body, db.products);

    if(data.isValid === false) return sendError(res, {...Err.invalidDataFormatError, errors: data.erros });

    const order = { order: data, date: Date.now(), price: sum(data.map(p => p.price ?? 0)) };

    db.orders.insert(order)
        .then(newDoc => res.status(201).json(newDoc))
        .catch(err => {
            sendError(res, {...Err.savingDataError, errors: [err]})
        });

});
  


app.listen(3000, () => console.log('API Server is running...')); // Test working