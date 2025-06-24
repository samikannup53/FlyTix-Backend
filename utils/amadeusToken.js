let tokenCache = {
  token: null,
  expiry: null,
};

async function getAmadeusToken() {
  const now = Date.now();

  if (tokenCache.token && tokenCache.expiry > now) {
    return tokenCache.token;
  }

  const res = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
    }
  );

  const data = await res.json();

  tokenCache.token = data.access_token;
  tokenCache.expiry = now + data.expires_in * 1000;

  return data.access_token;
}

module.exports = getAmadeusToken;
