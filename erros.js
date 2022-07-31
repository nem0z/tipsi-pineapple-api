const invalidIdError = {
    status: 400,
    error: "_id doesn't exist"
};

const noDataError = {
    status: 400,
    error: "Data is missing"
};

const invalidDataFormatError = {
    status: 400,
    error: "Data doesn't match the correct format, check errors to have more details",
    errors: [],
};

const savingDataError = {
    status: 500,
    error: "An error occured while saving data in the databse",
}

const readingDataError = {
    status: 500,
    error: "An error occured while reading data from the databse",
}