/**
 * Copyright (c) 2018-present, Axie Infinity, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const logger = require('./logger');

exports.deploy = async (contract, ...args) => {
  const name = contract._json.contractName;
  logger.info(`Deploying ${name}...`);

  const instance = await execute(contract.new, ...args);
  logger.info(`${name}: ${instance.address}`);
  contract.address = instance.address;

  return instance;
};

const execute = exports.execute = async (tx, ...args) => {
  try {
    const gas = await tx.estimateGas(...args);
    const promiEvent = tx(...args, { gas });

    promiEvent.on('transactionHash', txHash => {
      logger.info(`... ${txHash}`);
    });

    return await promiEvent;
  } catch (err) {
    if (err.message.match(/(Invalid JSON RPC response|nonce too low)/)) {
      await new Promise(resolve, setTimeout(resolve, 1000));
      return await execute(tx, ...args);
    }

    throw err;
  }
};
