//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

struct GeneralStatistics{
    uint noOfElections;
    uint noOfPrivateElections;
    uint noOfPublicElections;
    uint totalVoteCount;
    
}
struct ElectionSpecificStatistics{
    string electionId;
    uint noOfVoters;
    uint[] candidateList;
      
}

