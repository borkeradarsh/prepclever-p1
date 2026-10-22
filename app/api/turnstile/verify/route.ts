import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  const { token } = (await request.json()) as { token?: string };

  if (!secret && process.env.NODE_ENV !== "production") {
    return NextResponse.json({ success: true, skipped: true });
  }

  if (!secret || !token) {
    return NextResponse.json({ success: false, error: "Turnstile verification is not configured." }, { status: 400 });
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as { success?: boolean };

  return NextResponse.json({ success: result.success === true }, { status: result.success ? 200 : 403 });
}
