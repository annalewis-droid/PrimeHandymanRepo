export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch (_e) {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const full_name = (body.full_name || "").trim();
  const phone = (body.phone || "").trim();
  const zip_code = (body.zip_code || "").trim();
  const description = (body.description || "").trim();
  const turnstile_token = body.turnstile_token || "";

  if (!full_name || !phone || !zip_code || !description) {
    return json({ ok: false, error: "Missing required fields." }, 400);
  }

  if (!turnstile_token) {
    return json({ ok: false, error: "Security check incomplete." }, 400);
  }

  const verifyResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstile_token
      })
    }
  );

  const verifyResult = await verifyResponse.json();
  if (!verifyResult.success) {
    return json({ ok: false, error: "Security check failed." }, 403);
  }

  const supabaseResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/estimates`,
    {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ full_name, phone, zip_code, description })
    }
  );

  if (!supabaseResponse.ok) {
    return json({ ok: false, error: "Could not save your request." }, 500);
  }

  return json({ ok: true });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json" }
  });
}
