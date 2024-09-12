"use client";
import { DocsLayout } from "@/components/docs-layout";
import React from "react";
import { Card, Input } from "../../../../../lib/src";

export default function FormPage() {
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
          mask="money"
          title="Monetary - Locale from browser"
          placeholder="$$$"
          required
        />
        <Input
          mask="money"
          title="Monetary - Locale en-US"
          locale="en-US"
          placeholder="$$$"
          currency="USD"
          required
        />
        <Input mask="percent" title="Percent %" placeholder="%%%" required />
      </Card>
    </DocsLayout>
  );
}
