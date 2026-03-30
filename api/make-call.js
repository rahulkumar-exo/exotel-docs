/**
 * Vercel Serverless Function: Exotel Call Proxy
 *
 * Accepts booking details, calls Exotel API from Vercel's servers
 * (bypassing any corporate SSL proxy on the client machine).
 *
 * POST /api/make-call
 * Body (JSON): { to, from, script }
 */

const SCRIPT_ENDPOINT = "https://exotel-docs.vercel.app/api/call-script";

export default async function makeCall(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, from, script } = req.body;

  if (!to || !from || !script) {
    return res.status(400).json({ error: "Missing required fields: to, from, script" });
  }

  const { EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_SID } = process.env;

  if (!EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_SID) {
    return res.status(500).json({ error: "Exotel credentials not configured on Vercel" });
  }

  const scriptUrl = `${SCRIPT_ENDPOINT}?text=${encodeURIComponent(script)}`;
  const apiUrl = `https://api.exotel.com/v1/Accounts/${EXOTEL_SID}/Calls/connect.json`;

  const params = new URLSearchParams();
  params.append("From", from);
  params.append("To", to);
  params.append("CallerId", from);
  params.append("Url", scriptUrl);
  params.append("TimeLimit", "120");
  params.append("Record", "true");

  const credentials = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString("base64");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    return res.status(502).json({ error: `Exotel error: ${response.status}`, detail: text });
  }

  const data = await response.json();
  const call = data?.Call;

  return res.status(200).json({
    call_id: call?.Sid,
    status: call?.Status,
    to: call?.To,
    from: call?.From,
  });
}
