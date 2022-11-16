import { MINIMUM_GAS_FEE } from "./consts";
import { Transaction } from "./types";
import {
  ec,
  getAddressBalance,
  getTransactions,
  writeTransactions,
} from "./utils";

const senderPrivateKey = process.argv[2];
const amount = Number(process.argv[3]);
const gasFee = Number(process.argv[4]);
const receiverPublicKey = process.argv[5];

if (!receiverPublicKey) throw Error("No receiver public key provided");

if (!gasFee || gasFee < MINIMUM_GAS_FEE) throw Error("Gas fee is too low");

const senderKeypair = ec.keyFromPrivate(senderPrivateKey);
const senderPublicAddress = senderKeypair.getPublic("hex");
const signature = senderKeypair.sign(senderPublicAddress + amount).toDER("hex");

const isBalanceEnough =
  getAddressBalance(senderPublicAddress) >= amount + gasFee;

if (!isBalanceEnough) throw Error("Insufficient balance");

const currentTransactions = getTransactions();

const transaction: Transaction = {
  senderAddress: senderPublicAddress,
  receiverAddress: receiverPublicKey,
  amount,
  gasFee,
  signature,
};

writeTransactions([...currentTransactions, transaction]);
