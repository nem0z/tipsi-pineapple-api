const sum = arr => arr.reduce((ps, a) => ps + a, 0.0);

const isEqualObject = function(obj1, obj2) {
    const keys = Object.keys(obj1);
    return keys.length == Object.keys(obj2).length 
        && keys.map(k => obj1[k] === obj2[k]).every(r => r === true);
}

const isValidOrder = function(order, productDB) {
    const errors = [];
    if(order.length === 'undefined' || order.legnth < 1) return Promise.resolve({isValid: false});

    const res = order.map(o => {
        if(typeof(o) == 'string') {
            return productDB.findOne({ _id: o })
                .then(doc => doc)
                .catch(err => false);
        }

        if(o._id) {
            return productDB.findOne({ _id: o._id })
                .then(doc => isEqualObject(doc, o) ? doc : false)
                .catch(err => false);
        }

        return Promise.resolve({isValid: false});

    });

    return Promise.all(res)
        .then(r => r.every(isValid => isValid !== false) ? r : {isValid: false, errors: errors});
}

const sendError = (res, error) => res.status(error.status).json(error);

export { sum, isValidOrder, sendError };