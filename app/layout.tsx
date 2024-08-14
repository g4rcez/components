"use client";
import { isBefore } from "date-fns";
import { AppWindowIcon, NetworkIcon, SmartphoneIcon, WifiIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
    Autocomplete,
    Button,
    Card,
    Checkbox,
    ColType,
    createColumns,
    createTheme,
    DatePicker,
    defaultDarkTheme,
    defaultLightTheme,
    formToJson,
    Input,
    Modal,
    Radiobox,
    Select,
    Stats,
    Switch,
    Tab,
    Table,
    TablePagination,
    Tabs,
    Tag,
    Tooltip,
    useTablePreferences,
} from "../src";
import "../src/index.css";
import { ComponentsProvider } from "../src/hooks/use-translate-context";

const FormExample = () => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const json = formToJson(e.currentTarget);
        console.log(json);
    };
    return (
        <Card title="Inputs">
            <form onSubmit={onSubmit} className="flex gap-6 flex-wrap">
                <Input name="input" required placeholder="Text" title="Text" />
                <Select name="select" required options={options} placeholder="Haskell..." title="Language" />
                <Autocomplete
                    required
                    name="autocomplete"
                    onChange={(e) => console.log("EVENT", e)}
                    options={options}
                    placeholder="Haskell..."
                    title="Select language"
                />
                <Autocomplete
                    required
                    dynamicOption
                    name="autocomplete"
                    onChange={(e) => console.log("EVENT", e)}
                    options={options}
                    placeholder="Haskell..."
                    title="Select or create language"
                />
                <div className="flex items-center flex-nowrap gap-4 min-w-full">
                    <Checkbox name="checkbox">Uncontrolled checkbox</Checkbox>
                    <Checkbox name="disabled-checkbox" disabled>
                        Disabled checkbox
                    </Checkbox>
                    <Checkbox name="disabled-checked-checkbox" defaultChecked disabled>
                        Disabled checkbox
                    </Checkbox>
                </div>
                <div>
                    <Switch name="switch">Toggle</Switch>
                </div>
                <Radiobox name="number" value={1}>
                    One
                </Radiobox>
                <Radiobox name="number" value={2}>
                    Two
                </Radiobox>
                <div className="min-w-full">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Card>
    );
};

const WithDialog = (props: { type: "drawer" | "dialog"; side?: "left" | "right" }) => {
    const [open, setOpen] = useState(false);
    return (
        <Modal
            asChild
            position={props.side}
            type={props.type}
            footer={
                <div className="flex justify-end">
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
            }
            title={`${props.type} example`}
            open={open}
            onChange={setOpen}
            trigger={
                <Button className="capitalize">
                    {props.type} {props.side}
                </Button>
            }
        >
            {Array.from({ length: 20 }).map((_, i) => (
                <p className="w-full break-keep" key={i}>
                    Pellentesque habitant morbi tristique senectus et netus.Nec dubitamus multa iter quae et nos invenerat.Inmensae subtilitatis,
                    obscuris et malesuada fames. Pellentesque habitant morbi tristique senectus et netus.Quo usque tandem abutere, Catilina, patientia
                    nostra? Pellentesque habitant morbi tristique senectus et netus.
                </p>
            ))}
        </Modal>
    );
};

const classNames = "flex flex-row gap-4 flex-wrap items-center";

type Row = {
    id: number;
    name: string;
    date: string;
    languages: string[];
};

const cols = createColumns<Row>((col) => {
    col.add("id", "ID", { type: ColType.Number });
    col.add("name", "Name");
    col.add("date", "Date");
    col.add("languages", "Languages", { Element: (p) => p.value.join(", ") });
});

const data = Array.from({ length: 10 }).map(
    (_, i): Row => ({
        id: i + 1,
        name: `Name ${i}`,
        date: new Date().toISOString(),
        languages: ["Kotlin", "Typescript"],
    })
);

const TableTab = () => {
    const preferences = useTablePreferences<Row>("other-table");
    return <Table {...preferences} operations={false} cols={cols} rows={data} />;
};

const TableView = () => {
    const preferences = useTablePreferences<Row>("table");
    const router = useSearchParams();
    const queryStringPage = (router.get("page") as string) || "";
    const current = Number(queryStringPage) || 1;

    const pagination: TablePagination = {
        hasNext: true,
        hasPrevious: true,
        totalItems: 101,
        pages: 10,
        onChangeSize: console.log,
        sizes: [10, 20, 30, 40, 50],
        current,
        size: 10,
        asLink: ({ className, href, children }) => {
            const link = href === "next" ? current + 1 : href === "previous" ? current - 1 : href;
            return (
                <Link scroll={false} className={className} href={{ query: `page=${link}` }}>
                    {children}
                </Link>
            );
        },
    };
    return (
        <Card className={classNames} title="Table - Backend pagination">
            <Table {...preferences} pagination={pagination} useControl cols={cols} rows={data} />
        </Card>
    );
};

const options = [
    { label: "Kotlin", value: "kt" },
    { label: "Typescript", value: "ts" },
    { label: "Javascript", value: "js" },
    { label: "Java", value: "java" },
];

const DatePickerField = () => {
    const [state, setState] = useState<Date | undefined>(undefined);
    return (
        <Card title="Calendar + Datepicker">
            <div className="flex w-64 flex-row gap-2 items-center">
                <DatePicker
                    date={state}
                    name="date"
                    locale="pt-BR"
                    title="Testing"
                    onChange={setState}
                    disabledDate={(e) => isBefore(e, new Date())}
                />
            </div>
            <span className="whitespace-nowrap">{state?.toISOString() || "Pick a date"}</span>
        </Card>
    );
};

export default function Layout() {
    const stylesLight = createTheme(defaultLightTheme);
    const stylesDark = createTheme(defaultDarkTheme, "dark");
    return (
        <html className="dark bg-background text-foreground">
            <head>
                <title>Components</title>
                <style>{stylesLight}</style>
                <style>{stylesDark}</style>
            </head>
            <body>
                <main className="p-8 flex flex-col gap-8">
                    <ComponentsProvider map={{
                        inputOptionalLabel: "Optional field",
                        tableSortAsc: "asc",
                        tableSortDesc: "desc"
                    }}>
                        <TableView />
                        <div className="grid gap-4 md:grid-cols-4">
                            <Stats Icon={WifiIcon} title="Title">
                                500
                            </Stats>
                            <Stats Icon={SmartphoneIcon} title="Title">
                                500
                            </Stats>
                            <Stats Icon={AppWindowIcon} title="Title">
                                500
                            </Stats>
                            <Stats Icon={NetworkIcon} title="Title">
                                500
                            </Stats>
                        </div>
                        <DatePickerField />
                        <Card className={classNames} title="Button">
                            <Button
                                onClick={() => {
                                    document.documentElement.classList.toggle("dark");
                                }}
                            >
                                Change Theme
                            </Button>
                            <Button theme="raw">raw</Button>
                            <Button theme="main">main</Button>
                            <Button theme="secondary">secondary</Button>
                            <Button theme="info">info</Button>
                            <Button theme="danger">danger</Button>
                            <Button theme="warn">warn</Button>
                            <Button disabled theme="success">
                                Success Disabled
                            </Button>
                            <Button disabled theme="raw">
                                raw
                            </Button>
                            <Button disabled theme="main">
                                main
                            </Button>
                            <Button disabled theme="secondary">
                                secondary
                            </Button>
                            <Button disabled theme="info">
                                info
                            </Button>
                            <Button disabled theme="danger">
                                danger
                            </Button>
                            <Button disabled theme="warn">
                                warn
                            </Button>
                            <Button disabled theme="success">
                                Success
                            </Button>
                            <Button loading theme="raw">
                                raw
                            </Button>
                            <Button loading theme="main">
                                main
                            </Button>
                            <Button loading theme="secondary">
                                secondary
                            </Button>
                            <Button loading theme="info">
                                info
                            </Button>
                            <Button loading theme="danger">
                                danger
                            </Button>
                            <Button loading theme="warn">
                                warn
                            </Button>
                            <Button loading theme="success">
                                Success
                            </Button>
                        </Card>
                        <Card title="Tag" className={classNames}>
                            <Tag theme="raw">raw</Tag>
                            <Tag theme="main">main</Tag>
                            <Tag theme="secondary">secondary</Tag>
                            <Tag theme="info">info</Tag>
                            <Tag theme="danger">danger</Tag>
                            <Tag theme="warn">warn</Tag>
                            <Tag theme="success">Success</Tag>

                            <Tag size={"small"} theme="raw">
                                raw
                            </Tag>
                            <Tag size={"small"} theme="main">
                                main
                            </Tag>
                            <Tag size={"small"} theme="secondary">
                                secondary
                            </Tag>
                            <Tag size={"small"} theme="info">
                                info
                            </Tag>
                            <Tag size={"small"} theme="danger">
                                danger
                            </Tag>
                            <Tag size={"small"} theme="warn">
                                warn
                            </Tag>
                            <Tag size={"small"} theme="success">
                                Success
                            </Tag>
                        </Card>
                        <FormExample />
                        <Card title="Tooltip">
                            <Tooltip title="Hover me">I'm a tooltip</Tooltip>
                        </Card>
                        <Card title="Dialog and Drawer" className={classNames}>
                            <WithDialog type="dialog" />
                            <WithDialog side="left" type="drawer" />
                            <WithDialog side="right" type="drawer" />
                        </Card>
                        <Tabs active="">
                            <Tab title={<span>Testing JSX</span>} label="Mobile label" id="item1">
                                <TableTab />
                            </Tab>
                            <Tab title="Item 2" id="item2">
                                2. Item
                            </Tab>
                            <Tab title="Item 3" id="item3">
                                3. Item
                            </Tab>
                            <Tab title="Item 4" id="item4">
                                4. Item
                            </Tab>
                            <Tab title="Item 5" id="item5">
                                5. Item
                            </Tab>
                            <Tab title="Item 6" id="item6">
                                6. Item
                            </Tab>
                        </Tabs>
                    </ComponentsProvider>
                </main>
            </body>
        </html>
    );
}
