import React, {useState} from 'react';

export default function useInputChange<T = string, U = HTMLInputElement>(defaultValue: T): [
    T,
    (e: React.FormEvent<U>) => void,
    ($defaultValue?: T) => void,
] {
    const [value, setValue] = useState<T>(defaultValue);

    const onChange = (e: React.FormEvent<U>) => {
        setValue((e.currentTarget as any).value);
    }

    const resetValue = ($defaultValue: T = defaultValue) => {
        setValue($defaultValue);
    }

    return [value, onChange, resetValue];
}
