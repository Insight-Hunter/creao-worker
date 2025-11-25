// src/worker/index.ts

import { ReadableStream } from 'web-streams-polyfill/ponyfill';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const CREAO_ACCESS_TOKEN = 'OHAwMipcZ1FcYWhncXcYCQwLImJoJX8XCRUPc2YnbH5MXQoVc2RydSlIDlkPdGN3Y2MMTFlLKA0sJW0UGg4BcWchJH8dCA0IdWBzdnccWQFcezB3JG0CGkhKLDggIjtxUVwaeXBzeH0bWQ4LcmtycywWCAoOdWZwIHgeCVwaPg==';

    const url = `https://api-production.creao.ai/data/mcp/sse?creao_access_token=${CREAO_ACCESS_TOKEN}`;

    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'text/event-stream' },
      });

      // Use ReadableStream polyfill for streaming
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        },
      });

      return new Response(stream, {
        status: response.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (error) {
      return new Response('Error connecting to Creao API', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  },
};
