# truffle-deploy

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/truffle-deploy)

Fine-grained Truffle deployment, with:

* Automatic gas estimation.
* Transaction retries.
* No `Migrations` contract.

## Installation

```sh
npm install --dev truffle-deploy
```

## Usage

Writing a deployment is relatively similar to what you do
with a Truffle migration. You can put your deployments in any directory
you want, but preferably NOT `migrations` since that could cause confusions.

```solidity
// contracts/Ownable.sol

pragma solidity ^0.4.24;


contract Ownable {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address _newOwner) external onlyOwner {
    owner = _newOwner;
  }
}
```

```js
// deployments/001_ownable.js

const assert = require('assert');

module.exports = async ({ accounts, artifacts, deployer, logger, network }) => {
  const Ownable = artifacts.require('Ownable.sol');

  logger.info(`Hey, I'm running on "${network}".`);

  const ownable = await deployer.deploy(Ownable);
  assert.equal(await ownable.owner(), accounts[0]);

  logger.info('Transferring ownership to another address...');
  await deployer.execute(ownable.transferOwnership, accounts[1]);
  assert.equal(await ownable.owner(), accounts[1]);
};
```

And then you can run the deployment with:

```sh
npx truffle-deploy deployments/001_ownable.js
```

## Contributing

The project is in an early stage. Currently some basic functionalities
are still lacking (e.g. custom transaction options), so feel free to chime in
and create issues/PRs.

## License

[MIT licensed](./LICENSE).
