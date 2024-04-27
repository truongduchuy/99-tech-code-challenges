import { useEffect, useState } from "react"
import { Token, TokenOption } from "../types"

const useGetTokens = (): TokenOption[] => {
    const [tokens, setTokens] = useState<TokenOption[]>([])
    useEffect(() => { 
        fetch('https://interview.switcheo.com/prices.json')
            .then(response => response.json())
            .then((data: Token[]) => {
                const currencies: Record<string, boolean> = {}
                setTokens(data
                    ?.filter(item => {
                    // for removing dulicate currencies
                    if(currencies[item.currency]) {
                        return false
                    }
                    currencies[item.currency] = true
                    return true;
                })?.map((token: Token) => ({ ...token, value: token.currency, label: token.currency })) || [])
            })
    }, [])
    return tokens
}

export default useGetTokens