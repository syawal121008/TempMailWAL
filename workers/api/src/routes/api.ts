import { Env, Inbox } from "../types";
import { getCorsHeaders } from "../security/cors";
import { hashToken } from "../security/crypto";
import { createInbox, getInboxByTokenHash, deleteInbox } from "../services/inbox";
import { getMessagesForInbox, getMessageById, deleteMessage } from "../services/message";

function jsonResponse(data: unknown, status: number = 200, corsHeaders: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

/**
 * Extracts and verifies Bearer token from Authorization header.
 * Returns the Inbox object if authenticated, or null.
 */
async function authenticateRequest(
  request: Request,
  env: Env
): Promise<{ inbox: Inbox | null; errorResponse?: Response }> {
  const corsHeaders = getCorsHeaders(request, env);
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      inbox: null,
      errorResponse: jsonResponse(
        { success: false, error: "Missing or invalid Authorization header" },
        401,
        corsHeaders
      ),
    };
  }

  const rawToken = authHeader.substring(7).trim();
  if (!rawToken || rawToken.length < 16) {
    return {
      inbox: null,
      errorResponse: jsonResponse(
        { success: false, error: "Invalid token format" },
        401,
        corsHeaders
      ),
    };
  }

  const tokenHash = await hashToken(rawToken);
  const inbox = await getInboxByTokenHash(env, tokenHash);

  if (!inbox) {
    return {
      inbox: null,
      errorResponse: jsonResponse(
        { success: false, error: "Inbox not found, expired, or invalid token" },
        404,
        corsHeaders
      ),
    };
  }

  return { inbox };
}

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const corsHeaders = getCorsHeaders(request, env);

  try {
    // 1. Health check
    if (pathname === "/api/v1/health" && method === "GET") {
      return jsonResponse(
        {
          success: true,
          status: "healthy",
          service: "Syawal TempMail API",
          domain: env.EMAIL_DOMAIN || "syawaltzy.my.id",
          timestamp: Date.now(),
        },
        200,
        corsHeaders
      );
    }

    // 2. Create Inbox: POST /api/v1/inboxes
    if (pathname === "/api/v1/inboxes" && method === "POST") {
      let requestedMinutes: number | undefined;
      try {
        const body = (await request.json()) as { expiration_minutes?: number };
        if (body && body.expiration_minutes) {
          requestedMinutes = Number(body.expiration_minutes);
        }
      } catch {
        // No body or invalid JSON is fine, use default
      }

      const { inbox, rawToken } = await createInbox(env, requestedMinutes);

      return jsonResponse(
        {
          success: true,
          data: {
            id: inbox.id,
            address: inbox.address,
            token: rawToken, // Returned ONLY here!
            expires_at: inbox.expires_at,
            created_at: inbox.created_at,
          },
        },
        201,
        corsHeaders
      );
    }

    // 3. Authenticated routes under /api/v1/inboxes/me
    if (pathname.startsWith("/api/v1/inboxes/me")) {
      const { inbox, errorResponse } = await authenticateRequest(request, env);
      if (errorResponse || !inbox) return errorResponse!;

      // GET /api/v1/inboxes/me
      if (pathname === "/api/v1/inboxes/me" && method === "GET") {
        return jsonResponse(
          {
            success: true,
            data: {
              id: inbox.id,
              address: inbox.address,
              expires_at: inbox.expires_at,
              created_at: inbox.created_at,
              remaining_seconds: Math.max(
                0,
                Math.floor((inbox.expires_at - Date.now()) / 1000)
              ),
            },
          },
          200,
          corsHeaders
        );
      }

      // DELETE /api/v1/inboxes/me
      if (pathname === "/api/v1/inboxes/me" && method === "DELETE") {
        await deleteInbox(env, inbox.id);
        return jsonResponse(
          { success: true, message: "Inbox deleted successfully" },
          200,
          corsHeaders
        );
      }

      // GET /api/v1/inboxes/me/messages
      if (pathname === "/api/v1/inboxes/me/messages" && method === "GET") {
        const limitParam = parseInt(url.searchParams.get("limit") || "50", 10);
        const offsetParam = parseInt(url.searchParams.get("offset") || "0", 10);
        const limit = Math.min(Math.max(1, limitParam), 100);
        const offset = Math.max(0, offsetParam);

        const { messages, total } = await getMessagesForInbox(
          env,
          inbox.id,
          limit,
          offset
        );

        return jsonResponse(
          {
            success: true,
            data: {
              messages,
              total,
              limit,
              offset,
            },
          },
          200,
          corsHeaders
        );
      }

      // Message item routes: /api/v1/inboxes/me/messages/:messageId
      const messageIdMatch = pathname.match(/^\/api\/v1\/inboxes\/me\/messages\/([a-zA-Z0-9-]+)$/);
      if (messageIdMatch) {
        const messageId = messageIdMatch[1];

        // GET single message detail
        if (method === "GET") {
          const message = await getMessageById(env, inbox.id, messageId);
          if (!message) {
            return jsonResponse(
              { success: false, error: "Message not found" },
              404,
              corsHeaders
            );
          }
          return jsonResponse({ success: true, data: message }, 200, corsHeaders);
        }

        // DELETE single message
        if (method === "DELETE") {
          const deleted = await deleteMessage(env, inbox.id, messageId);
          if (!deleted) {
            return jsonResponse(
              { success: false, error: "Message not found or already deleted" },
              404,
              corsHeaders
            );
          }
          return jsonResponse(
            { success: true, message: "Message deleted successfully" },
            200,
            corsHeaders
          );
        }
      }
    }

    // Route not found
    return jsonResponse(
      { success: false, error: "Endpoint not found" },
      404,
      corsHeaders
    );
  } catch (err) {
    console.error("[API Error]", err);
    return jsonResponse(
      { success: false, error: "Internal server error" },
      500,
      corsHeaders
    );
  }
}
