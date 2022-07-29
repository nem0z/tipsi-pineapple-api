import { Document } from 'camo';
import { Product } from './Product';

class Order extends Document {
    constructor() {
        super();

        this.date = String;
        this.order = [Product];
        this.price = Number;
    }

    static collectionName() {
        return 'orders';
    }
}