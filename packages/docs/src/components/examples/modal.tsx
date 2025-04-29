"use client";
import { Card } from "../../../../lib/src/components/display/card";
import { Button } from "../../../../lib/src/components/core/button";
import { useState } from "react";
import { Modal, ModalType } from "../../../../lib/src/components/floating/modal";
import Link from "next/link";

export const ModalExample = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ModalType>("drawer");
  const onOpen = () => setOpen(true);

  return (
    <Card title={<Link href="/docs/modal">Modal and Drawer</Link>}>
      <div className="flex justify-center py-6 h-full">
        <Button onClick={onOpen}>Open modal component</Button>
      </div>
      <Modal
        closable
        open={open}
        type={type}
        title="Modal"
        overlayClickClose
        onChange={setOpen}
      >
        <p>
          {"<Modal />"} is the same component for Dialog, Drawer and
          BottomSheet.
        </p>
        <div className="flex flex-wrap gap-4 my-4">
          <Button onClick={() => setType("dialog")}>Change to Dialog</Button>
          <Button onClick={() => setType("drawer")}>Change to Drawer</Button>
          <Button onClick={() => setType("sheet")}>
            Change to BottomSheet
          </Button>
        </div>
      </Modal>
    </Card>
  );
};
