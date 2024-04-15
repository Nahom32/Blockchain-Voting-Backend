//SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "./VotingContract.sol";
import "./StatisticsModels.sol";


contract ElectionStatisticsContract{
     
     
     address public votingAddress;
     ElectionVotingContract electionVotingContract;

     constructor(address _votingAddress ){
        
        votingAddress = _votingAddress;
        electionVotingContract = ElectionVotingContract(votingAddress);
     }
    
    function getVoterTrends(string memory electionId) public view returns (TimeSeries[] memory) {
        uint[] memory timestamps = electionVotingContract.getVoterTime(electionId);
        uint[] memory voteCounts = new uint[](timestamps.length);
        for (uint i = 0; i < timestamps.length; i++) {
            uint voteCount = 0;
            for (uint j = 0; j < timestamps.length; j++) {
                if (timestamps[j] <= timestamps[i]) {
                    voteCount++;
                }
            }
            voteCounts[i] = voteCount;
        }

        TimeSeries[] memory voterTrends = new TimeSeries[](timestamps.length);
        for (uint i = 0; i < timestamps.length; i++) {
            voterTrends[i] = TimeSeries(timestamps[i], voteCounts[i]);
        }

        return voterTrends;
    }

    
}