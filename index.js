import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
// import cors from 'cors'; // A voir

const app = express(); // Create express server

// Def const 
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'PineAppleDB';
let db;

// Connect mongodb
MongoClient.connect(dbUrl, function(err, client) {
    console.log("Successfully connected to mongodb server");
    db = client.db(dbName);
  });
  

// settings
app.use(express.json());
// app.use(express.cors()); // A voir


// Defining routes

app.get('/products', (req, res) => {

    db.collection('products').find({}).toArray()
        .then(docs => {
            return res.status(200).json(docs);
        })
        .catch(err => {
            console.error(err);
            return res.sendStatus(500);
        });

});

app.get('/product/:id', (req, res) => {
    const id = req.params?.id;

    if(!id) return res.send(400);

    db.collection('products').findOne(ObjectId(id))
        .then(doc => {
            return res.status(200).json(doc);
        })
        .catch(err => { // A revoir
            const error = {ok: false, status: 500, message: 'Data not foud'};
            return res.status(500).json(error);
        });
});

app.get('/orders', (req, res) => {
    
    db.collection('orders').find({}).toArray(function(err, docs) {
        if(err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.status(200).json(docs);
    });

});

app.post('/order', (req, res) => {
    console.log(req.body);

    if(!req.body?.order) return res.sendStatus(400);

    res.sendStatus(201);
});
  


app.listen(3000, () => console.log('API Server is running...')); // Test working