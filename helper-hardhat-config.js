const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", // Aggregator contract address which is going to give us USD in terms of ETH
    },
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}

const testChains = ["hardhat", "localhost"]
const decimalPlaces = 8
const intialValue = 1700332000000

module.exports = { networkConfig, testChains, decimalPlaces, intialValue }
