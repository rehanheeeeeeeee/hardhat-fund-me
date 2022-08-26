// Importing the run function in order to run the verify task in javascript file
const { run } = require("hardhat")

// Creating a verify function in which we are going to call our run function and since our run function takes in two
// parameters one is the task which in our case is verify and a dictionary containing the address and any contructor
// function's arguements

// Therefore our verify function will take in two parameters the address and the arguements so it can pass them
// on to the run function while calling it.

const verify = async (contractAddress, args) => {
    console.log("Intiating Verification....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        console.log("Contract Verified wooohoooo!")
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract is Already Verified bro")
        } else {
            console.log(error)
        }
    }
}

module.exports = verify
