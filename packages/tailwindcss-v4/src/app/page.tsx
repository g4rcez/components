"use client";
import { Input } from "@g4rcez/components";

export default function Home() {
    return (
        <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
            <form>
                <Input required minLength={2} error="Ops..." name="testing" title="Testing" />
            </form>
        </div>
    );
}
