import type { Metadata } from "next";
import Script from "next/script";
import "@/core/styles.css";
import "./styles.css";

export const metadata: Metadata = {
  title: "React Editor - Next.js Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN && (
          <Script
            src="https://plausible.io/js/plausible.js"
            strategy="afterInteractive"
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN}
          />
        )}
        <div>{children}</div>
      </body>
    </html>
  );
}
