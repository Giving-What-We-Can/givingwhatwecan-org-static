<meta property="og:title" content="{{ title }}" />
<meta property="og:type" content="website" />

{% set ogImage = ogImage|default(siteInfo.ogImageDefault) %}
<meta property="og:url" content="{{canonicalURL}}" />
<meta property="og:image" content="{{siteInfo.protocol + siteInfo.domain + ogImage}}" />