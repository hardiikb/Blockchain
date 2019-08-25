
# MarketPlace App
# Technologies Used :
	Part1 : MEAN Stack (MongoDB, Express, Angular7, Node.js)
	Part2 : Solidity
	Part3 : Truffle, Web3, Ganache 

# Root Folder : "hbabariy_Lab1"
## Prerequisite steps for testing the app :

1. Navigate to "hbabariy_Lab1" folder. 
2. Using "ng serve --open" command launch the web app on "http://localhost:4200/".
3. Using "mongod" command, start the mongoDB server.
4. Now, launch "Ganache" to start a blochchain server on "http://localhost:7545/".

   [OPTIONAL : run "truffle compile" & "truffle migrate --reset" commands, if necessary.]

5. Using "node server.js",  launch the node server to receive client requests.
 
6. Now, using each id provided below, please log in.
		1. 12hb
		2. 12dj
		3. 12jc
		4. 12od
		5. 12cp

7. Now, to buy & sell things and make transactions, each user has to be registered on the blockchain network.
		1. To register a user on the blockchain, you need a superuser privilage.
		2. To gain a superuser privilage, in the second inputbox, type "superuser" and click "SUPERUSER LOG IN" BUTTON.
		3. Click "MINT SUPERUSER" button to give it a starting balance of 5000.
		4. After superuser log in, "Register" button will appear using which you can register the user with a starting balance of 500 and refill the user balance when necessary.
		5. Using "UnRegister" button, superuser can unregister the user so that he no longer can make the transactions on the blockchain.

8. Each user owns few items in his "cart". Whenever the user wants to put an item on sell, he/she can click "PutOnSale" button to put it on sell & other users can buy it.

9. Now, to buy an item user can click "buy" button in the bottom list. Before clicking the buy button, please make sure that the buyer and seller are registered on the blockchain. If the user is not registered then, node server will crash as the server will not get a proper response from blockchain network. 

10. If at any point the node server crashes, please restart the server using "node server.js" command. Since, each time the server restarts, the "MarketPlace" contract is mined at a different blockchain address. So, we need to register each and every user again for that particular blockchain address.

11. User and Item data is stored in "data/db" directory. Please place it on appropriate place on your machine according to mongodb convention for it to work properly.
 

