// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BeautyProductManager {
    // Define a struct to represent a version of a beauty product
    struct BeautyProductVersion {
        string jsonData;  // JSON data containing product details
        uint256 timestamp;  // Timestamp of when this version was created
    }

    // Define a struct to represent a beauty product
    struct BeautyProduct {
        string product_id;  // Unique identifier for the product
        BeautyProductVersion[] versions;  // Array of product versions
    }

    // Array to store all beauty products
    BeautyProduct[] private beautyProducts;

    // Events to be emitted when products are added or updated
    event BeautyProductAdded(string product_id);
    event ProductUpdated(string product_id);

    // Function to add a new beauty product
    function addBeautyProduct(string memory _product_id, string memory _jsonData) public {
        // Create a new BeautyProduct and add it to the array
        BeautyProduct storage newProduct = beautyProducts.push();
        newProduct.product_id = _product_id;
        // Add the first version of the product
        newProduct.versions.push(BeautyProductVersion({
            jsonData: _jsonData,
            timestamp: block.timestamp
        }));
        // Emit event to signal product addition
        emit BeautyProductAdded(_product_id);
    }

    // Helper function to find the index of a product by its product_id
    function findProductIndex(string memory _product_id) private view returns (uint256) {
        for (uint256 i = 0; i < beautyProducts.length; i++) {
            if (keccak256(bytes(beautyProducts[i].product_id)) == keccak256(bytes(_product_id))) {
                return i;
            }
        }
        return beautyProducts.length;
    }

    // Function to update an existing product
    function updateProduct(string memory _product_id, string memory _jsonData) public {
        // Find the product with the given product_id
        uint256 index = findProductIndex(_product_id);
        require(index < beautyProducts.length, "Product does not exist");

        // Add a new version to the product's versions array
        beautyProducts[index].versions.push(BeautyProductVersion({
            jsonData: _jsonData,
            timestamp: block.timestamp
        }));

        // Emit event to signal product update
        emit ProductUpdated(_product_id);
    }

    // Function to get the latest version of a beauty product
    function getBeautyProduct(string memory _product_id) public view returns (string memory, string memory) {
        // Find the product with the given product_id
        uint256 index = findProductIndex(_product_id);
        require(index < beautyProducts.length, "Product does not exist");

        BeautyProduct storage product = beautyProducts[index];
        // Get the latest version of the product
        BeautyProductVersion storage latestVersion = product.versions[product.versions.length - 1];
        // Return the product ID and the latest version's JSON data
        return (product.product_id, latestVersion.jsonData);
    }

    // Function to get the full version history of a product
    function getProductHistory(string memory _product_id) public view returns (BeautyProductVersion[] memory) {
        // Find the product with the given product_id
        uint256 index = findProductIndex(_product_id);
        require(index < beautyProducts.length, "Product does not exist");
        
        // Return the entire versions array for the product
        return beautyProducts[index].versions;
    }

    // Function to get the total number of beauty products
    function getBeautyProductCount() public view returns (uint256) {
        return beautyProducts.length;
    }

    // Function to get the latest versions of all beauty products
    function getAllLatestProducts() public view returns (string[] memory, string[] memory) {
        string[] memory productIds = new string[](beautyProducts.length);
        string[] memory latestJsonData = new string[](beautyProducts.length);

        for (uint256 i = 0; i < beautyProducts.length; i++) {
            BeautyProduct storage product = beautyProducts[i];
            productIds[i] = product.product_id;
            latestJsonData[i] = product.versions[product.versions.length - 1].jsonData;
        }

        return (productIds, latestJsonData);
    }
}