const Decimal = require('decimal.js');
const WEI = 1000000000000000000

const ethToWei = (amount) => new Decimal(amount).times(WEI);

class ValidationUtils {

    validateTransaction(trx) {
        const toValid = trx.to !== null;
        if (!toValid) {
            return false;
        }

        const isValidwalletTo = trx.to.toLowerCase() === process.env.WALLET_TO.toLowerCase();
        const isValidWalletFrom = trx.from.toLowerCase() === process.env.WALLET_FROM.toLowerCase();
        const isValidAmount = ethToWei(process.env.AMOUNT).equals(trx.value);

        return toValid && isValidwalletTo &&
            isValidWalletFrom && isValidAmount;
    }

    hasNotExistedTransactions(block) {
        return !(block && block.transactions);
    }

    isEqualToReceiptOrSender(account, tx) {
        if (tx == null || tx.from == null || tx.to == null) {
            return false;
        }

        return account === tx.to.toLowerCase() ||
               account === tx.from.toLowerCase()
    }

    isEqualToReceiptAddress(account, tx) {
        if (account == null || tx == null) {
            return false;
        }
        
        let receipt = tx.to;
        return receipt && account === receipt.toLowerCase();
    }

}

module.exports = new ValidationUtils();
