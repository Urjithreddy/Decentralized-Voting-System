// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    uint public countCandidates;
    uint256 public votingStart;
    uint256 public votingEnd;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender], "You have already voted");
        _;
    }

    modifier votingActive() {
        require(now >= votingStart && now <= votingEnd, "Voting is not active");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addCandidate(string memory name, string memory party) public onlyOwner returns(uint) {
        countCandidates++;
        candidates[countCandidates] = Candidate(countCandidates, name, party, 0);
        return countCandidates;
    }

    function vote(uint candidateID) public hasNotVoted votingActive {
        require(candidateID > 0 && candidateID <= countCandidates, "Invalid candidate ID");
        voters[msg.sender] = true;
        candidates[candidateID].voteCount++;
    }
    
    function checkVote() public view returns(bool) {
        return voters[msg.sender];
    }

    function getCountCandidates() public view returns(uint) {
        return countCandidates;
    }

    function getCandidate(uint candidateID) public view returns (uint, string memory, string memory, uint) {
        Candidate memory candidate = candidates[candidateID];
        return (candidate.id, candidate.name, candidate.party, candidate.voteCount);
    }

    function setDates(uint256 _startDate, uint256 _endDate) public onlyOwner {
        require(votingEnd == 0 && votingStart == 0, "Voting dates are already set");
        require(_startDate < _endDate, "Start date must be before end date");
        require(_startDate >= now, "Start date must be in the future");
        votingStart = _startDate;
        votingEnd = _endDate;
    }

    function getDates() public view returns (uint256, uint256) {
        return (votingStart, votingEnd);
    }
}
