
const ElectionVotingContract = artifacts.require("ElectionVotingContract");
// const ElectionStatisticsContract = artifacts.require("ElectionStatisticsContract");

module.exports = async function(deployer){
    await deployer.deploy(ElectionVotingContract);
    const electionVotingContractInstance = await ElectionVotingContract.deployed();
    // await deployer.deploy(ElectionStatisticsContract, electionVotingContractInstance.address);
}
