// Now in this hardhat deploy file we will not be following the traditional methods of importing , creating
// a function and calling it through hardhat. But instead we will create only a function using hre as the parameter
// which is basically the whole hardhat module and access needed pacakges through it in our function itself the
// hardhat packge will be sent as paramter by hardhat-deploy when it calls the function.

// We will then export the function so that it can be called when we deploy our scripts

const { networkConfig, testChains } = require("../helper-hardhat-config.js")
const { network } = require("hardhat")
const verify = require("../utils/verify")

module.exports = async (hre) => {
    // Accessing the getNamedAccounts function and the deployments object from the hre
    const { getNamedAccounts, deployments } = hre

    // Accessing the deploy and log functions from our deployments function

    const { deploy, log } = deployments

    // Accessing the deployer account output from running getNamedAccounts function.

    // This function gets our accounts(wallets) through there names that we can set in the hardhat config file

    // By deployer it means its going to give us the account with the deployer name.

    // We can assign these names to our accounts in hardhat config file

    const { deployer } = await getNamedAccounts()

    // The we should access the chain Id

    const chainId = network.config.chainId

    // Accessing the address of our chainID in our networkConfig dictionary which contain the Price Feed Address

    let aggregatorContractAddress

    // If the network we are deploying our contract is a local network then our aggregator contract address
    // will be set to our mock aggregator contract which we deploy using our mock js

    // Else we will set our address equal to the aggregator contract address of that specific
    // chain which we will access through our helper-hardhat-config file

    if (testChains.includes(network.name)) {
        const mockAggregatorContract = await deployments.get("MockV3Aggregator")
        aggregatorContractAddress = mockAggregatorContract.address
    } else {
        console.log(chainId)
        aggregatorContractAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // Now we have to apply some functionality which changes our address which we pass in on the basis of the chain
    // we deploy our contract

    // We can differentiate b/w chains using the chain ids

    // And go like if chain id is X then address which we pass in will be Y and and if chain id is Z then address which
    // we pass in will be V
    const args = [aggregatorContractAddress]

    const fundme = await deploy("FundMe", {
        from: deployer,
        args: args, // pass in an address of our aggregator contract for our specific chain we are deploying on
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verifying the contracts which are being deployed not on test networks

    console.log("Contract Address:" + fundme.address)
    if (!testChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundme.address, [aggregatorContractAddress])
    }

    log(
        "----------------------------------------------------------------------------------------------------------"
    )
}
module.exports.tags = ["all", "fundme"]
