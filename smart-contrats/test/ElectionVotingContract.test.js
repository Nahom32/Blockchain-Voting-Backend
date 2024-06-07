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
        const randomTimeValue = 11111;
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
            electionDescription,candidates,randomTimeValue,{from: accounts[0]});
        const elections = await electionVotingContract.showExistingElections();
        
        console.log(elections)
        const election = elections[0] ;
        assert.equal(elections.length,1,"Number of elections does not match");
        assert.equal(election.electionName,electionName,"The election name doesn't match");
        assert.equal(election.organizationId,organizationId)
        
    })
    it("Elector should vote for a candidate", async () =>{
        const voterId = "1";
        const candidateId = "1";
        const electionId = "1";
        await electionVotingContract.voteForACandidate(voterId, electionId,candidateId,{from:accounts[0]});
        const elections = await electionVotingContract.showExistingElections();
        const election = elections[0]
        assert.equal(election.candidates[0].VoteCount, 1, "the election wasn't successful");

    })
    it("Elector shouldn't vote for the same election", async ()=>{
        const voterId = "1";
        const candidateId = "2";
        const electionId = "1";
        try{
            await electionVotingContract.voteForACandidate(voterId, electionId,candidateId,{from:accounts[0]});
        }catch(e){
            console.log("The user has already voted")
        }
        const elections = await electionVotingContract.showExistingElections();
        const election = elections[0]
        assert.equal(election.candidates[1].VoteCount, 0, "a candidate voted  twice for the same elections");


    })
})
