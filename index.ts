import express from "express";
import bodyParser from "body-parser";
import { generateWallet, initBlockchain, mineBlock } from "./blockchain";
import { getWallets, newUuid } from "./blockchain/utils";
import { initPubSub, testChannel } from "./pubSub";

const app = express();
const newMinerWalletName = newUuid();
generateWallet(newMinerWalletName);
initBlockchain();

initPubSub();

const wallets = getWallets();
const minerPublickKey = wallets[newMinerWalletName].publicKey;
 
app.use(bodyParser.json());

setInterval(() => {
    testChannel();
}, 1000);

const PORT = 3000;

app.post("/api/mine", (req, res) => {
    try {
        mineBlock(minerPublickKey);
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

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});