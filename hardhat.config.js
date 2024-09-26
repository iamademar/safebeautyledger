/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
   defaultNetwork: "holesky", //hardhat
   networks: {
      hardhat: {
        accounts: {
          accountsBalance: "10000000000000000000000" // 10,000 ETH
        }
      },
      holesky: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`]
      }
   }
};
