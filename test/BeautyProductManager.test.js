const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BeautyProductManager", function () {
  let BeautyProductManager;
  let beautyProductManager;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    BeautyProductManager = await ethers.getContractFactory("BeautyProductManager");
    beautyProductManager = await BeautyProductManager.deploy();
    await beautyProductManager.deployed();
  });

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

  it("Should update product information", async function () {
    this.timeout(60000); 
    const newProduct = {
      product_id: "123456",
      name: "Hydrating Face Serum",
      current_location: "warehouse"
    };

    await expect(beautyProductManager.addBeautyProduct(
      newProduct.product_id,
      JSON.stringify(newProduct)
    )).to.emit(beautyProductManager, "BeautyProductAdded")
      .withArgs("123456");

    const productCount = await beautyProductManager.getBeautyProductCount();
    expect(productCount).to.equal(1);

    const updatedProduct = {
      ...newProduct,
      current_location: "Store A"
    };
    await expect(beautyProductManager.updateProduct("123456", JSON.stringify(updatedProduct)))
      .to.emit(beautyProductManager, "ProductUpdated")
      .withArgs("123456");

    const [product_id, jsonData] = await beautyProductManager.getBeautyProduct("123456");
    expect(product_id).to.equal("123456");
    const parsedProduct = JSON.parse(jsonData);
    expect(parsedProduct.current_location).to.equal("Store A");
  });

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
});