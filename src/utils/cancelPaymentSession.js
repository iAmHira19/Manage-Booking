// Attempts to cancel/void an existing payment session by trying several likely backend endpoints.
// Returns { success: true, raw } or { success: false, error, attempted }

export async function cancelPaymentSession(sessionId, baseUri) {
  if (!sessionId) {
    return { success: true, raw: null }; // nothing to cancel
  }
  const BASE_URI = baseUri || process.env.NEXT_PUBLIC_BASE_URI || "";
  const ALT_BASE = "http://localhost:8086";
  const candidateBases = Array.from(new Set([BASE_URI, ALT_BASE].filter(Boolean)));

  // Allow override of cancel paths via env
  const envPaths = (process.env.NEXT_PUBLIC_CANCEL_PAYMENT_SESSION_PATHS || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `${BASE_URI}${p.startsWith("/") ? "" : "/"}${p}`);

  const defaultPaths = [
    "/api/tpflight/cancelPaymentSession",
    "/api/tp/cancelPaymentSession",
    "/api/payment/cancelPaymentSession",
    "/api/payment/cancelSession",
    "/api/payment/cancel",
    "/api/payment/session/cancel",
    "/api/tp/payment/session/cancel",
  ];

  const defaultEndpoints = candidateBases.flatMap((b) =>
    defaultPaths.map((p) => `${b}${p.startsWith("/") ? "" : "/"}${p}`)
  );

  const endpoints = (envPaths.length ? envPaths : defaultEndpoints).filter(Boolean);

  const attempted = [];
  let lastError = null;

  // Payloads to try in case backend expects different keys
  const payloadVariants = [
    { sessionId },
    { SessionId: sessionId },
    { id: sessionId },
  ];

  for (const url of endpoints) {
    attempted.push(url);
    try {
      for (const body of payloadVariants) {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }
        if (res.ok) {
          return { success: true, raw: data };
        }
        lastError = data?.message || text || `HTTP ${res.status}`;
      }
    } catch (e) {
      lastError = e?.message || String(e);
    }
  }

  return { success: false, error: lastError || "Unknown error", attempted };
}
