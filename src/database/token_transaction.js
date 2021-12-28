let mongoose = require('mongoose');

let tokenTransactionSchema = new mongoose.Schema({
    from: String,
    to: String,
    value: String,
    times: String,
    status: String
});

const TokenTransaction = mongoose.model('TokenTransaction', tokenTransactionSchema);

module.exports = TokenTransaction;
