import type { Metadata } from "next";
import "@/core/dist/index.css";
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
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN}
            src="https://plausible.io/js/plausible.js"
          ></script>
        )}
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
