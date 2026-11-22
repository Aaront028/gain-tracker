import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { headers } from "next/headers";
import TopNav from "../components/TopNav";
import { ClerkProvider } from '@clerk/nextjs'
import Footer from "../components/Footer";
import { Toaster } from "~/components/ui/sonner";
import { CSPostHogProvider } from "./_analytics/provider";

export const metadata: Metadata = {
  title: "Gain Tracker App",
  description: "A place to log your workouts and track your gains.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function clerkProxyUrl() {
  const headerStore = headers();
  const host =
    headerStore.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    headerStore.get("host");
  if (!host) return undefined;

  const forwardedProto = headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto =
    forwardedProto ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${proto}://${host}/__clerk`;
}

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ClerkProvider proxyUrl={clerkProxyUrl()}>
      <CSPostHogProvider>
        <html lang="en" className={`${GeistSans.variable} dark`}>
          <body className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <TopNav />
            <main className="flex-grow container mx-auto px-4">
              {children}
              {modal}
              <div id="modal-root" />
            </main>
            <Toaster />
            <Footer />
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
