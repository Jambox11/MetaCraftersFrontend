// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FavouriteDrink {
    string private favouriteDrink;
    address private lastSender;

    // Function to set Favouroite Drink
    function setFavouriteDrink(string memory _favouriteDrink) external {
        favouriteDrink = _favouriteDrink;
        lastSender = msg.sender;
    }

    // Function to retrieve the favourite drink
    function getFavouritedrink() external view returns (string memory) {
        return favouriteDrink;
    }

    // Function to retrieve the sender of the last message
    function getLastSender() external view returns (address) {
        return lastSender;
    }
}
