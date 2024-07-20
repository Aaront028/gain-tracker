import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import TopNav from "../components/TopNav";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Footer from "../components/Footer";
import { Toaster } from "~/components/ui/sonner";



export const metadata: Metadata = {
  title: "Gain Tracker App",
  description: "A place to log your workouts and track your gains.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} flex flex-col gap-4 dark`}>
        <body className="flex flex-col min-h-screen">

          <TopNav />
          <main className="flex-grow">
            {children}
            {modal}
            <div id="modal-root" />

          </main>
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
