import React, { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useGetTokens from '../hooks/useGetTokens';
import Select from 'react-select';
import { TokenOption } from '../types';

const schema = yup.object().shape({
    fromAmount: yup
        .number()
        .typeError('From value must be a number')
        .required('From value is required')
        .test(
            'is-decimal',
            'Invalid decimal - max 3 decimal places',
            (value) => {
                const regex = /^\d+(\.\d{1,3})?$/;
                return regex.test(value + "");
            },
        ).nullable(),
    toAmount: yup
        .number().nullable(),
    fromCurrency: yup
        .string().required('From Currency is required').nullable(),
    toCurrency: yup
        .string().required('To Currency is required').nullable(),
});

type FormValues = yup.InferType<typeof schema>;

const FancyForm: React.FC = () => {
    const { handleSubmit, control, formState: { errors }, setValue, reset, watch } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState(false)
    const formData = watch()

    const tokens = useGetTokens()

    const onSubmit = async (data: FormValues) => {
        console.log(data);
        const fromPrice = tokens?.find(t => t.currency === data.fromCurrency)?.price ?? 0;
        const toPrice = tokens?.find(t => t.currency === data.toCurrency)?.price ?? 0;
        const exchangeRate = fromPrice / toPrice;
        const toAmount = (exchangeRate * (data.fromAmount || 0)).toFixed(3);
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setValue('toAmount', parseFloat(toAmount));
        setLoading(false);
    }

    const handleChangeCurrency = (field: keyof FormValues, option: TokenOption) => {
        setValue(field, option.currency);

    }

    const handleReset = () => {
        reset({
            fromAmount: null,
            toAmount: null,
        })
    }

    const selectedFromCurrency = useMemo(() => {
        return tokens?.find(token => token.currency === formData.fromCurrency) || null
    }, [tokens, formData.fromCurrency])
    const selectedToCurrency = useMemo(() => {
        return tokens?.find(token => token.currency === formData.toCurrency) || null
    }, [tokens, formData.toCurrency])

    return (
        <section className="fancy-form-section">
            <h2>Fancy Form</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <div className="flex gap-4 w-full">
                        <div className="flex-1">
                            <label>From Currency</label>
                            <Select
                                className="rounded-lg text-sm"
                                isSearchable
                                onChange={(selectedOption) => handleChangeCurrency('fromCurrency', selectedOption as TokenOption)}
                                options={tokens}
                                value={selectedFromCurrency}
                                formatOptionLabel={({ value }) => {
                                    return (
                                        (
                                            <div className="flex gap-2">
                                                <img className="w-5 h-5" src={`/tokens/${value}.svg`} alt={value} />
                                                <span className="text-sm">{value}</span>
                                            </div>
                                        )
                                    )
                                }}
                            />
                            <p className="error">{errors.fromCurrency?.message}</p>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="fromAmount">From Amount</label>
                            <div>
                                <Controller
                                    name="fromAmount"
                                    control={control}
                                    render={({ field: { onChange, value } }) => <input className="h-[38px]" id="fromAmount" value={value || ''} onChange={onChange} />}
                                />
                            </div>
                            <p className="error">{errors.fromAmount?.message}</p>
                        </div>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_4162_8002" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                            <rect width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_4162_8002)">
                            <path d="M12 15.5L16.5 11L15.075 9.6L12 12.675L8.925 9.6L7.5 11L12 15.5ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22Z" fill="#00383D" />
                        </g>
                    </svg>

                    <div className="flex gap-4 w-full">
                        <div className="flex-1">
                            <label>To Currency</label>
                            <Select
                                className="rounded-lg text-sm"
                                isSearchable
                                onChange={(selectedOption) => handleChangeCurrency('toCurrency', selectedOption as TokenOption)}
                                options={tokens}
                                value={selectedToCurrency}
                                formatOptionLabel={({ value }) => {
                                    return (
                                        (
                                            <div className="flex gap-2">
                                                <img className="w-5 h-5" src={`/tokens/${value}.svg`} alt={value} />
                                                <span className="text-sm">{value}</span>
                                            </div>
                                        )
                                    )
                                }}
                            />
                            <p className="error">{errors.toCurrency?.message}</p>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="toAmount">To Amount</label>
                            <div>
                                <Controller
                                    name="toAmount"
                                    control={control}
                                    render={({ field: { onChange, value } }) => <input readOnly className="h-[38px]" id="toAmount" value={value || ''} onChange={onChange} />}
                                />
                            </div>
                            <p className="error">{errors.toAmount?.message}</p>
                        </div>
                    </div>
                </fieldset>

                <div className="actions">
                    <button type="button" onClick={handleReset}>Reset</button>
                    <button type="submit" disabled={loading} className="disabled:opacity-50">Swap</button>
                </div>
            </form>
        </section>

    );
};

export default FancyForm;