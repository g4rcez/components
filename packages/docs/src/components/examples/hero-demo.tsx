"use client";
import { useState } from "react";
import {
  PageHeader,
  Button,
  Card,
  Dropdown,
  Menu,
  MenuItem,
  Input,
  CurrencyCode,
  Locales,
} from "../../../../lib/src";
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
    <form onSubmit={(e) => e.preventDefault()} className="min-w-full">
      <Input
        mask="currency"
        title="Currency"
        locale={state.locale}
        currency={state.currency}
        right={
          <select
            className="appearance-none bg-transparent p-2"
            onChange={(e) => {
              const val = e.target.value;
              const item = options.find((x) => x.currency === val);
              if (item) setState(item);
            }}
          >
            {options.map((x) => (
              <option value={x.currency}>{x.label}</option>
            ))}
          </select>
        }
      />
    </form>
  );
};

export const HeroDemo = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        title="React Components"
        description="Zero effort, maximum design"
      >
        <Link href="/docs/get-started">
          <Button>Get started</Button>
        </Link>
      </PageHeader>
      <Card className="flex gap-6 flex-wrap">
        <Dropdown trigger="Click">
          <div className="max-w-32">I'm a dropdown component</div>
        </Dropdown>
        <Menu label="Menu">
          <MenuItem title="Item 1">Item 1</MenuItem>
          <MenuItem title="Item 2">Item 2</MenuItem>
          <MenuItem title="Item 2">Item 3</MenuItem>
          <MenuItem title="Item 2">Item 4</MenuItem>
        </Menu>
        <CurrencyShowCase />
      </Card>
    </div>
  );
};
