type ChunkBuffer = {
  chunks: string[];
  received: Set<number>;
  expected: number;
  timestamp: number;
};

const MAX_WAIT_MS = 5000;
const buffers: Record<string, ChunkBuffer> = {};

export function handleOSCChunk(address: string, index: number, total: number, chunk: string): string | null {
  const now = Date.now();

  if (!buffers[address]) {
    buffers[address] = {
      chunks: new Array(total).fill(""),
      received: new Set(),
      expected: total,
      timestamp: now
    };
  }

  const buffer = buffers[address];
  buffer.chunks[index] = chunk;
  buffer.received.add(index);
  buffer.timestamp = now;

  if (buffer.received.size === total) {
    const fullMessage = buffer.chunks.join("");
    delete buffers[address];
    return fullMessage;
  }

  return null;
}

setInterval(() => {
  const now = Date.now();
  for (const address in buffers) {
    if (now - buffers[address].timestamp > MAX_WAIT_MS) {
      delete buffers[address];
    }
  }
}, 1000);
