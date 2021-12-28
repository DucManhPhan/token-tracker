const TokenTransactionModel = require('../database/token_transaction');

class DatabaseUtils {

    async insertTokenTransactionModel(tokenTransactionModel) {
        try {
            await tokenTransactionModel.save();
            console.log(`Writing token transaction with from: ${tokenTransactionModel.from} and to: ${tokenTransactionModel.to} successfully`);
        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = new DatabaseUtils();