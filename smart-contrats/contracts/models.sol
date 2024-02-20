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
    }
    struct CandidateDto{
        string name;
        string imgUrl;
        string Description;

}
    