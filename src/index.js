require('./env');
require('./database/database_connection');

const IlvTokenTransactions = require('./scan_transactions/ilv_token_transactions');
const tokenTransactionQueue = require('./message_queue/token_transaction_queue');
const DatabaseUtils = require('./utils/database_utils');

/**
 * Get the transactions from INFURA service
 */
function getAllTransactions() {
    const ilvTokenTransactions = new IlvTokenTransactions();
    ilvTokenTransactions.ping();

    ilvTokenTransactions.getAllTransactions();
}

function consumeTransaction() {
    setInterval(async () => {
        if (tokenTransactionQueue.isEmpty()) {
            return;
        }

        let trx = tokenTransactionQueue.dequeue();
        DatabaseUtils.insertTokenTransactionModel(trx);
    }, 1000);
}

function main() {
    getAllTransactions();
    consumeTransaction();
}

main();