//SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/utils/Strings.sol";
contract ElectionVotingContract{
    struct Candidate{
        string id;
        string name;
        string imgUrl;
        string Description;
        uint16 VoteCount;
        string electionId;
    }
    struct Election{
        string electionId;
        string electionName;
        Candidate[] candidates;
   
    }
    struct CandidateDto{
        string name;
        string imgUrl;
        string Description;

    }
    
    
    Election[] private elections;
    address[] private availableAdresses;
    uint16 private election_count; //This is going to be assigned as an id;
    //a variable to check if a person voted
    mapping(address => mapping(string=>bool)) private votingField;
    event ElectionCreationMessage(uint8,string);
    event VotedMessage(bool,string);
    
    
     function createElection(string memory _electionName, CandidateDto[] memory candidatesArg) public payable {
        Election storage electionToPersist =  elections.push();
        election_count+=1;
        electionToPersist.electionId = Strings.toString(election_count);
        electionToPersist.electionName = _electionName;
        uint32 candidate_count = 1;
        for(uint i = 0; i < candidatesArg.length; i++){
            electionToPersist.candidates.push(
                Candidate(
                        Strings.toString(candidate_count),
                        candidatesArg[i].name,
                        candidatesArg[i].imgUrl,
                        candidatesArg[i].Description,
                        0,
                        Strings.toString(election_count)    
                )
            );
            candidate_count+=1;
        }
        emit ElectionCreationMessage(1,"The Election has been Created" );
    }
    
    function voteForACandidate(string memory electionId, string memory candidateId) public {
        require(votingField[msg.sender][electionId]==false);
        bool voted = false;
        for(uint i=0; i < elections.length; i++ ){
            if(keccak256(abi.encodePacked(electionId))
                            == keccak256(abi.encodePacked(elections[i].electionId))){
                for(uint j = 0; j < elections[i].candidates.length; j++){
                    if(keccak256(abi.encodePacked(candidateId))
                        == keccak256(abi.encodePacked(elections[i].candidates[j].id))){
                        elections[i].candidates[j].VoteCount+=1;
                        voted = true;
                        break;
                    }
                }
            }
            if(voted == true){
                break;
            }
        }
        require(voted,"The Data entered is not found");
        votingField[msg.sender][electionId] = true;
         emit VotedMessage(true, "Vote recorded successfully");
        

    }
    function showExistingElections() public view returns(Election[] memory){
        Election[] memory retElections = elections;
        return retElections;

    }
    function showSingleElection(string memory electionId) public view returns(Election memory){
        Election memory result;
        bool electionExists = false;
        for(uint16 i = 0; i < elections.length; i++){
            if (keccak256(abi.encode(elections[i].electionId)) == keccak256(abi.encode(electionId))){
                electionExists = true;
                result =  elections[i];
            }


        }
        require(electionExists == true, "The election id doesn't exist");
        return result;
    }
    
    
    
}