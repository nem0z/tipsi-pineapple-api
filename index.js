import express from 'express';
import Datastore from 'nedb-promises';
import { sum, isValidOrder } from './utils.js';
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
        .catch(err => res.sendStatus(500));

});


app.get('/product/:id', (req, res) => {
    const id = req.params?.id;

    if(!id) return res.sendStatus(400);

    db.products.findOne({ _id: id })
        .then(doc => res.status(200).json(doc))
        .catch(err => {
            const error = {ok: false, status: 500, message: 'Data not foud'};
            return res.status(500).json(error);
        });

});


app.get('/orders', (req, res) => {
    
    db.orders.find({})
    .then(docs => res.status(200).json(docs))
    .catch(err => res.sendStatus(500));

});


app.post('/order', async (req, res) => {
    if(!req.body) return sendStatus(400);

    const data = await isValidOrder(req.body, db.products);
    console.log(data);

    if(data === false) return res.sendStatus(400);

    const order = { order: data, date: Date.now(), price: sum(data.map(p => p.price ?? 0)) };

    db.orders.insert(order)
        .then(newDoc => res.status(201).json(newDoc))
        .catch(err => res.status(500).json(`{error: ${err}}`));

});
  


app.listen(3000, () => console.log('API Server is running...')); // Test working