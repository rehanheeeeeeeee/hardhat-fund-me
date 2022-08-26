// This is going to be our own aggregator contract which is going to fetch price feeds for us and we are going to
// deploy it using our deploy-mock.js  in order to be able to access its address and use it sfunctions in order to
// get the price feeds

// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

import "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol";
