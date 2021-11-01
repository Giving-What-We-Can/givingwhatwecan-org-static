<script type="application/ld+json">
{
  "@context" : "http://schema.org",
  "@type" : "WebSite",
  "name" : "{{site.title}}",
  "url" : "{{site.url}}"
}
</script>
<script type="application/ld+json">
{
	"@context" : "http://schema.org",
	"@type" : "Organization",
	"url" : "{{site.url}}",
	"logo": {
  		"@type": "ImageObject",
  		"url": "{{site.url}}/images/logos/gwwc-logo-schema-white-shadow-260x260.png",
  		"width": 260,
  		"height": 260
  	},
	"contactPoint" : [
		{ "@type" : "ContactPoint",
			"telephone" : "+44 (0) 1865 241188",
			"contactType" : "customer service"
		} 
	],
	"sameAs" : [ 
			"https://www.facebook.com/givingwhatwecan/",
			"https://twitter.com/GivingWhatWeCan",
			"https://plus.google.com/+givingwhatwecan",
			"https://www.youtube.com/givingwhatwecan"
		]
	}
}
</script>
{% if collection|contains('_reports') %}
<script type="application/ld+json">
{
  "@context" : "http://schema.org",
  "@type" : "Report",
  "headline" : "{{title}}",
  "mainEntityOfPage" : "{{site.url}}/{{path}}",
  "author": {
  	"@type": "Person",
  	"name": "{{author[0].fields.title}}"
  },
  {% if featuredImage %}
  "image": {
  	"@type": "ImageObject",
  	"url": "https:{{featuredImage.fields.file.url}}?w=800",
  	"width": 800,
  	{%set featuredImageHeight = Math.round(800*featuredImage.fields.file.details.image.height/featuredImage.fields.file.details.image.width) %}
  	"height": {{featuredImageHeight}}
  },
  {%endif%}
  "publisher": {
  	"@type" : "Organization",
  	"name": "{{site.title}}",
  	"logo": {
  		"@type": "ImageObject",
  		"url": "{{site.url}}/images/logos/gwwc-logo-schema-white-shadow-260x260.png",
  		"width": 260,
  		"height": 260
  	}
  },
  "datePublished": "{{date|moment(null)}}",
  "dateModified": "{{updated|moment(null)}}"
}
</script>
{% elif collection|contains('_posts') %}
<script type="application/ld+json">
{
  "@context" : "http://schema.org",
  "@type" : "BlogPosting",
  "headline" : "{{title}}",
  "mainEntityOfPage" : "{{site.url}}/{{path}}",
  {% if featuredImage %}
  "image": {
  	"@type": "ImageObject",
  	"url": "https:{{featuredImage.fields.file.url}}?w=800",
  	"width": 800,
  	{%set featuredImageHeight = Math.round(800*featuredImage.fields.file.details.image.height/featuredImage.fields.file.details.image.width) %}
  	"height": {{featuredImageHeight}}
  },
  {%endif%}
  "publisher": {
  	"@type" : "Organization",
  	"name": "{{site.title}}",
  	"logo": {
  		"@type": "ImageObject",
  		"url": "{{site.url}}/images/logos/gwwc-logo-schema-white-shadow-260x260.png",
  		"width": 260,
  		"height": 260
  	}
  },
  "datePublished":"{{date|moment(null)}}",
  "dateModified":"{{updated|moment(null)}}",
  "author":{
  	"@type": "Person",
  	"name": "{% if author[0].fields %}{{author[0].fields.title}}{% else %}Anonymous{% endif %}"
  },
  "description": "{{excerpt}}"
}
</script>
{% else %}
<script type="application/ld+json">
{
  "@context" : "http://schema.org",
  "@type" : "WebPage",
  "name" : "{{title}}",
  "url" : "{{site.url}}/{{path}}"
}
</script>
{% endif %}

{% set done = false %}
{% for collectionSlug in collectionSlugs %}
	{% if collection|contains('_'+collectionSlug) %}
	{% set done = true %}
	<script type="application/ld+json">
	{
	  "@context": "http://schema.org",
	  "@type": "BreadcrumbList",
	  "itemListElement": [{
	    "@type": "ListItem",
	    "position": 1,
	    "item": {
	      "@id": "{{site.url}}/{{collectionSlug}}/",
	      "name": "{{collectionInfo[collectionSlug].title}}"
	    }
	  },{
	    "@type": "ListItem",
	    "position": 2,
	    "item": {
	      "@id": "{{site.url}}/{{path}}/",
	      "name": "{{title}}"
	    }
	  }]
	}
	</script>
	{% endif %}
{% endfor %}

{% if !done %}
<script type="application/ld+json">
	{
	  "@context": "http://schema.org",
	  "@type": "BreadcrumbList",
	  "itemListElement": [{
	    "@type": "ListItem",
	    "position": 1,
	    "item": {
	      "@id": "{{site.url +'/'+ path}}/",
	      "name": "{{title}}"
	    }
	  }]
	}
</script>
{% endif %}
