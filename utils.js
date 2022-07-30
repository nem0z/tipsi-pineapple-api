const sum = arr.reduce((ps, a) => ps + a, 0.0);

const isEqualObject = function(obj1, obj2) {
    const keys = Object.keys(obj1);
    return keys.length == Object.keys(obj2).length 
        && keys.map(k => obj1[k] === obj2[k]).every(r => r === true);
}

const isValidOrder = function(order, productDB) {
    const res = order.map(o => {
        productDB.findOne({ _id: o._id }, (err, doc) => {
            if(err) return false;
            return isEqualObject(doc, order);
        });
    });

    return res.every(isValid => isValid);
}

export { sum, isValidOrder };