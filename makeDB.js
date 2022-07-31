import Datastore from 'nedb';
import { promises as fs } from 'fs';
import { sum } from './utils.js';

const getRandomInt = max => Math.floor(Math.random() * max);
const getRandomElement = arr => arr.at(getRandomInt(arr.length));
const genOrder = products => Array(getRandomInt(2) + 1).fill({}).map(x => getRandomElement(products));

const db = {
    products: new Datastore({ filename: './db/products.db', autoload: true }),
    orders: new Datastore({ filename: './db/orders.db', autoload: true })
};

await fs.writeFile('./db/products.db', '')
    .then(() => { console.log('Empty products.db') });

await fs.writeFile('./db/orders.db', '')
    .then(() => { console.log('Empty orders.db') });

fs.readFile('./db/products.json')
    .then((data) => {
        let products = JSON.parse(data);

        db.products.insert(products, (err, newDocs) => {
            if (err) throw err;
            console.log('successfully created :', newDocs);
        });

        let orders = Array(10).fill([]).map(x => ({
                date: Date.now(),
                order: genOrder(products),
            })
        ).map(order => ({
            ...order, 
            price: sum(order.order.map(o => o.price ?? 0))
        }));
        
        db.orders.insert(orders, (err, newDocs) => {
            if (err) throw err;
            console.log('successfully created :', newDocs);
        });

    })
    .catch(err => {
        console.error(err);
        return err;
    });

