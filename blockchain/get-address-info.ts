import { getAddressBalance, getWalletAddressFromName } from "./utils";

const addressToCheckBalance = process.argv[2];
const isAddressName = process.argv[3];

const addressPublicKey = isAddressName ? getWalletAddressFromName(addressToCheckBalance) : addressToCheckBalance;

const addressBalance = getAddressBalance(addressPublicKey);

console.log(`The address balance is: ${addressBalance}`);