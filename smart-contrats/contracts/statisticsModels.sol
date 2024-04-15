//SPDX-License-Identifier:MIT
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
    uint[]candidateVotingCount;
}
struct ElectionTimeSeries{
    string electionId;
    mapping(string=>uint) countStatistics;

}
struct TimeSeries {
    uint timestamp;
    uint value;
}

enum TimeSeriesDateOptions {
    LAST_YEAR,
    LAST_MONTH,
    LAST_DAY
}


