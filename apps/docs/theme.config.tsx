/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";

import { ReleaseSwitcher } from "./components/ReleaseSwitcher";
import { FooterActions } from "./components/FooterActions";
import { Viewport } from "./components/Viewport";

const Head = () => {
  const { asPath, defaultLocale, locale } = useRouter();
  const { frontMatter, title } = useConfig();

  const siteUrl = "https://frontend.co";
  const url =
    siteUrl + (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

  const defaultTitle = `Editor - The open-source visual editor for React`;
  const description =
    frontMatter.description ||
    `Editor empowers developers to build amazing visual editing experiences into their own React applications, powering the next generation of content tools.`;

  return (
    <>
      <link rel="canonical" href={`${siteUrl}${asPath}`} />
      <meta property="og:url" content={url} />
      <meta property="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteUrl}/social.png`} />
      <meta property="og:image:height" content="675" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:alt" content="Editor" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:locale" content="en" />
      <meta property="og:site_name" content={defaultTitle} />
      <meta name="image" content={`${siteUrl}/social.png`} />
      <meta itemProp="image" content={`${siteUrl}/social.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/social.png`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:alt" content="Editor" />
      <meta name="twitter:image:height" content="675" />
      <meta name="twitter:image:type" content="image/png" />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:site" content="@frontendinc" />
      <meta
        name="twitter:title"
        content={title !== defaultTitle ? `${title} - Editor` : defaultTitle}
      />
      <title>{title !== defaultTitle ? `${title} - Editor` : defaultTitle}</title>

      <link rel="icon" href="/favicon.ico" sizes="48x48" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
      "@context" : "https://schema.org",
      "@type" : "WebSite",
      "name" : "Editor",
      "url" : "https://frontend.co/"
    }`,
        }}
      />
      {asPath == "/" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `${JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Editor",
              url: siteUrl,
            })}`,
          }}
        />
      )}
    </>
  );
};

const theme: DocsThemeConfig = {
  head: Head,
  logo: <span style={{ fontWeight: 600 }}>React Editor</span>,
  project: {
    link: "https://github.com/reacteditor/editor",
  },
  footer: {
    content: (
      <div className="flex w-full flex-col items-center sm:items-start">
        <p className="mt-6 text-xs">
          MIT © {new Date().getFullYear()}{" "}
          <a
            style={{ textDecoration: "underline" }}
            href="https://github.com/reacteditor/editor/graphs/contributors"
          >
            The Editor Contributors
          </a>
        </p>
      </div>
    ),
  },
  toc: {
    backToTop: true,
  },
  banner:
    process.env.NEXT_PUBLIC_IS_LATEST === "true"
      ? {
          dismissible: true,
          key: "v0.18.0",
          content: (
            <a
              href="https://github.com/reacteditor/editor/releases"
              target="_blank"
            >
              <b>🎈 Editor 0.18</b>: The new drag-and-drop engine is here, with
              CSS grid & flexbox support →
            </a>
          ),
        }
      : {},
  docsRepositoryBase: "https://github.com/reacteditor/editor/tree/main/apps/docs",
  navbar: {
    extraContent: () => (
      <Viewport desktop>
        <ReleaseSwitcher />
      </Viewport>
    ),
  },
  themeSwitch: {
    component: FooterActions,
  },
};

export default theme;
