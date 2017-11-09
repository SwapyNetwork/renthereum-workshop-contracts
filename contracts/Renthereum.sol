pragma solidity ^0.4.14;

contract Renthereum {

  enum Status {
    AVAILABLE,
    CANCELED,
    RENTED
  }

  mapping(uint256 => Order) public itemsToRent;
  uint256 public itemsCount;
  
  struct Order {
    string id;
    address owner;
    address customer;
    string name;
    string description;
    uint256 dailyValue;
    uint minPeriod;
    uint maxPeriod;
    uint rentPeriod;
    Status status;
  }

  event Ordered(
    uint256 _index, 
    string _id,
    address _owner,
    string _name,
    uint256 _value
  );

  event Rented(
    address _owner,
    address _customer,
    uint _period,
    uint256 _value
  );

  event Canceled(
    string _id,
    address _owner,
    string _name,
    uint256 _value 
  );

  function Renthereum() {
    itemsCount = 0;
  }

  modifier isValidItem(uint256 _index, mapping(uint256 => Order) _itemsToRent) {
    require(_index >= 0 && _index < itemsCount && _itemsToRent[_index].status == Status.AVAILABLE);
    _;
  }

  modifier isValidValue(uint _rentPeriod, uint256 _itemValue) {
    require(msg.value == _itemValue * _rentPeriod);
    _;
  }

  modifier isValidPeriod(uint _rentPeriod, uint _minPeriod, uint _maxPeriod){
    require(_rentPeriod >= _minPeriod && _rentPeriod <= _maxPeriod);
    _;
  }

  modifier onlyOwner(address _itemOwner) {
    require(msg.sender == _itemOwner);
    _;
  }

  function rent(uint256 _index, uint _period) payable
    isValidItem(_index, itemsToRent)
    isValidValue(_period, itemsToRent[_index].dailyValue) 
    isValidPeriod(_period, itemsToRent[_index].minPeriod, itemsToRent[_index].maxPeriod)
    public
    returns(bool)
  {
    Order memory item = itemsToRent[_index];  
    item.owner.transfer(msg.value);
    item.customer = msg.sender;
    item.rentPeriod = _period;
    item.status = Status.RENTED;
    itemsToRent[_index] = item;
    Rented(item.owner, msg.sender, _period, msg.value);
    return true;
  }

  function createOrder(
    string _id,
    string _name,
    string _description,
    uint256 _dailyValue,
    uint _minPeriod,
    uint _maxPeriod)
    public
    returns(uint) 
  {
    Order memory item;
    item.owner = msg.sender;
    item.id = _id;
    item.name = _name;
    item.description = _description;
    item.dailyValue = _dailyValue;
    item.minPeriod = _minPeriod;
    item.maxPeriod = _maxPeriod;
    itemsToRent[itemsCount] = item;
    itemsCount++;
    Ordered(itemsCount - 1, _id, item.owner, item.name, item.dailyValue);
    return itemsCount - 1;
  }

  // cancel an available order
  function cancelOrder(uint256 _index)
    isValidItem(_index, itemsToRent)
    onlyOwner(itemsToRent[_index].owner)
    public
    returns(bool)
  {
    Order memory order = itemsToRent[_index];
    order.status = Status.CANCELED;
    itemsToRent[_index] = order;
    Canceled(order.id, order.owner, order.name, order.dailyValue);  
    return true;
  }

}
