pragma solidity ^0.5.0;

contract ASK {
    
    mapping(address => User) public users;
    mapping(address => Airline) public airlines;
    mapping(address => uint) public ticktes;
    
    constructor() public {
        
    }
    
    struct User{
        uint amount;
        bool exists;
    }

    struct Airline{
        bool exists;
    }

    
    function registerUser(address newUser, uint amount) public {
        users[newUser].exists = true;
        ticktes[newUser] = amount;
    }

    function registerAirline(address newAirline, uint amount) public{
        airlines[newAirline].exists = true;
        ticktes[newAirline] = amount;
    }

    
    function reqval(address user, uint val) public view returns(bool){
        if(users[user].exists == true && ticktes[user] == val){
            return true;
        }else{
            return false;
        }
        
    }
    
    function airline_validation(address actual_flight, address requested_flight) public view returns(bool){
        
        if(airlines[actual_flight].exists == true && airlines[requested_flight].exists == true && ticktes[actual_flight] == 34){
            return true;
        }else{
            return false;
        }
    }

    function unregisterUser(address existingUser) public{
        users[existingUser].exists = false;
        delete users[existingUser];
    }

    function unregisterAirline(address existingAirline) public{
        airlines[existingAirline].exists = false;
        delete airlines[existingAirline];

    }
    
    
}