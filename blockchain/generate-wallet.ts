import { ec, getWallets, writeWallets } from "./utils";

export const generateWallet = (newWalletName: string) => {
const currentWallets = getWallets();

if (currentWallets[newWalletName]) throw Error("The account name already exist");

const newPair = ec.genKeyPair();
const newPublicKey = newPair.getPublic('hex');
const newPrivateKey = newPair.getPrivate('hex');
const newWallet = {
    [newWalletName]: {
        'publicKey': newPublicKey,
        'privateKey': newPrivateKey
    }
};

writeWallets({ ...currentWallets, ...newWallet });
}