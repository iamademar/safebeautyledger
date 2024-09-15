# 1. Tech Stack
The project uses the following technologies:
- Solidity: A programming language for writing smart contracts on the Ethereum blockchain.
- Hardhat: A development environment to compile, deploy, test, and debug Ethereum software.
- Ethers.js: A library for interacting with the Ethereum blockchain and its ecosystem.
- Chai: An assertion library used for testing.
- JavaScript: Used for writing tests and deployment scripts.

# 2. Setup Locally

## To set up the project locally, follow these steps:

### 1. Clone the repository:
```
  git clone <repository-url>
  cd <repository-directory>
```

### 2. Install dependencies:
```
  npm install
```

### 3. Create a .env file in the root directory with the following content:
```
  API_URL=<your_infura_or_alchemy_api_url>
  PRIVATE_KEY=<your_private_key>
```

### 4. Compile the contracts:
```
  npx hardhat compile
```

### 5. Run the tests:
```
  npx hardhat test
```

# Accessing the Contract

To interact with the BeautyProductManager contract, you can refer to the test file BeautyProductManager.test.js. Here is a brief explanation of how the contract is accessed and tested:

- Deploying the Contract:
```
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    BeautyProductManager = await ethers.getContractFactory("BeautyProductManager");
    beautyProductManager = await BeautyProductManager.deploy();
    await beautyProductManager.deployed();
```

- Adding a New Product:
```
  it("Should add a new beauty product", async function () {
    const newProduct = {
      product_id: "12345",
      name: "Hydrating Face Serum",
      brand: "GlowBeauty",
      category: "Skin Care",
      description: "A lightweight, fast-absorbing serum that hydrates and nourishes your skin for a radiant glow.",
      images: [
        {
          url: "https://example.com/images/hydrating-serum-front.jpg",
          alt_text: "Front view of Hydrating Face Serum"
        },
        {
          url: "https://example.com/images/hydrating-serum-back.jpg",
          alt_text: "Back view of Hydrating Face Serum"
        }
      ],
      ingredients: [
        "Hyaluronic Acid",
        "Vitamin C",
        "Aloe Vera",
        "Green Tea Extract"
      ],
      usage_instructions: "Apply 2-3 drops to clean skin before moisturizing, morning and night.",
      size: "30ml",
      weight: "50g",
      current_status: "In manufacturing",
      current_location: "warehouse",
      qa_provider: "FDA",
      qa_status: "Passed",
      qa_date: "2024-02-15",
      qa_report_number: "1234567890",
      qa_report_url: "https://example.com/qa-report/1234567890.pdf"
    };
    await expect(beautyProductManager.addBeautyProduct(
      newProduct.product_id,
      JSON.stringify(newProduct)
    )).to.emit(beautyProductManager, "BeautyProductAdded")
      .withArgs("12345");

    const productCount = await beautyProductManager.getBeautyProductCount();
    expect(productCount).to.equal(1);

    const [product_id, jsonData] = await beautyProductManager.getBeautyProduct("12345");
    expect(product_id).to.equal("12345");
    const parsedProduct = JSON.parse(jsonData);
    expect(parsedProduct.name).to.equal("Hydrating Face Serum");
    expect(parsedProduct.current_location).to.equal("warehouse");
  });
```

- Updating Product Information:
```
  it("Should update product information", async function () {
    this.timeout(60000); 
    const newProduct = {
      product_id: "12345",
      name: "Hydrating Face Serum",
      current_location: "warehouse"
    };

    await beautyProductManager.addBeautyProduct(
      newProduct.product_id,
      JSON.stringify(newProduct)
    );

    const productCount = await beautyProductManager.getBeautyProductCount();
    expect(productCount).to.equal(1);

    const updatedProduct = {
      ...newProduct,
      current_location: "Store A"
    };
    await beautyProductManager.updateProduct("12345", JSON.stringify(updatedProduct));

    const [product_id, jsonData] = await beautyProductManager.getBeautyProduct("12345");
    expect(product_id).to.equal("12345");
    const parsedProduct = JSON.parse(jsonData);
    expect(parsedProduct.current_location).to.equal("Store A");
  });
```

- Retrieving Product History
```
  it("Should retrieve product history", async function () {
    this.timeout(60000);

    const newProduct = {
      product_id: "12345",
      name: "Hydrating Face Serum",
      current_location: "warehouse"
    };

    await beautyProductManager.addBeautyProduct(
      newProduct.product_id,
      JSON.stringify(newProduct)
    );

    const updatedProduct = {
      ...newProduct,
      current_location: "Store A"
    };

    await beautyProductManager.updateProduct("12345", JSON.stringify(updatedProduct));

    const productHistory = await beautyProductManager.getProductHistory("12345");

    expect(productHistory.length).to.equal(2);

    const initialVersion = JSON.parse(productHistory[0].jsonData);
    expect(initialVersion.current_location).to.equal("warehouse");

    const updatedVersion = JSON.parse(productHistory[1].jsonData);
    expect(updatedVersion.current_location).to.equal("Store A");

    expect(productHistory[0].timestamp).to.be.a('object');
    expect(productHistory[1].timestamp).to.be.a('object');
    expect(Number(productHistory[1].timestamp)).to.be.greaterThan(Number(productHistory[0].timestamp));
  });
```


# 4. Explanation of .env
The .env file is used to store environment variables that are sensitive and should not be included in the repository. These variables are used to configure the application, such as API keys and private keys. Here is an example of what the .env file should contain:

```
API_URL = YOU_CAN_ACCESS_ON_ALCHEMY_DASHBOARD
PRIVATE_KEY = YOU_CAN_ACCESS_VIA_METAMASK
CONTRACT_ADDRESS = YOU_CAN_ACCESS_ON_ETHERSCAN_AFTER_YOU_DEPLOYED_CONTRACT
CONTRACT_ABI=YOU_CAN_ACCESS_ON_ETHERSCAN_AFTER_YOU_DEPLOYED_CONTRACT
```


The format of the data being saved on the network would look like this, refer to the Manufacturer-app that would contain the updated format:
```
{
  "product_id": "12345",
  "name": "Hydrating Face Serum",
  "brand": "GlowBeauty",
  "category": "Skin Care",
  "description": "A lightweight, fast-absorbing serum that hydrates and nourishes your skin for a radiant glow.",
  "images": [
    {
      "url": "https://example.com/images/hydrating-serum-front.jpg",
      "alt_text": "Front view of Hydrating Face Serum"
    },
    {
      "url": "https://example.com/images/hydrating-serum-back.jpg",
      "alt_text": "Back view of Hydrating Face Serum"
    }
  ],
  "ingredients": [
    "Hyaluronic Acid",
    "Vitamin C",
    "Aloe Vera",
    "Green Tea Extract"
  ],
  "usage_instructions": "Apply 2-3 drops to clean skin before moisturizing, morning and night.",
  "size": "30ml",
  "weight": "50g",
  "current_status": "In manufacturing",
  "current_location": "warehouse",
  "qa_provider": "FDA",
  "qa_status": "Passed",
  "qa_date": "2024-02-15",
  "qa_report_number": "1234567890",
  "qa_report_url": "https://example.com/qa-report/1234567890.pdf"
}
```
