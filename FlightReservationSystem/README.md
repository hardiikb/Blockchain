
# MarketPlace App
# Technologies Used :
	Part1 : MEAN Stack (MongoDB, Express, Angular7, Node.js)
	Part2 : Solidity
	Part3 : Truffle, Web3, Ganache 

# Root Folder : "FlightReservationSystem"
## Prerequisite steps for testing the app :

1. Navigate to "FlightReservationSystem" folder. 
2. Using "ng serve --open" command launch the web app on "http://localhost:4200/".
3. Using "mongod" command, start the mongoDB server.
4. Now, launch "Ganache" to start a blochchain server on "http://localhost:7545/".

   [OPTIONAL : run "truffle compile" & "truffle migrate --reset" commands, if necessary.]

5. Using "node server.js",  launch the node server to receive client requests.
 
6. Now, using id provided below, please do a user log in.
		1. 12hb
	

7. Now, to request for a flight change, the user has to be registered on the blockchain network.
		1. To register, click on "connect to blockchain" button.
		2. To unregister, click on "disconnect" button. Then , after he won't be 		   able to change flights.
		 

8. After customer makes flight change request, Now, using id provided below, please do a airline log in.
		1. 12sw



9. Now, the given airline has received flight change request. The airline will check whether the user is registered or not, then it will check in the database as well whether they have seats available. If everything is verified, then it will have options of other airlines to forward the request to.

10. Now, login using "12aa" for the another flight login.

11. Now, this flight have received the request from the previous airline.

12. Now, to exchange seats, both the airlines has to be registered on the blockchain.
		1. To register, click on "connect to blockchain" button.
		2. To unregister, click on "disconnect" button. 

13. Then after, the final airline will check whether both airlines are registered on the 
    Blockchain. Then, it will check whether seats are available or not for the requested  	flight.

14. After all the verification, the final airline sends confirmation using "send confirmation" button. & settles payment using "settle payment" button.


10. If at any point the node server crashes, please restart the server using "node server.js" command. Since, each time the server restarts, the "MarketPlace" contract is mined at a different blockchain address. So, we need to register each and every user again for that particular blockchain address.

11. User and Airline data is stored in "data/db" directory. Please place it on appropriate place on your machine according to mongodb convention for it to work properly.
 

