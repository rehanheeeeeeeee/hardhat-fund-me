// SPDX-License-Identifier: UNLICENSED

//pragma
pragma solidity ^0.8.8;

// ImportS
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Errors
error FundMe__NotOwner();
error FundMe__transactionNotSuccessful();

//Libraries
import "./PriceConvertor.sol";

/** @title A contract for collecting Funds
 *  @author Rehan Tosif
 *  @notice This contract is smart contract which contains the functionality of accepting and withdrawing funds
 *  @dev This contract uses chain link Price feeds as our library to convert the eth amount funded into USD
 */

contract FundMe {
    // Type Declarations

    using PriceConvertor for uint256;

    // State Variables

    address[] public s_funders;

    mapping(address => uint256) public s_addressToAmountFunded;

    uint256 public constant MINIMUM_USD = 10 * 1e18;

    address immutable i_Owner;

    AggregatorV3Interface public s_priceFeed;

    // Modifiers

    modifier onlyOwner() {
        if (msg.sender != i_Owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    // FUNCTIONS

    // Constructor

    // We are passing in the Price Feed Address (Aggregator Contract address) in order to get the ETH to USD prices.
    // for the specific chain we going to deploy our contract on

    // Now we are also going to create a gloabl variable which is going to access the contract through the address

    constructor(address priceFeedAddress) {
        i_Owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //Recieve And Fallback

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    // External

    //None

    // Public

    /** @notice This function accpets funds
     *  @dev This function uses the chianlink price feeds and also the price convertor library
     */

    function fund() public payable {
        require(
            msg.value.priceConvertor(s_priceFeed) >= MINIMUM_USD,
            "Not Sufficient Funds"
        );

        s_funders.push(msg.sender);

        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    /** @notice This function can only be accessed by the deployer of the contract and withdraws all funds donated
     *  @dev This function uses the onlyOwner Modifier to make sure only the owner of the contract can withdraw the funds
     */

    function withdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint256 i = 0; i < funders.length; i++) {
            s_addressToAmountFunded[funders[i]] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccesss, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!callSuccesss) {
            revert FundMe__transactionNotSuccessful();
        }
    }

    //Internal

    //Empty

    //Private

    // Empty

    //View/pure

    //Empty
}
