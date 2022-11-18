import * as redis from "redis";
import { Block, Transaction } from "./blockchain/types";
import {
  getBlockchain,
  getTransactions,
  verifySignature,
  writeBlockchain,
  writeTransactions,
} from "./blockchain/utils";

const CHANNELS = {
  TEST: "TEST",
  NEWBLOCKMINED: "NEWBLOCKMINED",
  SYNCREQ: "SYNCREQ",
  SYNCRES: "SYNCRES",
  TRANSACTION: "TRANSACTION"
};

const publisher = redis.createClient();
const subscriber = redis.createClient();

const syncBlockchain = (message: string) => {
  const currentTransactions = getTransactions();
  const currentBlockchain = getBlockchain();
  const { blockchain, transactions } = JSON.parse(message);
  if(blockchain.length > currentBlockchain.length) {
    writeBlockchain(blockchain);
  }
  if(transactions.length > currentTransactions.length) {
    writeTransactions(transactions);
  }
};

const addTransaction = (message: string) => {
  const parsedTransaction = JSON.parse(message);
  const { senderAddress, amount, gasFee, signature } = parsedTransaction;
  const isTransactionValid = verifySignature(senderAddress, amount, gasFee, signature);
  if (isTransactionValid) {
    const currentTransactions = getTransactions();
    const newTransactions = [...currentTransactions, parsedTransaction].sort((transactionA, transactionB) => transactionB.gasFee - transactionA.gasFee);
    writeTransactions(newTransactions);
  }
}

const addBlock = (message: string) => {
  const parsedBlock = JSON.parse(message);
  const currentBlockchain = getBlockchain();
  const isLastBlockNumberValid =
    currentBlockchain[currentBlockchain.length - 1].blockNumber ===
    parsedBlock.lastBlock.blockNumber - 1;
  const isBlockchainLonger =
    parsedBlock.blockchainLength > currentBlockchain.length;
  const isLastHashValid =
    currentBlockchain[currentBlockchain.length - 1].hash ===
    parsedBlock.lastBlock.previousHash;
  if (isLastBlockNumberValid && isBlockchainLonger && isLastHashValid) {
    console.log(`New block added: ${JSON.stringify(parsedBlock.lastBlock)}`);
    writeBlockchain([...currentBlockchain, parsedBlock.lastBlock]);
    writeTransactions(parsedBlock.transactions);
  }
};

const handleMessage = (channel: string, message: string) => {
  switch (channel) {
    case CHANNELS.TEST:
      console.log(`The message: ${message}`);
      break;
    case CHANNELS.NEWBLOCKMINED:
      addBlock(message);
      break;
    case CHANNELS.SYNCREQ:
      broadcastBlockchain();
      break;
    case CHANNELS.SYNCRES:
      syncBlockchain(message);
      break;
    case CHANNELS.TRANSACTION:
      addTransaction(message);
      break;
    default:
      break;
  }
};

export const initPubSub = async () => {
  subscriber.subscribe([...Object.values(CHANNELS)], (channel, message) =>
    handleMessage(message, channel)
  );

  await publisher.connect();
  await subscriber.connect();
};

export const syncChainRequest = () => {
  publisher.publish(CHANNELS.SYNCREQ, "Sync Request");
};

export const broadcastTransaction = (transaction: Transaction) => {
  publisher.publish(CHANNELS.TRANSACTION, JSON.stringify(transaction));
};

export const testChannel = () => {
  publisher.publish(CHANNELS.TEST, "testMessage");
};

export const broadcastBlockchain = () => {
  const currentTransactions = getTransactions();
  const currentBlockchain = getBlockchain();
  publisher.publish(
    CHANNELS.SYNCRES,
    JSON.stringify({
      blockchain: currentBlockchain,
      transactions: currentTransactions,
    })
  );
};

export const broadcastMinedBlock = (
  lastBlock: Block,
  blockchainLength: number,
  transactions: Transaction[]
) => {
  publisher.publish(
    CHANNELS.NEWBLOCKMINED,
    JSON.stringify({ lastBlock, blockchainLength, transactions })
  );
};
