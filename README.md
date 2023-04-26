Computing Voting Dapp

This project demonstrates proof of concept of a blockchain based voting system that supports multiple categories.
It was built on the Ethereum Blockchain Network and currently on the Sepolia Testnet.

It ensures that only a Vote Administrator can Add stakeholders into the system.

It allows the Vote Adminstrator to Delete stakeholders from the system.

It takes security measures into place by ensuring only registered stakeholders can interact with the system.

It takes further security measures into place by ensuring stakeholders need tokens which can only be gotten from the vote adminsitrator to contest for positions and vote for their preferred candidates.

It ensures that only the vote adminsitrator can add and delete categories stakeholders can contest for.

It ensures that only the vote administrator can start the time for stakeholders to contest for positions. 

It ensures that only the vote administrator can start the time for stakeholders to vote for their preffered candidates.

It ensures that only the vote administrator can compile the results of the election.

It allows everyone to view the results of the election from their dashboards.

It allows the vote cordinator to reset the details (Categories, contestants, candidatesscores, voting details) of an election.

Process / Workflow

1. Vote Administrator adds eligible members into the system as students or teachers.
2. Vote Administrator creates categories for elections and specifies the type of stakeholders eligible.
E.g Category:    SUG President              Category: Teaching Cordinator
                 SUG Treasurer                        Vote Administrator

    Eligibility: Students                             Teachers
3. Vote Adminstrator dispatches the amount of tokens needed for contesting and voting to the stakeholders.
4. Vote Adminstrator sets the time for eligible stakeholders to express their interest in the available categories.
5. Eligible stakeholders express their interest in the available categories.
6. Vote Administrator sets the time for all eligible stakeholders to vote for their preferred candidates.
7. Eligible stakeholders vote for their preferred candidates
8. Vote Administrator compiles the result for all the election categories.
9. Stakeholders can view the results from their respective portals.
10. Vote Administrator resets the details of election.

Steps to use
1. Clone Repository
2. Run npm install to install dependencies
3. Setup .env file with Testnet URL (Sepolia) and Private Key.
4. Run npx hardhat run scripts/deploy.js to redeploy contract. 
   //Deployer Address is Vote Cordinator
5. Run npm start to load front end.

              

   
    
