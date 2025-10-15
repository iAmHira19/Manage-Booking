// A resilient helper that attempts to create a payment session by trying
// several likely backend endpoints. It returns a normalized object:
// { success: true, sessionId, raw }
// or { success: false, error, attempted }

export async function createPaymentSession(payload, baseUri) {
  const BASE_URI = baseUri || process.env.NEXT_PUBLIC_BASE_URI || "";
  // Try common alternate base (Web.config shows tpflight on 8086)
  const ALT_BASE = "http://localhost:8086";
  const candidateBases = Array.from(new Set([BASE_URI, ALT_BASE].filter(Boolean)));

  // Allow explicit override via env (comma-separated list of paths)
  const envPaths = (process.env.NEXT_PUBLIC_CREATE_PAYMENT_SESSION_PATHS || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `${BASE_URI}${p.startsWith("/") ? "" : "/"}${p}`);

  const defaultPaths = [
    "/api/tpflight/createPaymentSession", // common in this project family
    "/api/tp/createPaymentSession",
    "/api/payment/createPaymentSession",
    "/api/payment/createSession",
    "/api/tp/payment/session",
    "/api/payment/session",
  ];
  const defaultEndpoints = candidateBases.flatMap((b) =>
    defaultPaths.map((p) => `${b}${p.startsWith("/") ? "" : "/"}${p}`)
  );

  const endpoints = (envPaths.length ? envPaths : defaultEndpoints).filter(Boolean);

  const attempted = [];
  let lastError = null;

  for (const url of endpoints) {
    attempted.push(url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
      if (!res.ok) {
        lastError = data?.message || text || `HTTP ${res.status}`;
        continue;
      }

      // Normalize possible shapes
      const sessionId =
        data?.sessionId || data?.SessionId || data?.session?.id || data?.id || null;
      if (sessionId) {
        return { success: true, sessionId, raw: data };
      }
      // If response is ok but contains embed configuration
      const embeddedId = data?.result?.session?.id;
      if (embeddedId) {
        return { success: true, sessionId: embeddedId, raw: data };
      }
      lastError = "No session id returned by backend";
    } catch (e) {
      lastError = e?.message || String(e);
    }
  }

  // Provide a more actionable suggestion if the server complains about missing controller
  let suggestion = undefined;
  if (
    typeof lastError === "string" &&
    lastError.includes("No type was found that matches the controller named")
  ) {
    suggestion =
      "Your backend route name likely differs (no 'tp' controller). Set NEXT_PUBLIC_CREATE_PAYMENT_SESSION_PATHS to the correct path, e.g. '/api/payment/createPaymentSession'";
  }

  return { success: false, error: lastError || "Unknown error", attempted, suggestion };
}


