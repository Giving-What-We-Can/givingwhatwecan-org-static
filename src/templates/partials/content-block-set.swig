{% set contentBlockSet = contentBlockSet|default(null) %}
{% for contentBlock in _contentBlocks %}
    {% if contentBlockSet && contentBlock.set|contains(contentBlockSet) %}
        {% include './content-block.swig' %}
    {% endif %}
{% endfor %}
<script>
	loadScript('content-blocks')
</script>