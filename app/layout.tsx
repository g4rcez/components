"use client";
import React, { useState } from "react";
import { Button, Card, createTheme, defaultLightTheme, Tag } from "../src";
import "../src/index.css";
import { Modal } from "../src/components/floating/modal";

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
            trigger={<Button>{props.type} {props.side}</Button>}
        >
            {Array.from({ length: 50 }).map((_, i) => (
                <p key={i}>
                    Pellentesque habitant morbi tristique senectus et netus.Nec dubitamus multa iter quae et nos invenerat.Inmensae subtilitatis,
                    obscuris et malesuada fames.Pellentesque habitant morbi tristique senectus et netus.Quo usque tandem abutere, Catilina, patientia
                    nostra?
                </p>
            ))}
        </Modal>
    );
};

export default function Layout() {
    const styles = createTheme(defaultLightTheme);
    return (
        <html className="bg-background text-foreground">
            <head>
                <style>{styles}</style>
            </head>
            <body className="p-8">
                <Card className="p-8 flex flex-wrap items-center gap-8 h-[2000px]">
                    <WithDialog type="dialog" />
                    <WithDialog side="right" type="drawer" />
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

                    <Tag theme="raw">raw</Tag>
                    <Tag theme="main">main</Tag>
                    <Tag theme="secondary">secondary</Tag>
                    <Tag theme="info">info</Tag>
                    <Tag theme="danger">danger</Tag>
                    <Tag theme="warn">warn</Tag>
                    <Tag theme="success">Success</Tag>
                </Card>
            </body>
        </html>
    );
}
