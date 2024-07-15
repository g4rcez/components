"use client";
import React, { Fragment, useState } from "react";
import {
    Autocomplete,
    Button,
    Card,
    ColType,
    createColumns,
    createTheme,
    defaultDarkTheme,
    Input,
    Modal,
    Select,
    Tab,
    Table,
    Tabs,
    Tag,
    TransferList,
    useTablePreferences,
} from "../src";
import "../src/index.css";

const WithDialog = (props: { type: "drawer" | "dialog"; side?: "left" | "right" }) => {
    const [open, setOpen] = useState(false);
    return (
        <Modal
            position={props.side}
            type={props.type}
            footer={
                <div className="flex justify-end">
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
            }
            title={`${props.type}  example`}
            asChild
            onChange={setOpen}
            open={open}
            trigger={
                <Button>
                    {props.type} {props.side}
                </Button>
            }
        >
            {Array.from({ length: 50 }).map((_, i) => (
                <p className="w-full break-keep" key={i}>
                    Pellentesque habitant morbi tristique senectus et netus.Nec dubitamus multa iter quae et nos invenerat.Inmensae subtilitatis,
                    obscuris et malesuada fames. Pellentesque habitant morbi tristique senectus et netus.Quo usque tandem abutere, Catilina, patientia
                    nostra? Pellentesque habitant morbi tristique senectus et netus.
                </p>
            ))}
        </Modal>
    );
};

const classNames = "flex flex-row gap-4 flex-wrap";

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

const data = Array.from({ length: 50 }).map(
    (_, i): Row => ({
        id: i + 1,
        name: `Name ${i}`,
        date: new Date().toISOString(),
        languages: ["Kotlin", "Typescript"],
    })
);

const TableView = () => {
    const preferences = useTablePreferences("table");
    return (
        <Card className={classNames} title="Table">
            <Table {...preferences} cols={cols} rows={data} />
        </Card>
    );
};

const options = [
    { label: "Kotlin", value: "kt" },
    { label: "Typescript", value: "ts" },
    { label: "Javascript", value: "js" },
    { label: "Java", value: "java" },
];

const TransferListView = () => {
    const [source, setSource] = useState(data);
    const [target, setTarget] = useState(data);
    return (
        <Card title="Transfer list">
            <TransferList
                Item={(props) => (
                    <Fragment>
                        {props.data.id}. {props.data.name}
                    </Fragment>
                )}
                reference="id"
                source={source}
                target={target}
                setSource={setSource}
                setTarget={setTarget}
            />
        </Card>
    );
};

export default function Layout() {
    const styles = createTheme(defaultDarkTheme);
    return (
        <html className="bg-background text-foreground">
            <head>
                <title>Components</title>
                <style>{styles}</style>
            </head>
            <body className="p-8 flex flex-col gap-4">
                <Tabs active="" useHash>
                    <Tab title="Item 1" id="item1">1. Item</Tab>
                    <Tab title="Item 2" id="item2">2. Item</Tab>
                    <Tab title="Item 3" id="item3">3. Item</Tab>
                    <Tab title="Item 4" id="item4">4. Item</Tab>
                    <Tab title="Item 5" id="item5">5. Item</Tab>
                    <Tab title="Item 6" id="item6">6. Item</Tab>
                </Tabs>
                {/*<TransferListView />*/}
                <Card>
                    <Input placeholder="Text" title="Text" />
                    <Select options={options} placeholder="Haskell..." title="Language" />
                    <Autocomplete options={options} placeholder="Haskell..." title="Language" />
                </Card>
                <Card className={classNames} title="Button">
                    <WithDialog side="left" type="drawer" />
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
                </Card>
                <Card title="Dialog and Drawer" className={classNames}>
                    <WithDialog type="dialog" />
                    <WithDialog side="right" type="drawer" />
                </Card>
                <TableView />
            </body>
        </html>
    );
}
