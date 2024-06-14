//SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "./models.sol";
import "./statisticsModels.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
contract ElectionVotingContract{
    Election[] private elections;
    address[] private availableAdresses;
    uint16 private election_count; 
    
    mapping(address => mapping(string=>bool)) private votingField;
    event ElectionCreationMessage(uint8,string);
    event VotedMessage(bool,string);
    mapping(string => bytes32[]) private electionField;
    mapping(string => Election[]) private organizationElectionMapping;
    mapping(string => uint[]) private voterTimeHolder;
    
     function createElection(string memory _electionName, string memory organizationId,string memory description,
      CandidateDto[] memory candidatesArg,uint endTime) public payable returns (Election memory) {
        Election storage electionToPersist =  elections.push();
        election_count+=1;
        electionToPersist.electionId = Strings.toString(election_count);
        electionToPersist.electionName = _electionName;
        electionToPersist.createdby = msg.sender;
        electionToPersist.description = description;
        electionToPersist.organizationId = organizationId;
        electionToPersist.timeCreated = block.timestamp;
        electionToPersist.endTime = endTime;
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
        return electionToPersist;
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
        voterTimeHolder[electionId].push(block.timestamp);
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
    function showSingleElection(string memory voterId, string memory electionId) public view returns(SingleElectionModel memory){
        Election memory result;
        bool electionExists = false;
        bool hasVoted = false;
        for(uint i=0 ; i< electionField[electionId].length; i++){
            if(keccak256(abi.encode(voterId)) ==  electionField[electionId][i]){
                hasVoted= true;
                break;
            }
        }
        for(uint16 i = 0; i < elections.length; i++){
            if (keccak256(abi.encode(elections[i].electionId)) == keccak256(abi.encode(electionId))){
                electionExists = true;
                result =  elections[i];
            }


        }
        require(electionExists == true, "The election id doesn't exist");
        SingleElectionModel memory singleElectionModel;
        singleElectionModel.electionId = result.electionId;
        singleElectionModel.electionName = result.electionName;
        singleElectionModel.createdby = result.createdby;
        singleElectionModel.hasVoted = hasVoted;
        singleElectionModel.candidates = result.candidates;
        singleElectionModel.description = result.description;
        singleElectionModel.organizationId = result.organizationId;
        singleElectionModel.timeCreated = result.timeCreated;
        singleElectionModel.endTime = result.endTime;

        return singleElectionModel;
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
                organizationElections[idx] = elections[i];
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
    function generateGeneralStatistics() public view returns (GeneralStatistics memory){
        GeneralStatistics memory statistics;
        uint privateCount  = 0;
        uint totalVoteCounts = 0;
        for(uint i = 0; i < elections.length; i++){
            if (keccak256(abi.encode(elections[i].organizationId)) != 
            keccak256(abi.encode(''))){
                privateCount+=1;

            }
        }
        for(uint i = 0; i < elections.length; i++){
            for(uint j= 0; j < elections[i].candidates.length; j++){
                totalVoteCounts+=elections[i].candidates[j].VoteCount;
            }
        }
        statistics.noOfElections = elections.length;
        statistics.noOfPrivateElections = privateCount;
        statistics.noOfPublicElections = elections.length - privateCount;
        statistics.totalVoteCount = totalVoteCounts;
        return statistics;  

    }
    function getVoterTime(string memory electionId) public view returns (uint[] memory){
        return voterTimeHolder[electionId];
    }
    
}