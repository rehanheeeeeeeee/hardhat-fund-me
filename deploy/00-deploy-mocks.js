// Through this im going to deploy my mock aggregator contractor and then access it in my main file to
// get the pricefeed

const {
    networkConfig,
    testChains,
    decimalPlaces,
    intialValue,
} = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainName = network.name

    // In order to deploy our mock aggregator contracts we need to pass in two parameters to our constructor function
    //  1) The amount of Decimal places which are needed to be removed in order to get the actual number
    //  2) The actual amount with decimal places added onto it which are going to be equivalent to what we specified to
    //  remove

    if (testChains.includes(chainName)) {
        log(
            "Since your trying to deploy on a local network I will go ahead and deploy the mock aggregator contract"
        )
        log(
            "------------------------------------------------------------------------------------------------------"
        )
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [decimalPlaces, intialValue],
        })
        log("Mocks Deployed")
        log("--------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
