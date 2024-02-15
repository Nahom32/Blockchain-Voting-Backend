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
        address createdby;
        string description;
        string organizationId;
        Candidate[] candidates;   
    }
    struct CandidateDto{
        string name;
        string imgUrl;
        string Description;

    }
    
    
    Election[] private elections;
    address[] private availableAdresses;
    uint16 private election_count; 
    
    mapping(address => mapping(string=>bool)) private votingField;
    event ElectionCreationMessage(uint8,string);
    event VotedMessage(bool,string);
    mapping(string => bytes32[]) private electionField;
    mapping(string => Election[]) private organizationElectionMapping;
    
    
     function createElection(string memory _electionName, string memory organizationId,string memory description, CandidateDto[] memory candidatesArg) public payable {
        Election storage electionToPersist =  elections.push();
        election_count+=1;
        electionToPersist.electionId = Strings.toString(election_count);
        electionToPersist.electionName = _electionName;
        electionToPersist.createdby = msg.sender;
        electionToPersist.description = description;
        electionToPersist.organizationId = organizationId;
        
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
        organizationElectionMapping[electionToPersist.organizationId].push(electionToPersist);
        emit ElectionCreationMessage(1,"The Election has been Created" );
    }
    
    function voteForACandidate(string memory voterId,string memory electionId,string memory candidateId) public{
        bool  flag = false;
        for(uint i = 0; i < electionField[electionId].length; i++){
            if(electionField[electionId][i] == keccak256(abi.encode(voterId))){
                flag = true;
                break;
            }
        }
        require(flag == false, "The user has already voted");
        Election storage election = elections[parseInt(electionId)-1];
        election.candidates[parseInt(candidateId)-1].VoteCount+=1;
        electionField[electionId].push(keccak256(abi.encode(voterId)));
        emit VotedMessage(true, "Vote recorded successfully");
    }
   function parseInt(string memory _value) public pure returns (uint) {
        bytes memory _bytesValue = bytes(_value);
        uint256 _uintValue;
        for (uint256 i = 0; i < _bytesValue.length; i++) {
            if (
                uint8(_bytesValue[i]) >= 48 &&
                uint8(_bytesValue[i]) <= 57
            ) {
                _uintValue = _uintValue * 10 + (uint8(_bytesValue[i]) - 48);
            }
        }
        return _uintValue;
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
    function fetchByElectionByCreator(address creator) public view returns(Election[] memory){
        uint count = 0;
        for(uint i = 0; i < elections.length; i++){
            if(elections[i].createdby == creator){
                count+=1;
            }
        }
        Election[] memory fetchedElections = new Election[](count);
        uint idx = 0;
        for(uint i = 0; i < elections.length; i++){
            if(elections[i].createdby == creator){
                fetchedElections[idx] = elections[i]; 
            }
        }
        return fetchedElections;

    }
    function fetchByOrganizationId(string memory organizationId) public view returns(Election[] memory){
        uint count = 0;
        for(uint i = 0; i < elections.length; i++){
            if(keccak256(abi.encode(organizationId)) == keccak256(abi.encode(elections[i].organizationId))){
                count+=1;
            }
        }
        Election[] memory organizationElections = new Election[](count);
        uint idx = 0;
        for(uint i = 0; i < elections.length; i++){
            if(keccak256(abi.encode(organizationId)) == keccak256(abi.encode(elections[i].organizationId))){
                organizationElections[i] = elections[idx];
                idx+=1;
            }
        }
        return organizationElections;
    }
    function personalizeElections(string [] memory organizationIds) public view returns(Election [] memory){
        uint count = 0;
        for(uint i = 0; i < organizationIds.length; i++){
            count = count + organizationElectionMapping[organizationIds[i]].length;
        
        }
        count = count + organizationElectionMapping[''].length;
        Election[] memory personalized = new Election[](count);
        uint idx = 0;
        for(uint i = 0; i < organizationIds.length; i++){
            for(uint j =0; j < organizationElectionMapping[organizationIds[i]].length; j++){
                personalized[idx] = organizationElectionMapping[organizationIds[i]][j];
                idx++;

            }
        }
        for(uint i = 0; i < organizationElectionMapping[''].length;i++ ){
            personalized[idx] = organizationElectionMapping[''][i];
            idx++;

        }
        return personalized;

    }
    
}