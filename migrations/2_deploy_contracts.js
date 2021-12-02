var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var PatientRole = artifacts.require("./PatientRole.sol");
var ManufacturerRole = artifacts.require("./ManufacturerRole.sol");
var PharmacistRole = artifacts.require("./PharmacistRole.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(DistributorRole);
  deployer.deploy(PatientRole);
  deployer.deploy(ManufacturerRole);
  deployer.deploy(PharmacistRole);
};
