const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const sendValue = await ethers.utils.parseEther("1")
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding Amount to the Contract")
    const transactionResponse = await fundMe.fund({ value: sendValue })
    await transactionResponse.wait(1)
    console.log("Amount Funded")
    console.log("------------------------------------------------------")
    console.log("Withdrawing Amount")
    const transactionResponse1 = await fundMe.withdraw()
    await transactionResponse1.wait(1)
    console.log("Amount Successfully Withdrawn")
    const contractBalance = await ethers.provider.getBalance(fundMe.address)
    console.log("Current Contract Balance is now:" + contractBalance)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
