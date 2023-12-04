// import crypto from "crypto";

// https://gist.github.com/zubiden/175bfed36ac186664de41f54c55e4327
export async function validate(params: URLSearchParams, botToken: string) {
    const expectedHash = params.get("hash");
    params.delete("hash");
    const checkString = Array
        .from(params.entries(), ([key, value]) => `${key}=${value}`)
        .sort()
        .join("\n");
    params.append("hash", expectedHash!);

    const encoder = new TextEncoder();
    const secret = await getBotSecret(encoder, botToken);
    // const secretBase64 = bytesToBase64(secret); // save existing secret as base64 string
    // const secret = base64ToBytes(secretBase64);
    const signatureKey = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, true, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", signatureKey, encoder.encode(checkString));

    const hex = Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('');
    return expectedHash === hex;
}

async function getBotSecret(encoder: TextEncoder, botToken: string) {
    const secretKey = await crypto.subtle.importKey("raw", encoder.encode('WebAppData'), { name: "HMAC", hash: "SHA-256" }, true, ["sign"]);
    return await crypto.subtle.sign("HMAC", secretKey, encoder.encode(botToken));
}

function base64ToBytes(base64: string): Uint8Array {
    const binString = atob(base64);
    return Uint8Array.from<string>(binString, m => m.codePointAt(0)!);
}

function bytesToBase64(bytes: ArrayBuffer) {
    const binString = Array.from(new Uint8Array(bytes), (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
}