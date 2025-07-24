"use client";
import { Input } from "@g4rcez/components";

export default function Home() {
  return (
    <div className="grid gap-16 justify-items-center items-center p-8 pb-20 min-h-screen font-sans sm:p-20 grid-rows-[20px_1fr_20px]">
      <form>
        <Input
          required
          minLength={2}
          error="Ops..."
          name="testing"
          title="Testing"
        />
      </form>
    </div>
  );
}
