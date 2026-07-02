import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export function SEO({
  title = 'TrusonHub Job Searcher — Find Your Next Opportunity',
  description = 'TrusonHub Job Searcher is an enterprise job board platform connecting top talent with global employers.',
  keywords = 'jobs, careers, employment, hiring, tech jobs, remote work, enterprise job board',
  ogImage = '/favicon.svg',
  ogType = 'website',
  canonicalUrl,
}: SEOProps) {
  const fullTitle = title.includes('TrusonHub') ? title : `${title} | TrusonHub Job Searcher`;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
