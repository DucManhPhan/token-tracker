const Queue = require('queue-fifo');

class TokenTransactionQueue {

    constructor() {
        this.transactions = new Queue();
    }

    enqueue(trxModel) {
        this.transactions.enqueue(trxModel);
    }

    dequeue() {
        return this.transactions.dequeue();
    }

    isEmpty() {
        return this.transactions.isEmpty();
    }

}

module.exports = new TokenTransactionQueue();
