import { readFileSync, writeFileSync } from "fs";
import { Block, Transaction, Wallets } from "../types";

export const getBlockchain = (): Block[] => {
  const blockchainFile = readFileSync("./blockchain/blockchain.json");
  const blockchain = JSON.parse(String(blockchainFile));
  return blockchain;
};

export const writeBlockchain = (blockchain: Block[]) => {
  const blockchainString = JSON.stringify(blockchain, null, 2);
  writeFileSync("./blockchain/blockchain.json", blockchainString);
};

export const getTransactions = (): Transaction[] => {
  const transactionsFile = readFileSync("./blockchain/transactions.json");
  const transactions = JSON.parse(String(transactionsFile));
  return transactions;
};

export const writeTransactions = (transactions: Transaction[]) => {
  const transactionsString = JSON.stringify(transactions, null, 2);
  writeFileSync("./blockchain/transactions.json", transactionsString);
};

export const getWallets = (): Wallets => {
  const walletsFile = readFileSync("./blockchain/wallets.json");
  const wallets = JSON.parse(String(walletsFile));
  return wallets;
};

export const writeWallets = (wallets: Wallets): void => {
  const walletsString = JSON.stringify(wallets, null, 2);
  writeFileSync("./blockchain/wallets.json", walletsString);
};

export const getAddressBalance = (address: string): number => {
  const blockchain = getBlockchain();
  let balance = 0;

  for (let i = 0; i < blockchain.length; i++) {
    const { transactions } = blockchain[i];

    for (let j = 0; j < transactions.length; j++) {
      const { senderAddress, receiverAddress, amount } = transactions[j];
      if (senderAddress === address) {
        balance -= amount;
      }

      if (receiverAddress === address) {
        balance += amount;
      }
    }
  }

  const transactions = getTransactions();

  for (let i = 0; i < transactions.length; i++) {
    const { senderAddress, amount = 0, gasFee = 0 } = transactions[i];
    
    if (senderAddress === address) {
      balance -= amount + gasFee;
    }
  }

  return balance;
};

export const getWalletAddressFromName = (name: string): string => {
  const wallets = getWallets();
  if(!wallets[name]) throw Error("There is no such a name on the wallets list");
  return wallets[name].publicKey;
}
