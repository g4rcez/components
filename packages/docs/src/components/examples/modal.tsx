"use client";
import { Button } from "@g4rcez/components/button";
import { Card } from "@g4rcez/components/card";
import { Modal, type ModalType } from "@g4rcez/components/modal";
import Link from "next/link";
import { useState } from "react";

export const ModalExample = () => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<ModalType>("drawer");
    const onOpen = () => setOpen(true);

    return (
        <Card title={<Link href="/docs/modal">Modal and Drawer</Link>}>
            <div className="flex h-full justify-center py-6">
                <Button onClick={onOpen}>Open modal component</Button>
            </div>
            <Modal closable open={open} type={type} title="Modal" overlayClickClose onChange={setOpen}>
                <p>{"<Modal />"} is the same component for Dialog, Drawer and BottomSheet.</p>
                <div className="my-4 flex flex-wrap gap-4">
                    <Button onClick={() => setType("dialog")}>Change to Dialog</Button>
                    <Button onClick={() => setType("drawer")}>Change to Drawer</Button>
                    <Button onClick={() => setType("sheet")}>Change to BottomSheet</Button>
                </div>
            </Modal>
        </Card>
    );
};
