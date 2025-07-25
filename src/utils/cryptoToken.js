import crypto from "crypto";

/* Generates a token using the crypto module */
export const generateCryptoToken = (
  key = "resetPassword",
  expiresInMin = 5
) => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(`${key}:${rawToken}`)
    .digest("hex");

  const expiresAt = new Date(Date.now() + expiresInMin * 60 * 1000);
  return {
    rawToken,
    hashedToken,
    expiresAt,
  };
};
