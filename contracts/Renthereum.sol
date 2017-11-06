pragma solidity ^0.4.14;

contract Renthereum {

  enum Status {
    AVAILABLE,
    CANCELED,
    RENTED
  }

  struct Order {
    string _id;
    address _renter;
    address _hirer;
    string _name;
    string _description;
    uint256 _value;
    uint _minPeriod;
    uint _maxPeriod;
    Status _status;
  }

  event Ordered(
    string _id,
    address _owner,
    string _name,
    uint256 _value
  );

}
