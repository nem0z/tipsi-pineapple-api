import express from 'express';
import Datastore from 'nedb';
// import cors from 'cors'; // A voir

const app = express(); // Create express server


// Def db
const db = {
    products: new Datastore({ filename: './db/products.db', autoload: true }),
    orders: new Datastore({ filename: './db/orders.db', autoload: true })
};
  

// settings
app.use(express.json());
// app.use(express.cors()); // A voir


// Defining routes

app.get('/products', (req, res) => {

    db.products.find({}, (err, docs) => {
        if(err) return res.sendStatus(500);
        return res.status(200).json(docs);
    });

});

app.get('/product/:id', (req, res) => {
    const id = req.params?.id;

    if(!id) return res.send(400);

    db.products.findOne({ _id: id }, (err, doc) => {
        if(err) {
            const error = {ok: false, status: 500, message: 'Data not foud'};
            return res.status(500).json(error);
        }
        return res.status(200).json(doc);
        
    });
});

app.get('/orders', (req, res) => {
    
    db.orders.find({}, (err, docs) => {
        if(err) return res.sendStatus(500);
        return res.status(200).json(docs);
        
    });

});

app.post('/order', (req, res) => {
    console.log(req.body);

    if(!req.body) return res.sendStatus(400);
    const order = { order: req.body };

    db.orders.insert(order, (err, newDoc) => {
        if (err) throw err;
        res.status(201).json(newDoc);
    });

});
  


app.listen(3000, () => console.log('API Server is running...')); // Test working