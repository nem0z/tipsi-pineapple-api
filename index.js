import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';

const app = express(); // Create express server
  
app.use(express.json()); // settings

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

app.get('/product', (req, res) => {
    
});
app.get('/orders', (req, res) => {
    
});

app.post('/order', (req, res) => {
    console.log(req.body);

    res.sendStatus(201);
  });
  
  



app.listen(3000, () => console.log('API Server is running...')); // Test working