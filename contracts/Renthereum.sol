pragma solidity ^0.4.14;

contract Renthereum {

  enum Status {
    AVAILABLE,
    CANCELED,
    RENTED
  }

  mapping(uint256 => Order) public itemsForHire;
  uint256 public itemsCount;
  
  struct Order {
    string id;
    address owner;
    address hirer;
    string name;
    string description;
    uint256 value;
    uint minPeriod;
    uint maxPeriod;
    uint hirePeriod;
    Status status;
  }

  event Ordered(
    string _id,
    address _owner,
    string _name,
    uint256 _value
  );

  event Rented(
    address _owner,
    address _hirer,
    uint _period,
    uint256 _value
  );

  event Canceled(
    address _owner,
    string _id,
    string _name,
    uint256 _value 
  );

  modifier isValidItem(uint256 _index, mapping(uint256 => Order) _itemsForHire) {
    require(_index >= 0 && _index < itemsCount && _itemsForHire[_index].status == Status.AVAILABLE);
    _;
  }

  modifier isValidValue(uint _hirePeriod, uint256 _itemValue) {
    require(msg.value == _itemValue * _hirePeriod);
    _;
  }

  modifier isValidPeriod(uint _hirePeriod, uint _minPeriod, uint _maxPeriod){
    require(_hirePeriod >= _minPeriod && _hirePeriod <= _maxPeriod);
    _;
  }

  function hire(uint256 _index, uint _period) payable
    isValidItem(_index, itemsForHire)
    isValidValue(_period, itemsForHire[_index].value) 
    isValidPeriod(_period, itemsForHire[_index].minPeriod, itemsForHire[_index].maxPeriod)
    public
    returns(bool)
  {
    Order item = itemsForHire[_index];  
    item.owner.transfer(msg.value);
    item.hirer = msg.sender;
    item.hirePeriod = _period;
    item.status = Status.RENTED;
    itemsForHire[_index] = item;
    Rented(item.owner, msg.sender, _period, msg.value);
    return true;
  }






}
