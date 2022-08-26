const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { testChians, testChains } = require("../../helper-hardhat-config")

// Unit test are only run on test chains so this test should only run when we run this test on a test  hain

testChains.includes(network.name)
    ? describe("FundMe", async function () {
          let fundMe
          let mockV3Aggregator
          let account
          // Using this ethers utils parseEther function we can pass in ehterium as string and it will return it in wei
          const sendValue = await ethers.utils.parseEther("1")

          beforeEach(async () => {
              // Acquiring an account with name deployer through the getNamedAccounts() function
              const { deployer, user } = await getNamedAccounts()
              account = deployer
              account1 = user
              // Running all our scripts thorugh deployments object's fixture method which runs the scripts of which
              // you would give tag to it in its parameter. Here we gave all tag which is given to both our scripts so
              // its going to run all the scripts
              await deployments.fixture(["all"])

              // Using ether.js's get contract function which is going to grab the most recent deployment of the contrct
              // you provide it the name of and also we are assigning an account to it since we are going to make transacions
              // through this contract in the way of calling functions for testing
              fundMe = await ethers.getContract("FundMe", deployer)

              // Acquiring the mock contract address which should be deployed since we are testing on a test net in order to
              // check if our constructor function has set the value correctly
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
              /** Another way of getting accounts is by using the ether's getSigners function which returns us the array
         * of accounts which we set to that network in our hardhat.config and in case of local hardhat it gives us a
         * list of 10 fake accounts
         *  const accounts = await ethers.getSigners()
`         */

              // A test set up specially for the constructor function
          })
          describe("constructor", async () => {
              it("sets the aggregator contract correctly", async () => {
                  // Running the priceFeed as a function will give us the address of the of the contract stored inside of it.
                  const aggregatorContractAddress = await fundMe.s_priceFeed()

                  // Since we deployed the fund me contract on a testnet therefore the Aggregator Contract Address stored
                  // inside of price feed should be equal to the mock aggregator contract address
                  assert.equal(
                      aggregatorContractAddress,
                      mockV3Aggregator.address
                  )
              })
          })
          describe("fund", async () => {
              it("Transaction gets reverted due to Insufficient Funds", async function () {
                  // Here if we call our fund function without sending any money then the transaction is going to be
                  // reverted that's when we can say our function works properly.
                  // In order to check if our transaction got reverted or not we can use the expect keyword
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Not Sufficient Funds"
                  )
              })
              it("Updates the data structure", async function () {
                  // To be able to send value through our fund function we should add an object and set the value property
                  // to the amount we want to send

                  // Since we are trying to test if our fund function updates the mapping we need to send money with ir.

                  await fundMe.fund({ value: sendValue })

                  const amountFunded = await fundMe.s_addressToAmountFunded(
                      account
                  )

                  assert.equal(amountFunded.toString(), sendValue)
              })
              it("Adds Funders To the Funder's Array", async function () {
                  await fundMe.fund({ value: sendValue })

                  const funder = await fundMe.s_funders(0)

                  assert.equal(funder, account)
              })
          })
          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("Owner is able to Withdraw Eth", async () => {
                  // Getting the starting balances of the contract and account through which the contract was deployed
                  const startingContractBalance =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(account)

                  // Withdrawing the balance out of the contract

                  const transactionResponse = await fundMe.withdraw()
                  const transactionRecipet = await transactionResponse.wait(1)

                  // Grabing the the amount of gas used and effective gas price (gas price unit) in order to calculate the total gas price
                  // we paid so we can calculate our final balance.

                  const { gasUsed, effectiveGasPrice } = transactionRecipet

                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  // Getting the balances of the contract and the account after the withdrawel

                  const endingContractBalance =
                      await ethers.provider.getBalance(fundMe.address)
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(account)

                  // Asserts

                  //(1) Our contract balance should be 0 after the withdrawel

                  assert.equal(endingContractBalance.toString(), "0")

                  //(2) Our contract balance should be transferred to our account thereforce our contract balance is
                  // addition made to the starting balance

                  // But the dpeloyer also spent gas fee in order to CALL the withdraw function.
                  // So we have to subtract that as well in order to get the actual ending balance

                  assert.equal(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .sub(gasCost)
                          .toString(),
                      endingDeployerBalance.toString()
                  )
              })
              it("Allow us to withdraw funds with multiple funders", async () => {
                  // Gets all the accounts related to our network
                  const accounts = await ethers.getSigners()

                  // Loop through each account in the array and make a transaction from it to our
                  // contract from the fund function.

                  // We are going to avoid sending payments through our first account as it is our deployer ac

                  for (let index = 1; index < 6; index++) {
                      // First in order to make payment to our contract we need to connect it with our contract
                      const connectedAccount = await fundMe.connect(
                          accounts[index]
                      )
                      await connectedAccount.fund({ value: sendValue })
                  }

                  // Getting the starting balances of the contract and account through which the contract was deployed
                  const startingContractBalance =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(account)

                  // Withdrawing the balance out of the contract

                  const transactionResponse = await fundMe.withdraw()
                  const transactionRecipet = await transactionResponse.wait(1)

                  // Grabing the the amount of gas used and effective gas price (gas price unit) in order to calculate the total gas price
                  // we paid so we can calculate our final balance.

                  const { gasUsed, effectiveGasPrice } = transactionRecipet

                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  // Getting the balances of the contract and the account after the withdrawel

                  const endingContractBalance =
                      await ethers.provider.getBalance(fundMe.address)
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(account)

                  // Asserts

                  //(1) Our contract balance should be 0 after the withdrawel

                  assert.equal(endingContractBalance.toString(), "0")

                  //(2) Our contract balance should be transferred to our account thereforce our contract balance is
                  // addition made to the starting balance

                  // But the dpeloyer also spent gas fee in order to CALL the withdraw function.
                  // So we have to subtract that as well in order to get the actual ending balance

                  assert.equal(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .sub(gasCost)
                          .toString(),
                      endingDeployerBalance.toString()
                  )

                  // If i access any element in my funders array it should throw an error which can be considered as revert

                  await expect(fundMe.s_funders(0)).to.be.reverted

                  for (let index = 1; index < 6; index++) {
                      assert.equal(
                          await fundMe.s_addressToAmountFunded(
                              accounts[index].address
                          ),
                          0
                      )
                  }
              })
              it("Only owner can withdraw the funds", async () => {
                  const accounts = await ethers.getSigners()

                  // Asserts

                  for (let index = 1; index < 6; index++) {
                      const ConnectedToContract = await fundMe.connect(
                          account[index]
                      )
                      expect(ConnectedToContract.withdraw()).to.be.revertedWith(
                          "FundMe__NotOwner"
                      )
                  }

                  expect(fundMe.withdraw()).not.to.be.reverted
              })
          })
      })
    : describe.skip

/** In order to test out multiple functions of our contract we will create different tests for them especially targetting them */
