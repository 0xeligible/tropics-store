// TROPICS admin login — server-side check (Vercel Serverless Function).
// Password is NEVER in frontend code. Set one of these env vars in Vercel
// (Project Settings -> Environment Variables, then Redeploy):
//   ADMIN_PASSWORD_SHA256 = sha256 hex of the admin password (recommended)
//   ADMIN_PASSWORD        = the password itself (hashed server-side; use only if needed)
// If neither is set, login always fails closed with ADMIN_NOT_CONFIGURED.
const crypto = require('crypto');

function sha256Hex(s) {
  return crypto.createHash('sha256').update(String(s), 'utf8').digest('hex');
}
function getSecret() {
  if (process.env.ADMIN_PASSWORD_SHA256) return process.env.ADMIN_PASSWORD_SHA256.trim().toLowerCase();
  if (process.env.ADMIN_PASSWORD) return sha256Hex(process.env.ADMIN_PASSWORD);
  return null;
}
function timingEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
function makeToken(secret) {
  const exp = Date.now() + 8 * 60 * 60 * 1000; // 8 jam
  const sig = crypto.createHmac('sha256', secret).update('tropics-admin:' + exp).digest('hex');
  return Buffer.from(exp + ':' + sig).toString('base64url');
}
function verifyToken(secret, token) {
  try {
    const dec = Buffer.from(String(token), 'base64url').toString('utf8');
    const parts = dec.split(':');
    if (parts.length !== 2) return false;
    const exp = parts[0];
    const sig = parts[1];
    if (!exp || !sig || Date.now() > Number(exp)) return false;
    const expect = crypto.createHmac('sha256', secret).update('tropics-admin:' + exp).digest('hex');
    return timingEqual(expect, sig);
  } catch (e) {
    return false;
  }
}

module.exports = async (req, res) => {
  const secret = getSecret();
  if (!secret) {
    res.status(503).json({ ok: false, error: 'ADMIN_NOT_CONFIGURED' });
    return;
  }
  if (req.method === 'GET') {
    const auth = req.headers.authorization || '';
    const token = auth.indexOf('Bearer ') === 0 ? auth.slice(7) : '';
    if (token && verifyToken(secret, token)) {
      res.status(200).json({ ok: true });
    } else {
      res.status(401).json({ ok: false, error: 'INVALID_TOKEN' });
    }
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const pass = (body && body.password) || '';
  if (!pass || !timingEqual(sha256Hex(pass), secret)) {
    res.status(401).json({ ok: false, error: 'WRONG_PASSWORD' });
    return;
  }
  res.status(200).json({ ok: true, token: makeToken(secret) });
};
