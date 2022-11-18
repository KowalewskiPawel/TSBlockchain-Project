import sha256 from "crypto-js/sha256";
import { BLOCK_REWARD, GENESIS_ADDRESS, ZEROS } from "./consts";
import { Block, Transaction } from "./types";
import {
  getAddressBalance,
  getBlockchain,
  getTransactions,
  getUnixTimestamp,
  newUuid,
  writeBlockchain,
  writeTransactions,
} from "./utils";

export const mineBlock = (minerPublicKey: string) => {
  if (!minerPublicKey) throw Error("Please provide a public key for miner");

  const currentBlockchain = getBlockchain();
  const listOfTransactions: Transaction[] = [...getTransactions()];
  const previousHash = currentBlockchain[currentBlockchain.length - 1].hash;

  let newHash = "";
  let nonce = 0;

  const isSupplyAvailable = getAddressBalance(GENESIS_ADDRESS) > BLOCK_REWARD;

  const blockRewardTransaction: Transaction = {
    transactionId: newUuid(),
    transactionTimestamp: getUnixTimestamp(),
    senderAddress: GENESIS_ADDRESS,
    receiverAddress: minerPublicKey,
    amount: BLOCK_REWARD,
  };

  if (isSupplyAvailable) listOfTransactions.push(blockRewardTransaction);

  listOfTransactions.forEach(({ gasFee, senderAddress }: Transaction) => {
    if (gasFee) {
      listOfTransactions.push({
        transactionId: newUuid(),
        transactionTimestamp: getUnixTimestamp(),
        senderAddress,
        receiverAddress: minerPublicKey,
        amount: gasFee,
      });
    }
  });

  while (newHash.substring(0, 2) !== ZEROS) {
    nonce++;
    newHash = sha256(
      nonce + String(previousHash) + JSON.stringify(listOfTransactions)
    ).toString();
  }

  const newBlockNumber =
    currentBlockchain[currentBlockchain.length - 1].blockNumber + 1;

  const newBlock: Block = {
    blockNumber: newBlockNumber,
    blockTimestamp: getUnixTimestamp(),
    hash: newHash,
    previousHash,
    nonce,
    transactions: listOfTransactions,
  };

  writeBlockchain([...currentBlockchain, newBlock]);
  writeTransactions([]);
};
