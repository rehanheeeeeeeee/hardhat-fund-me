const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const {
    isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { testChains } = require("../../helper-hardhat-config")

//We would only want to run this test when we testing on a test network not when we are on a local network
// So if the name of the network which we deployed onis included in my testCahins then we dont want to run this
// test cause that would mean we are deploying on a test network because testChains is an array consisting of names
// of local networks

// However though if its not included that would mean we are deploying our contract on test or main net then
// we will run this test

// So for this we can use a ternary operator for this test to test wether we should run the test or not

testChains.includes(network.name)
    ? describe.skip // If included then thorugh this code we are going to skip the test
    : describe("FundMe", async () => {
          //If not icnluded then we are going to run this function aka run the test
          let fundMe
          let deployer
          const sendValue = await ethers.utils.parseEther("0.01")
          beforeEach(async () => {
              deployer = await getNamedAccounts().deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("Allows people to withdraw funds", async () => {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address
              )
          })
      })
