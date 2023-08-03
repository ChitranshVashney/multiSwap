// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWETH is IERC20 {
    function deposit() external payable;

    function withdraw(uint256 wad) external;
}

interface TetherToken {
    function transfer(address, uint256) external;
}

/**
 * @title AlphaVaultSwap
 * @author Chitranshu Varshney
 * @dev A contract for swapping ERC20 tokens using 0x-API quotes.
 */

contract AlphaVaultSwap is Ownable {
    // AlphaVault custom events
    event WithdrawTokens(IERC20 buyToken, uint256 boughtAmount_);
    event EtherBalanceChange(uint256 wethBal_);
    event BadRequest(uint256 wethBal_, uint256 reqAmount_);
    event ZeroXCallSuccess(bool status, uint256 initialBuyTokenBalance);
    event buyTokenBought(uint256 buTokenAmount);
    event maxTransactionsChange(uint256 maxTransactions);

    /**
     * @dev Event to notify if transfer successful or failed
     * after account approval verified
     */
    event TransferSuccessful(
        address indexed from_,
        address indexed to_,
        uint256 amount_
    );

    error InvalidAddress();
    error Invalid_Multiswap_Data();
    error FillQuote_Swap_Failed(IERC20 buyToken, IERC20 sellToken);

    struct wethInfo {
        uint256 eth_balance;
        IWETH wETH;
    }
    // The WETH contract.
    IWETH public immutable WETH;
    // IERC20 ERC20Interface;

    uint256 public maxTransactions;
    uint256 public fee;

    // address private destination;

    constructor() {
        WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
        maxTransactions = 25;
        fee = 25;
    }

    /**
     * @dev Deposits ERC20 tokens into the contract.
     * @param sellToken The token to deposit.
     * @param amount The amount to deposit.
     */
    function depositToken(IERC20 sellToken, uint256 amount) private {
        sellToken.transferFrom(msg.sender, address(this), amount);
        emit TransferSuccessful(msg.sender, address(this), amount);
    }

    /**
     * @dev Sets the fee for the transactions.
     * @param num The new fee value.
     */
    function setfee(uint256 num) external onlyOwner {
        fee = num;
    }

    /**
     * @dev Sets the maximum transaction limit.
     * @param num The new maximum transaction limit.
     */
    function setMaxTransactionLimit(uint256 num) external onlyOwner {
        maxTransactions = num;
        emit maxTransactionsChange(maxTransactions);
    }

    // Payable fallback to allow this contract to receive protocol fee refunds.
    receive() external payable {}

    fallback() external payable {}

    // Transfer tokens held by this contrat to the sender/owner.
    function withdrawToken(IERC20 token, uint256 amount) internal {
        if (address(token) == 0xdAC17F958D2ee523a2206206994597C13D831ec7) {
            TetherToken(0xdAC17F958D2ee523a2206206994597C13D831ec7).transfer(
                msg.sender,
                amount
            );
        } else {
            token.transfer(msg.sender, amount);
        }
    }

    /**
     * @dev Transfers the fee amount of tokens to the owner.
     * @param token The token to transfer as a fee.
     * @param amount The amount to transfer.
     */
    function withdrawFee(IERC20 token, uint256 amount) internal {
        token.transfer(owner(), amount);
    }

    //Sets destination address to msg.sender
    function setDestination() internal view returns (address) {
        // destination = msg.sender;
        return msg.sender;
    }

    /**
     * @dev Transfers an amount of ETH to a given address.
     * @param amount The amount of ETH to transfer.
     * @param msgSender The address to receive the ETH.
     */
    function transferEth(uint256 amount, address msgSender) internal {
        payable(msgSender).transfer(amount);
    }

    /**
     * @dev Swaps ERC20->ERC20 tokens held by this contract using a 0x-API quote.
     * @param buyToken The token to buy.
     * @param sellToken The token to sell.
     * @param spender The address approved for spending the sellToken.
     * @param swapTarget The target contract to execute the swap.
     * @param swapCallData The data to call the swap function on the swapTarget.
     * @return boughtAmount The amount of buyToken bought.
     */ function fillQuote(
        // The `buyTokenAddress` field from the API response.
        IERC20 buyToken,
        IERC20 sellToken,
        // The `allowanceTarget` field from the API response.
        address spender,
        // The `to` field from the API response.
        address swapTarget,
        // The `data` field from the API response.
        bytes calldata swapCallData
    ) internal returns (uint256) {
        if (spender == address(0)) revert InvalidAddress();
        // Track our balance of the buyToken to determine how much we've bought.
        uint256 boughtAmount = buyToken.balanceOf(address(this));
        sellToken.approve(spender, type(uint128).max);
        (bool success, ) = swapTarget.call{value: 0}(swapCallData);
        emit ZeroXCallSuccess(success, boughtAmount);
        if (!success)
            revert FillQuote_Swap_Failed({
                buyToken: buyToken,
                sellToken: sellToken
            });
        boughtAmount = buyToken.balanceOf(address(this)) - boughtAmount;
        emit buyTokenBought(boughtAmount);
        return boughtAmount;
    }

    /**
     * @dev Swaps multiple ERC20-> multiple ERC20 tokens held by this contract using a 0x-API quote.
     * @param sellToken addresses of sell tokens
     * @param buyToken addresses of sell tokens
     * @param spender The address approved for spending the sellToken.
     * @param swapTarget The target contract to execute the swap.
     * @param swapCallData The data to call the swap function on the swapTarget.
     * @param amount amount of sell token to swap.
     */
    function multiSwap(
        IERC20[] calldata sellToken,
        IERC20[] calldata buyToken,
        address[] calldata spender,
        address payable[] calldata swapTarget,
        bytes[] calldata swapCallData,
        uint256[] memory amount
    ) external payable {
        if (
            !(sellToken.length <= maxTransactions &&
                sellToken.length == buyToken.length &&
                spender.length == buyToken.length &&
                swapTarget.length == spender.length)
        ) revert Invalid_Multiswap_Data();

        wethInfo memory WethInfo = wethInfo(0, WETH);

        if (msg.value > 0) {
            WethInfo.wETH.deposit{value: msg.value}();
            WethInfo.eth_balance = msg.value;
            emit EtherBalanceChange(WethInfo.eth_balance);
        }

        for (uint256 i = 0; i < spender.length; i++) {
            // ETHER & WETH Withdrawl request.
            if (spender[i] == address(0)) {
                if (WethInfo.eth_balance < amount[i]) {
                    emit BadRequest(WethInfo.eth_balance, amount[i]);
                    break;
                }
                if (amount[i] > 0) {
                    WethInfo.eth_balance -= amount[i];
                    WethInfo.wETH.withdraw(amount[i]);
                    transferEth(amount[i], setDestination());
                    emit EtherBalanceChange(WethInfo.eth_balance);
                }
                continue;
            }
            // Condition For using Deposited Ether before using WETH From user balance.
            if (sellToken[i] == WethInfo.wETH) {
                if (sellToken[i] == buyToken[i]) {
                    depositToken(sellToken[i], amount[i]);
                    WethInfo.eth_balance += amount[i];
                    emit EtherBalanceChange(WethInfo.eth_balance);
                    continue;
                }
                WethInfo.eth_balance -= amount[i];
                emit EtherBalanceChange(WethInfo.eth_balance);
            } else {
                depositToken(sellToken[i], amount[i]);
            }

            // Variable to store amount of tokens purchased.
            uint256 boughtAmount = fillQuote(
                buyToken[i],
                sellToken[i],
                spender[i],
                swapTarget[i],
                swapCallData[i]
            );
            uint feeOfSwap = (fee * boughtAmount) / 10000;
            if (buyToken[i] == WethInfo.wETH) {
                WethInfo.eth_balance =
                    WethInfo.eth_balance +
                    boughtAmount -
                    feeOfSwap;
                withdrawFee(WETH, feeOfSwap);
                emit EtherBalanceChange(WethInfo.eth_balance);
            } else {
                withdrawToken(buyToken[i], boughtAmount - feeOfSwap);
                withdrawFee(buyToken[i], feeOfSwap);
                emit WithdrawTokens(buyToken[i], boughtAmount);
            }
        }
        if (WethInfo.eth_balance > 0) {
            withdrawToken(WethInfo.wETH, WethInfo.eth_balance);
            emit EtherBalanceChange(0);
        }
    }
}
