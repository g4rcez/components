"use client";
import { useState } from "react";
import { Dropdown, Menu, MenuItem, Input, type CurrencyCode, type Locales } from "@g4rcez/components";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

type Opt = { label: string; currency: CurrencyCode; locale: Locales };

const options: Opt[] = [
    { label: "USD - Dollar", currency: "USD", locale: "en-US" },
    { label: "BRL - Real", currency: "BRL", locale: "pt-BR" },
    { label: "EUR - Euro", currency: "EUR", locale: "eu" },
];

const CurrencyShowCase = () => {
    const [state, setState] = useState(options[0]);
    return (
        <form onSubmit={(e) => e.preventDefault()} className="landing-currency-form">
            <Input
                mask="currency"
                title="Currency"
                locale={state.locale}
                currency={state.currency}
                right={
                    <select
                        className="landing-currency-select"
                        aria-label="Currency format"
                        value={state.currency}
                        onChange={(e) => {
                            const val = e.target.value;
                            const item = options.find((x) => x.currency === val);
                            if (item) setState(item);
                        }}
                    >
                        {options.map((x) => (
                            <option key={x.currency} value={x.currency}>
                                {x.label}
                            </option>
                        ))}
                    </select>
                }
            />
        </form>
    );
};

export const HeroDemo = () => {
    return (
        <div className="landing-demo">
            <div className="landing-demo-heading">
                <h3>
                    Small pieces.
                    <br />
                    Endless possibilities.
                </h3>
                <p>A few components, working together.</p>
            </div>
            <CurrencyShowCase />
            <div className="landing-demo-controls">
                <Dropdown trigger="Click">
                    <div className="max-w-32">I'm a dropdown component</div>
                </Dropdown>
                <Menu label="Menu">
                    <MenuItem title="Item 1">Item 1</MenuItem>
                    <MenuItem title="Item 2">Item 2</MenuItem>
                    <MenuItem title="Item 3">Item 3</MenuItem>
                    <MenuItem title="Item 4">Item 4</MenuItem>
                </Menu>
                <Link href="/docs/get-started" className="site-text-link">
                    Get started <ArrowRightIcon size={15} aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
};
