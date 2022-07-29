import { Document } from 'camo';

class Product extends Document {
    constructor() {
        super();

        this.name = String;
        this.desc = String;
        this.price = Number;
    }

    static collectionName() {
        return 'products';
    }
}