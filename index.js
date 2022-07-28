import express from 'express';
import { MongoClient } from 'mongodb';
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
    res.json([
        {
            'id': 1,
            'name': 'piPhone1',
            'desc': 'First model of piPhone !',
        },
        {
            'id': 2,
            'name': 'piPhone2',
            'desc': 'Seconde model of piPhone !',
        },
        {
            'id': 3,
            'name': 'piPhone3',
            'desc': 'Third model of piPhone !',
        },
    ])
});

app.get('/product/:id', (req, res) => {
    console.log(req.params?.id);
    res.sendStatus(200);
});

app.get('/orders', (req, res) => {
    
});

app.post('/order', (req, res) => {
    console.log(req.body);

    if(!req.body?.order) return res.sendStatus(400);

    res.sendStatus(201);
});
  


app.listen(3000, () => console.log('API Server is running...')); // Test working