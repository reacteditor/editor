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
    link: "https://github.com/frontend-inc/react-editor",
  },
  footer: {
    content: (
      <div className="flex w-full flex-col items-center sm:items-start">
        <p className="mt-6 text-xs">
          MIT © {new Date().getFullYear()}{" "}
          <a
            style={{ textDecoration: "underline" }}
            href="https://github.com/frontend-inc/react-editor/graphs/contributors"
          >
            The Editor Contributors
          </a>
        </p>
      </div>
    ),
  },
  chat: {
    link: "https://discord.gg/D9e4E3MQVZ",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        preserveAspectRatio="xMidYMid"
        viewBox="0 -28.5 256 256"
        fill="currentColor"
      >
        <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" />
      </svg>
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
              href="https://github.com/frontend-inc/react-editor/releases"
              target="_blank"
            >
              <b>🎈 Editor 0.18</b>: The new drag-and-drop engine is here, with
              CSS grid & flexbox support →
            </a>
          ),
        }
      : {},
  docsRepositoryBase: "https://github.com/frontend-inc/react-editor/tree/main/apps/docs",
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
