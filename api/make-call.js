/**
 * Vercel Serverless Function: Exotel Call Proxy
 * POST /api/make-call
 * Body (JSON): { to, from, script }
 */

const SCRIPT_ENDPOINT = "https://exotel-docs.vercel.app/api/call-script";

module.exports = async function makeCall(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, from, script } = req.body;

  if (!to || !from || !script) {
    return res.status(400).json({ error: "Missing required fields: to, from, script" });
  }

  const { EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_SID, EXOTEL_APP_ID } = process.env;

  if (!EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_SID || !EXOTEL_APP_ID) {
    return res.status(500).json({ error: "Missing Exotel credentials — check Vercel env vars (EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_SID, EXOTEL_APP_ID)" });
  }

  const appUrl = `http://my.exotel.com/${EXOTEL_SID}/exoml/start_voice/${EXOTEL_APP_ID}`;
  const apiUrl = `https://api.exotel.com/v1/Accounts/${EXOTEL_SID}/Calls/connect.json`;

  // Store script for this call so Passthru webhook can retrieve it
  const scriptUrl = `${SCRIPT_ENDPOINT}?text=${encodeURIComponent(script)}`;

  const params = new URLSearchParams();
  params.append("From", to);          // "From" = the number to CALL (restaurant/user)
  params.append("CallerId", from);    // ExoPhone as CallerID
  params.append("Url", appUrl);       // Exotel-hosted app (runs when called party answers)
  params.append("StatusCallback", scriptUrl); // Pass script URL for Passthru to pick up
  params.append("TimeLimit", "120");
  params.append("Record", "true");

  let rawText = "";
  let exoStatus = 0;

  try {
    const credentials = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString("base64");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: params.toString(),
    });

    exoStatus = response.status;
    rawText = await response.text();

    if (!response.ok) {
      return res.status(502).json({
        error: `Exotel returned ${exoStatus}`,
        detail: rawText,
      });
    }

    const data = JSON.parse(rawText);
    const call = data?.Call;

    return res.status(200).json({
      call_id: call?.Sid,
      status: call?.Status,
      to: call?.To,
      from: call?.From,
      script_url: scriptUrl,
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      exotel_status: exoStatus,
      raw: rawText,
    });
  }
}
// Tue Mar 31 16:19:50 IST 2026
