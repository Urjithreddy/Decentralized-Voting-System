const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
    it("should deploy the contract", async () => {
        const votingInstance = await Voting.deployed();
        assert(votingInstance.address !== '');
    });

    it("should allow a user to register as a contestant", async () => {
        const votingInstance = await Voting.deployed();
        await votingInstance.addContestant("Alice");
        const contestant = await votingInstance.contestants(0);
        assert.equal(contestant.name, "Alice", "Contestant name should be Alice");
    });

    it("should allow a user to vote for a contestant", async () => {
        const votingInstance = await Voting.deployed();
        await votingInstance.vote(0, {from: accounts[0]});
        const contestant = await votingInstance.contestants(0);
        assert.equal(contestant.voteCount, 1, "Contestant vote count should be 1");
    });
});
