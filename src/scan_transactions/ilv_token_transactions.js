const Web3 = require('web3');
const Constants = require('../utils/constants')
const ValidationUtils = require('../utils/valiation_utils');

require('../database/database_connection');
const TokenTransactionModel = require('../database/token_transaction');

const tokenTransactionQueue = require('../message_queue/token_transaction_queue');

class IlvTokenTransactions {

    constructor() {
        this.account = process.env.TOKEN_CONTRACT_ADDRESS;
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL));
        this.subscription = this.web3.eth.subscribe(Constants.PENDING_TRANSACTION_SUBSCRIPTION,
                                    (error, result) => {
                                        if (error) {
                                            console.error(error);
                                        }
                                    });
    }

    ping() {
        console.log('Pong!');
    }

    async getAllTransactions() {
        // setInterval(async () => {
        //     console.log();
        //     await this.getLatestTransactions();
        // }, 10000);

        // this.getPendingTransactions();
        await this.getPreviousMintedTransactions();
    }

    async getPreviousMintedTransactions() {
        console.log('Getting previous minted transactions');
        return this._getTransactionsWithRange(Constants.EARLIEST_BLOCK_NUMBER,
                                         Constants.CURRENT_LATEST_BLOCK_NUMBER);
    }

    async getLatestTransactions() {
        console.log('Getting latest transaction');
        this._getTransactionsInBlock(Constants.LATEST_BLOCK_NUMBER,
                                Constants.MINTED_TRANSACTION_STATUS);
    }

    getPendingTransactions() {
        this.subscription.on('data', txHash => {
            setTimeout(async () => {
                try {
                    console.log('Getting pending transactions');
                    let tx = await this.web3.eth.getTransaction(txHash);
                    if (ValidationUtils.isEqualToReceiptAddress(this.account, tx)) {
                        tokenTransactionQueue.enqueue(new TokenTransactionModel({
                            from: tx.from,
                            to: tx.to,
                            value: this.web3.utils.fromWei(tx.value, 'ether'),
                            timestamp: new Date(),
                            status: Constants.PENDING_TRANSACTION_STATUS
                        }));
                    }
                } catch (err) {
                    console.log(err);
                }
            }, 60 * 1000);
        });
    }

    async _getTransactionsWithRange(start, end) {
        for (let i = start; i <= end; i++) {
            await this._getTransactionsInBlock(i, Constants.MINTED_TRANSACTION_STATUS);
        }
    }

    async _getTransactionsInBlock(blockNumber, status) {
        let block = await this.web3.eth.getBlock(blockNumber);
        // console.log('Content of this block: ' + JSON.stringify(block));
        console.log(`[*] Searching block ${blockNumber} with ${block.transactions.length}`);

        if (ValidationUtils.hasNotExistedTransactions(block)) {
            console.log(`transactions of block ${blockNumber}: ${JSON.stringify(block.transactions)}`);
            return;
        }

        console.log(`iterate transactions in block ${blockNumber}`);
        for (let txHash of block.transactions) {
            let tx = await this.web3.eth.getTransaction(txHash);
            if (ValidationUtils.isEqualToReceiptOrSender(this.account, tx)) {
                console.log(`\n[+] Transaction found on block ${blockNumber}`);
                console.log(`Content of a transaction: ${JSON.stringify(tx)}`);

                tokenTransactionQueue.enqueue(new TokenTransactionModel({
                    from: tx.from,
                    to: tx.to,
                    value: this.web3.utils.fromWei(tx.value, 'ether'),
                    timestamp: new Date(),
                    status
                }));
            }
        }
    }

}

module.exports = IlvTokenTransactions;