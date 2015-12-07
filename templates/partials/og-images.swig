<meta property="og:title" content="{{ title|escape }}" />
<meta property="og:type" content="website" />
{% if ogImage &&  ogImage.fields.file.url %}
	{% set ogImage = ogImage.fields.file.url %}
{% elif !ogImage && featuredImage && featuredImage.fields.file.url %}
	{% set ogImage = featuredImage.fields.file.url %}
{% elif !ogImage && collection|contains('posts') %}
	{% set ogImage = siteInfo.protocol + siteInfo.domain + '/images/layout/og-image-blog-default.jpg' %}
{% else %}
	{% set ogImage = ogImage|default(siteInfo.protocol + siteInfo.domain + siteInfo.ogImageDefault) %}
{% endif %}
{% if ogImage && ogImage.substr(0,2) === '//' %}
	{% set ogImage = 'https:' + ogImage + '?w=1200' %}
{% endif %}
<meta property="og:url" content="{{canonicalURL|escape}}" />
<meta property="og:image" content="{{ogImage|escape}}" />
<meta property="og:description" content="{{excerpt|default(siteInfo.description)|escape}}" />