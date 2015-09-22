<meta property="og:title" content="{{ title }}" />
<meta property="og:type" content="website" />
{% if !ogImage %}
{% set ogImage = siteInfo.ogImageDefault %}
{% endif %}
<meta property="og:url" content="{{canonicalURL}}" />
<meta property="og:image" content="{{siteInfo.protocol + siteInfo.domain + ogImage}}" />