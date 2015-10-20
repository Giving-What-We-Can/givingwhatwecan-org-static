{% set contentBlockSet = contentBlockSet|default(null) %}
{% for contentBlock in contentBlocks %}
    {% if contentBlockSet && contentBlock.set|contains(contentBlockSet) %}
        {% if contentBlock.scriptFiles %}
			{% for script in contentBlockcontentBlock.scriptFiles %}
				{% set j = JSON.stringify(script) %}
				{{j}}
			{% endfor %}
	    {% endif %}
	    {% if contentBlock.script %}
	    <script>
	    	// Scripts for {{ contentBlock.title }}
	    	{{ contentBlock.script }}
	    </script>
	    {% endif %}
    {% endif %}
{% endfor %}