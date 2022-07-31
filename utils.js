const sum = arr => arr.reduce((ps, a) => ps + a, 0.0);

const isEqualObject = function(obj1, obj2) {
    const keys = Object.keys(obj1);
    return keys.length == Object.keys(obj2).length 
        && keys.map(k => obj1[k] === obj2[k]).every(r => r === true);
}

const isValidOrder = function(order, productDB) {
    if(order.length === 'undefined' || order.legnth < 1) return false;
    console.log('format ok');

    const res = order.map(o => {
        return productDB.findOne({ _id: o._id })
            .then(doc => isEqualObject(doc, o))
            .catch(err => false);
    });

    return res.every(isValid => isValid);
}

export { sum, isValidOrder };