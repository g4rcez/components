// The worker thread that hosts the Tailwind oracle. The linter's rules
// are synchronous and Tailwind's loader is not, so the main thread
// posts a request, blocks on a shared integer, and the worker answers
// through a message port and flips the integer. See client.ts.

import { workerData, type MessagePort } from "node:worker_threads";

import { query } from "./oracle";

type Request = {
    id: number;
    cssFile: string;
    candidates: string[];
    shared: SharedArrayBuffer;
};

const port = workerData.port as MessagePort;

port.on("message", async ({ id, cssFile, candidates, shared }: Request) => {
    let answer;
    try {
        answer = await query(cssFile, candidates);
    } catch (error) {
        answer = { ok: false as const, reason: (error as Error).message };
    }
    port.postMessage({ id, answer });
    const flag = new Int32Array(shared);
    Atomics.store(flag, 0, 1);
    Atomics.notify(flag, 0);
});
