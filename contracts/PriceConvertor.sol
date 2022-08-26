// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity 0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    function getPrice(AggregatorV3Interface priceFeed)
        public
        view
        returns (uint256)
    {
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price / 1e8);
    }

    function priceConvertor(
        uint256 amountFunded,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 OneEthInUSD = getPrice(priceFeed);
        // Has 18 zeroes extra cause multiplied in terms of wei
        uint256 AmountFundedtoUSD = amountFunded * OneEthInUSD;
        return AmountFundedtoUSD;
    }
}
