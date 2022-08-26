require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */

const COIN_MARKET_API_KEY = process.env.COIN_MARKET_API_KEY || 1234
const ETEHRSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x123"
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://goerli/example"

module.exports = {
    solidity: {
        compilers: [
            { version: "0.8.8" },
            { version: "0.6.6" },
            { version: "0.5.8" },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6, //We are going to wait 6 blocks in order to confirm our transactions
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "BHD",
        coinmarketcap: COIN_MARKET_API_KEY,
    },
    etherscan: {
        apiKey: { goerli: ETEHRSCAN_API_KEY },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
        looser: {
            default: 2,
        },
    },
}
