const ElectionVotingContract = artifacts.require("ElectionVotingContract")

contract("ElectionVotingContract", (accounts) =>{
    let electionVotingContract;
    before(async ()=>{
        electionVotingContract= await ElectionVotingContract.deployed();
    });
    it("Election should be created", async()=>{
        const electionName = "First Election";
        const organizationId = "org1";
        const electionDescription = "This is the first election"
        const candidates= [
            {
                name : "John Doe",
                imgUrl: "firstImg.jpeg",
                Description: "This a first description"
            },
            {
                name : "Abraham Doe",
                imgUrl: "secondImg.jpeg",
                Description: "This a second description"
            },
            {
                name : "Sally Doe",
                imgUrl: "thirdImg.jpeg",
                Description: "This a third description"
            }
        ];
        await  electionVotingContract.createElection(electionName,organizationId,
            electionDescription,candidates,{from: accounts[0]});
        const elections = await electionVotingContract.showExistingElections();
        
        console.log(elections)
        const election = elections[0] ;
        assert.equal(elections.length,1,"Number of elections does not match");
        assert.equal(election.electionName,electionName,"The election name doesn't match");
        assert.equal(election.organizationId,organizationId)
        
    })
})
