"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { useState } from "react";
import { Card, Input, Locales, CurrencyCode } from "../../../../../lib/src";

export default function FormPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("BRL");
  return (
    <DocsLayout
      title="Input"
      section="form"
      description="The easiest way to receive data from your user. Using the-mask-input as a mask provider you can build custom masks with a good DX and UX."
    >
      <Card
        title="Brazilian masks"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Input mask="cpf" title="CPF" placeholder="000.000.000-00" required />
        <Input
          mask="cnpj"
          title="CNPJ"
          placeholder="00.000.000/0001-00"
          required
        />
        <Input
          mask="cellphone"
          title="Cellphone"
          placeholder="(99) 99999-9999"
          required
        />
      </Card>
      <Card
        title="Custom masks"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        container="mt-6"
      >
        <Input
          info="Pattern: 3 numbers + Space + 3 letters"
          mask="ddd AAA"
          title="Custom"
          placeholder="000 ZZZ"
          required
        />
        <Input mask="int" title="Integer" placeholder="123" required />
        <Input
          info="Input disabled"
          title="Disabled"
          disabled
          defaultValue="000"
          placeholder="disabled"
          required
        />
        <Input
          mask="money"
          title="Monetary - Locale from browser"
          placeholder="$$$"
          required
        />
        <Input
          mask="currency"
          title="Monetary - Locale en-US"
          placeholder="$$$"
          required
        />
        <Input mask="percent" title="Percent %" placeholder="%%%" required />
        <Input
          mask="money"
          locale={currency === "BRL" ? "pt-BR" : "en-US"}
          currency={currency}
          title="Interactive Money"
          placeholder={currency}
          required
          right={
            <select
              value={currency}
              className="bg-transparent border-0"
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
            </select>
          }
        />
      </Card>
    </DocsLayout>
  );
}
