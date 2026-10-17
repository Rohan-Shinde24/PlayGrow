import type { Metadata } from "next";
import { PlayGrowProvider } from "@/context/playgrow-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayGrow — Grow games, reward players",
  description:
    "Launch game campaigns, reward players, and manage every budget in one simple workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PlayGrowProvider>{children}</PlayGrowProvider>
      </body>
    </html>
  );
}
