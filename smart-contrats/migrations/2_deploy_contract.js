
const ElectionVotingContract = artifacts.require("ElectionVotingContract");

module.exports = function(deployer){
    deployer.deploy(ElectionVotingContract);
}