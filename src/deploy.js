/**
 * Copyright (c) 2018-present, Axie Infinity, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { join } = require('path');

const deployer = require('./deployer');
const logger = require('./logger');

module.exports = async callback => {
  try {
    const { _, network } = artifacts.options;

    if (_.length <= 1) {
      throw new Error('A deployment must be specified.');
    }

    const path = _[1];
    const accounts = await web3.eth.getAccounts();

    const env = {
      accounts,
      artifacts: {
        require: (...args) => artifacts.require(...args),
      },
      deployer,
      logger,
      network,
      web3,
    };

    const run = require(join(process.cwd(), path));

    console.log(`Running migration: ${path}`);
    console.log();

    await run(env);

    callback();
  } catch (err) {
    callback(err);
  }
};
