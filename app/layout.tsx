import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unfold — One link. You're connected.",
  description: "Create your personal networking profile in a minute. No password required.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
