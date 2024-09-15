async function main() {
  const BeautyProductManager = await ethers.getContractFactory("BeautyProductManager");

  // Start deployment, returning a promise that resolves to a contract object
  const beauty_product_manager = await BeautyProductManager.deploy();
  console.log("Contract deployed to address:", beauty_product_manager.address);
  console.log("Contract ABI:", JSON.stringify(beauty_product_manager.interface.format('json'), null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });