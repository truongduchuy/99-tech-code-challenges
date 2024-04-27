export type Option = {
    label: string;
    value: string;
}

export type Token = {
    currency: string;
    price: number;
}

export type TokenOption = Option & Token
