const Voting = artifacts.require("Voting");

contract('Voting', (accounts) => {
  let votingInstance;

  const [owner, voter1, voter2] = accounts;

  beforeEach(async () => {
    votingInstance = await Voting.new();
  });

  it('should deploy the contract and set the owner', async () => {
    const contractOwner = await votingInstance.owner();
    assert.equal(contractOwner, owner, "Owner should be the account that deployed the contract");
  });

  it('should allow the owner to add a candidate', async () => {
    await votingInstance.addCandidate("Alice", "Party A", { from: owner });
    const candidate = await votingInstance.getCandidate(1);
    assert.equal(candidate[1], "Alice", "Candidate name should be Alice");
    assert.equal(candidate[2], "Party A", "Candidate party should be Party A");
    assert.equal(candidate[3].toString(), "0", "Initial vote count should be 0");
  });

  it('should set voting dates correctly', async () => {
    const startDate = Math.floor(Date.now() / 1000) + 5; // 5 seconds from now
    const endDate = startDate + 60; // 1 minute from start
    await votingInstance.setDates(startDate, endDate, { from: owner });
    const dates = await votingInstance.getDates();
    assert.equal(dates[0].toString(), startDate.toString(), "Start date should be set correctly");
    assert.equal(dates[1].toString(), endDate.toString(), "End date should be set correctly");
  });

  it('should allow voting within the active period', async () => {
    const startDate = Math.floor(Date.now() / 1000) + 5; // 5 seconds from now
    const endDate = startDate + 60; // 1 minute from start
    await votingInstance.setDates(startDate, endDate, { from: owner });

    // Wait for 5 seconds to ensure voting period starts
    await new Promise(resolve => setTimeout(resolve, 5000));

    await votingInstance.addCandidate("Alice", "Party A", { from: owner });

    // Vote within the active period
    await votingInstance.vote(1, { from: voter1 });

    const candidate = await votingInstance.getCandidate(1);
    assert.equal(candidate[3].toString(), "1", "Vote count should be 1 after voting");
  });

  it('should not allow voting outside the active period', async () => {
    const startDate = Math.floor(Date.now() / 1000) + 5; // 5 seconds from now
    const endDate = startDate + 60; // 1 minute from start
    await votingInstance.setDates(startDate, endDate, { from: owner });
    await votingInstance.addCandidate("Alice", "Party A", { from: owner });

    // Try voting before the voting period starts
    try {
      await votingInstance.vote(1, { from: voter2 });
      assert.fail("Voting should not be allowed before the start date");
    } catch (error) {
      assert(error.message.includes("Voting is not active"), "Expected 'Voting is not active' error");
    }

    // Wait for 1 minute and try voting after the period ends
    await new Promise(resolve => setTimeout(resolve, 60000));

    try {
      await votingInstance.vote(1, { from: voter2 });
      assert.fail("Voting should not be allowed after the end date");
    } catch (error) {
      assert(error.message.includes("Voting is not active"), "Expected 'Voting is not active' error");
    }
  });
});
