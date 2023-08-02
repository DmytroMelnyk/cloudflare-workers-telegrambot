// https://gist.github.com/zubiden/175bfed36ac186664de41f54c55e4327
export async function validate(params: URLSearchParams, botToken: string) {
    const data = Object.fromEntries(params);
    const checkString = Object.keys(data)
        .filter((key) => key !== "hash")
        .map((key) => `${key}=${data[key]}`)
        .sort()
        .join("\n");

    console.log('computed string:', checkString);

    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey("raw", encoder.encode('WebAppData'), { name: "HMAC", hash: "SHA-256" }, true, ["sign"]);
    const secret = await crypto.subtle.sign("HMAC", secretKey, encoder.encode(botToken));
    const signatureKey = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, true, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", signatureKey, encoder.encode(checkString));

    const hex = [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('original hash:', data.hash);
    console.log('computed hash:', hex);

    return data.hash === hex;
}
