<div align="center">
  <h1>TS Blockchain</h1>
  <strong>A simple blockchain built in TypeScript, inspired by <a href="https://github.com/freeCodeCamp/web3-curriculum">Web 3 FreeCodeCamp.org course</a>.</strong>
</div>

## About

Simple Blockchain, with minimal functionality implemented in TypeScript for the educational purpose.

## Installation

```
1. git clone https://github.com/KowalewskiPawel/TSBlockchain.git

2. yarn
```

### Requirements

* Node v18.7.0
* yarn v1.22.19

### Usage

#### Init Blockchain

```
yarn init-blockchain
```

#### Generate Wallet

```
yarn generate-wallet <wallet_name>
```


#### Mine Block

```
yarn mine-block <miner_private_key>
```

#### Get Address Info

```
yarn get-address-info <wallet_name>
```
#### Transfer tokens

```
yarn transfer <sender_private_key> <amount> <gas_fee> <receiver_public_key>
```

## License

* MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)