//SPDX-License-Identifier: MIT
pragma solidity ^0.8;
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
        uint timeCreated;
        uint endTime; 
    }
struct CandidateDto{
        string name;
        string imgUrl;
        string Description;
}
struct SingleElectionModel{
        string electionId;
        string electionName;
        address createdby;
        string description;
        string organizationId;
        Candidate[] candidates;
        bool hasVoted;
        uint endTime;
}
    
    