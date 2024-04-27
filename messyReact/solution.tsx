import React, { useMemo } from "react";

interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}

const priorityMap = {
    'Osmosis': 100,
    'Ethereum': 50,
    'Arbitrum': 30,
    'Zilliqa': 20,
    'Neo': 20,
}
// move this outside of the component to avoid re-creating it on every render
const getPriority = (blockchain: string): number => {
    return priorityMap[blockchain] || -99;
}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // the filter and sort function could be refactored like below, I also fixed the typo in the code and removed prices from dependencies because it's not used in the function
    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            return balancePriority > -99 && balance.amount <= 0
        })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                return rightPriority - leftPriority;
            });
    }, [balances]);

    // we can move formattedBalances logic into this function to avoid creating a new array
    // classes is not defined in the code, so I'm assuming it's a prop
    const rows = useMemo(() => {
        return sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
            const usdValue = prices[balance.currency] * balance.amount;
            const formatted = balance.amount.toFixed()
            return (
                <WalletRow
                    className={classes.row}
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={formatted}
                />
            )
        })
    }, [prices, sortedBalances])

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}