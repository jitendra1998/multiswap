// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;
// import "math.sol";
// import "hardhat/console.sol";

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    function mint(uint amount) external;
    function burn(uint amount) external;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract Amm {
    uint public abcCoinTotalSupply;
    uint public defCoinTotalSupply;
    uint public ghiCoinTotalSupply;
    uint private product;
    uint private temp;
    address abcCoinAddress;
    address defCoinAddress;
    address lpTokenAddress;
    address public owner;


    constructor(address _abcCoinAddress, address _defCoinAddress, address _ghiCoinAddress) {
        abcCoinAddress = address(_abcCoinAddress);
        defCoinAddress = address(_defCoinAddress);
        lpTokenAddress = address(_ghiCoinAddress);
        owner = (msg.sender);
    }

    function swap(address tokenA, address tokenB, uint amount) public {
        // require(tokenA != (abcCoinAddress || defCoinAddress), "token A is neither abc coin nor def coin");
        // require(tokenB != (abcCoinAddress || defCoinAddress), "token B is neither abc coin nor def coin");
        product = abcCoinTotalSupply * defCoinTotalSupply;
        if (tokenA == abcCoinAddress) {
            abcCoinTotalSupply = abcCoinTotalSupply + amount;
            temp = defCoinTotalSupply - (product/abcCoinTotalSupply);
            IERC20 tokA = IERC20(tokenA);
            IERC20 tokB = IERC20(tokenB);
            require(tokA.balanceOf(msg.sender) >= amount, "You have insufficient funds");
            tokA.transferFrom(msg.sender, address(this), amount);
            require(tokB.balanceOf(address(this)) >= temp, "AMM contract does not have sufficient liquidity");
            tokB.transfer(msg.sender, temp);
            defCoinTotalSupply = defCoinTotalSupply - temp;
        } else if (tokenA == defCoinAddress) {
            defCoinTotalSupply = defCoinTotalSupply + amount;
            temp = abcCoinTotalSupply - (product/defCoinTotalSupply);
            IERC20 tokA = IERC20(tokenA);
            IERC20 tokB = IERC20(tokenB);
            require(tokA.balanceOf(msg.sender) >= amount, "You have insufficient funds");
            tokA.transferFrom(msg.sender, address(this), amount);
            require(tokB.balanceOf(address(this)) >= temp, "AMM contract does not have sufficient liquidity");
            tokB.transfer(msg.sender, temp);
            abcCoinTotalSupply = abcCoinTotalSupply - temp;
        }
    }

    function removeLiquidity(uint _ghiCoinAmount) public {
        IERC20 abcCoin = IERC20(abcCoinAddress);
        IERC20 defCoin = IERC20(defCoinAddress);
        IERC20 lpToken = IERC20(lpTokenAddress);
        require(lpToken.balanceOf(msg.sender) >= _ghiCoinAmount, "You have insufficient funds");
        lpToken.transferFrom(msg.sender, address(this), _ghiCoinAmount);
        ghiCoinTotalSupply += _ghiCoinAmount;
        abcCoin.transfer(msg.sender, _ghiCoinAmount); //need to check logic once
        defCoin.transfer(msg.sender, _ghiCoinAmount);
        abcCoinTotalSupply -= _ghiCoinAmount;
        defCoinTotalSupply -= _ghiCoinAmount;
        product = abcCoinTotalSupply * defCoinTotalSupply;
    }

    function addLiquidity(uint _abcCoinAmount, uint _defCoinAmount) public payable {
        IERC20 abcCoin = IERC20(abcCoinAddress);
        IERC20 defCoin = IERC20(defCoinAddress);
        require(abcCoin.allowance(msg.sender, address(this))>=_abcCoinAmount, "Please approve before adding liquidity");
        require(abcCoin.balanceOf(msg.sender) >= _abcCoinAmount, "You have insufficient funds");
        abcCoin.transferFrom(msg.sender, address(this), _abcCoinAmount);
        require(defCoin.allowance(msg.sender, address(this))>=_defCoinAmount, "Please approve before adding liquidity");
        require(defCoin.balanceOf(msg.sender) >= _defCoinAmount, "You have insufficient funds");
        defCoin.transferFrom(msg.sender, address(this), _defCoinAmount);
        abcCoinTotalSupply += _abcCoinAmount;
        defCoinTotalSupply += _defCoinAmount;
        IERC20 lpToken = IERC20(lpTokenAddress);
        lpToken.mint(sqrt(_abcCoinAmount * _defCoinAmount)); // need to provide access to amm contract to mint lp token
        lpToken.transfer(msg.sender, sqrt(_abcCoinAmount * _defCoinAmount));
        product = abcCoinTotalSupply * defCoinTotalSupply;
    }

    function sqrt(uint256 x) internal pure returns (uint256 result) {
        if (x == 0) {
            return 0;
        }
        uint256 xAux = uint256(x);
        result = 1;
        if (xAux >= 0x100000000000000000000000000000000) {
            xAux >>= 128;
            result <<= 64;
        }
        if (xAux >= 0x10000000000000000) {
            xAux >>= 64;
            result <<= 32;
        }
        if (xAux >= 0x100000000) {
            xAux >>= 32;
            result <<= 16;
        }
        if (xAux >= 0x10000) {
            xAux >>= 16;
            result <<= 8;
        }
        if (xAux >= 0x100) {
            xAux >>= 8;
            result <<= 4;
        }
        if (xAux >= 0x10) {
            xAux >>= 4;
            result <<= 2;
        }
        if (xAux >= 0x8) {
            result <<= 1;
        }

        unchecked {
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1;
            result = (result + x / result) >> 1; // Seven iterations should be enough
            uint256 roundedDownResult = x / result;
            return result >= roundedDownResult ? roundedDownResult : result;
        }
    }

}
