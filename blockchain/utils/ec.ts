import EC from 'elliptic';

export const ec = new EC.ec('p192');

export const verifySignature = (publicKey: string, amount: number, gasFee: number, signature: string) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(publicKey + amount + gasFee, signature);
}