import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const PROXY_PATH = "/__clerk";
const FAPI_URL = "https://frontend-api.clerk.dev";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function isClerkProxyPath(pathname) {
  return pathname === PROXY_PATH || pathname.startsWith(`${PROXY_PATH}/`);
}

function publicOrigin(request) {
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function clientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    ""
  );
}

function proxyError(message, status) {
  return NextResponse.json(
    { errors: [{ code: "proxy_configuration_error", message }] },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function proxyClerkFrontendApi(request) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!publishableKey) {
    return proxyError("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.", 500);
  }
  if (!secretKey) {
    return proxyError("Missing CLERK_SECRET_KEY.", 500);
  }

  const requestUrl = new URL(request.url);
  const targetPath = requestUrl.pathname.slice(PROXY_PATH.length) || "/";
  const targetUrl = new URL(`${FAPI_URL}${targetPath}`);
  targetUrl.search = requestUrl.search;

  if (targetUrl.host !== new URL(FAPI_URL).host) {
    return proxyError("Resolved target does not match the Clerk Frontend API.", 400);
  }

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const proxyUrl = `${publicOrigin(request)}${PROXY_PATH}`;
  headers.set("Clerk-Proxy-Url", proxyUrl);
  headers.set("Clerk-Secret-Key", secretKey);
  headers.set("Host", targetUrl.host);
  headers.set("Accept-Encoding", "identity");

  if (!headers.has("X-Forwarded-Host")) {
    headers.set("X-Forwarded-Host", requestUrl.host);
  }
  if (!headers.has("X-Forwarded-Proto")) {
    headers.set("X-Forwarded-Proto", requestUrl.protocol.replace(":", ""));
  }

  const ip = clientIp(request);
  if (ip) {
    headers.set("X-Forwarded-For", ip);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let upstream;
  try {
    upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      redirect: "manual",
      ...(hasBody ? { duplex: "half" } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return proxyError(`Failed to proxy request to Clerk: ${message}`, 502);
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      HOP_BY_HOP_HEADERS.has(lower) ||
      lower === "content-encoding" ||
      lower === "content-length" ||
      lower === "set-cookie"
    ) {
      return;
    }
    responseHeaders.set(key, value);
  });

  if (typeof upstream.headers.getSetCookie === "function") {
    for (const cookie of upstream.headers.getSetCookie()) {
      responseHeaders.append("set-cookie", cookie);
    }
  }

  const location = upstream.headers.get("location");
  if (location) {
    try {
      const locationUrl = new URL(location, FAPI_URL);
      if (locationUrl.host === targetUrl.host) {
        responseHeaders.set(
          "location",
          `${proxyUrl}${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`,
        );
      }
    } catch {
      // Keep non-URL Location values unchanged.
    }
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export default function middleware(request, event) {
  if (isClerkProxyPath(request.nextUrl.pathname)) {
    return proxyClerkFrontendApi(request);
  }

  return clerkMiddleware({
    proxyUrl: `${publicOrigin(request)}${PROXY_PATH}`,
  })(request, event);
}

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    // Clerk's production proxy for vercel.app. Must stay ahead of the
    // static-file exclusion above, which would drop clerk.browser.js.
    "/__clerk/:path*",
    "/__clerk/(.*)",
  ],
};
