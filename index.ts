import express from "express";
import bodyParser from "body-parser";
import { generateWallet, initBlockchain, mineBlock, transfer } from "./blockchain";
import { getBlockchain, getTransactions, getUnixTimestamp, getWallets, newUuid } from "./blockchain/utils";
import { broadcastMinedBlock, broadcastTransaction, initPubSub, syncChainRequest } from "./pubSub";
import { oneMinuteUnix } from "./blockchain/consts";

const app = express();
const newMinerWalletName = newUuid();
generateWallet(newMinerWalletName);
initBlockchain();

initPubSub();

const wallets = getWallets();
const minerPublickKey = wallets[newMinerWalletName].publicKey;
 
app.use(bodyParser.json());

setInterval(() => {
    const currentTransactions = getTransactions();
    const currentBlockchain = getBlockchain();
    const isTransactionPoolLongEnough = currentTransactions.length > 3;
    const isBlockchainOneMinuteOld = getUnixTimestamp() - currentBlockchain[currentBlockchain.length-1].blockTimestamp > oneMinuteUnix;
    if(isBlockchainOneMinuteOld || isTransactionPoolLongEnough) {
        mineBlock(minerPublickKey);
        const newBlockchain = getBlockchain();
        const currentTransactions = getTransactions();

        broadcastMinedBlock(
            newBlockchain[newBlockchain.length-1],
            newBlockchain.length,
            currentTransactions
        )
    }
}, 10000);


const PORT = 3000;

app.post("/api/mine", (req, res) => {
    try {
        mineBlock(minerPublickKey);
        const newBlockchain = getBlockchain();
        const currentTransactions = getTransactions();

        broadcastMinedBlock(
            newBlockchain[newBlockchain.length-1],
            newBlockchain.length,
            currentTransactions
        )
        return res.status(200).send({ success: true, message: "New Block mined" });
    } catch(error) {
        console.error("Block not mined", error);
        /* @ts-ignore */
        const { message } = error;
        return res.status(500).json({
            error: true,
            message: message
        })
    }
});

app.post("/api/transfer", (req, res) => {
    try {
        const { senderPrivateKey, amount, gasFee, receiverPublicKey } = req.body;
        const newTransaction = transfer(senderPrivateKey, amount, gasFee, receiverPublicKey);

        broadcastTransaction(newTransaction);
        return res.status(200).send({ success: true, message: "Transaction has been added to the mempool" });
    } catch(error) {
        console.error("Transaction not added", error);
        /* @ts-ignore */
        const { message } = error;
        return res.status(500).json({
            error: true,
            message: message
        })
    }
});

setTimeout(() => {
    syncChainRequest();
}, 1000);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});