/**
 * Sum all elements of an array
 * @param {number[]} arr - Array of number you want to sum
 * @return {number} Sum of array's numbers
 */
const sum = arr => arr.reduce((ps, a) => ps + a, 0.0);


/**
 * Test if 2 object are equals ( same properties and values )
 * @param {object} obj1 - First object you want to compare
 * @param {object} obj2 - Second object you want to compare
 * @return {boolean} True if both obj are equal, else => false
 */
const isEqualObject = function(obj1, obj2) {
    const keys = Object.keys(obj1);
    return keys.length == Object.keys(obj2).length 
        && keys.map(k => obj1[k] === obj2[k]).every(r => r === true);
}


/**
 * Test if the given array or order is valid
 * @param {Array} order - Array of order, it should be object or string (_id format)
 * @param {Datastore} productDB - DB where products used in the order are stored
 * @return {Promise<object[]> || Promise<object>} Array of valid order || object with errors resulting to an invalind order
 */
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


/**
 * Return an error with status and json
 * @param {Response} res - Express response that you return to the requester
 * @param {object} error - An error declared in errors.js
 * @return {void} Array of valid order || object with errors resulting to an invalind order
 */
const sendError = (res, error) => res.status(error.status).json(error);

export { sum, isValidOrder, sendError };