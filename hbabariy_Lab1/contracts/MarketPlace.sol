pragma solidity >=0.4.22 <0.6.0;

contract MarketPlace {
    
    address public minter;

    struct User{
        uint amount;
        bool exists;
    }
    
    mapping(address => User) public balances;
    
    constructor() public {
        minter = msg.sender;
    }
    
    modifier isNotMinter(address superUser, address user){
        require(superUser != user);
        _;
    }
    
    modifier handShake(address seller,address buyer, uint amount){
        require(balances[seller].exists == true);
        require(balances[buyer].exists == true);
        require(balances[buyer].amount > amount);
        _;
    }
    
    function mint(address receiver, uint amount) public {
        require(receiver == minter);
        balances[receiver].amount = amount;
        
    }
    
    function register(address newUser, uint amount) public isNotMinter(minter,newUser){
        balances[newUser].amount = amount;
        balances[minter].amount -= amount;
        balances[newUser].exists = true;

    }
    
    function buy(address seller, address buyer, uint amount) public handShake(seller,buyer,amount) {
        balances[seller].amount += amount;
        balances[buyer].amount -= amount;
    }
    
    function unregister(address existingUser) public isNotMinter(minter,existingUser){
        balances[minter].amount += balances[existingUser].amount;
        balances[existingUser].exists = false;
        delete balances[existingUser];
        
    }
    
    function display(address user) public view returns(uint){
        return balances[user].amount;
    }
    
    function test(address user) public view returns(bool){
        return balances[user].exists;
    }
    
}