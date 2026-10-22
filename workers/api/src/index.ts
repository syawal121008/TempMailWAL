import { Env } from "./types";
import { handleOptions } from "./security/cors";
import { handleApiRequest } from "./routes/api";
import { handleIncomingEmail, ForwardableEmailMessage } from "./email/handler";
import { cleanupExpiredData } from "./services/inbox";

export default {
  /**
   * HTTP Fetch Handler
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions(request, env);
    }

    return handleApiRequest(request, env);
  },

  /**
   * Cloudflare Email Worker Handler
   */
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    await handleIncomingEmail(message, env);
  },

  /**
   * Scheduled Cron Trigger (Data Retention & Cleanup)
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        try {
          const result = await cleanupExpiredData(env);
          if (result.deletedInboxes > 0 || result.deletedMessages > 0) {
            console.log(`[Retention Cleanup] Deleted ${result.deletedInboxes} inboxes and ${result.deletedMessages} messages.`);
          }
        } catch (err) {
          console.error("[Cleanup Error]", err);
        }
      })()
    );
  },
};
