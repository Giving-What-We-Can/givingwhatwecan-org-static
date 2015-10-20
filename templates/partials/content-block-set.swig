{% set contentBlockSet = contentBlockSet|default(null) %}
{% for contentBlock in contentBlocks %}
    {% if contentBlockSet && contentBlock.set|contains(contentBlockSet) %}
        {% include './content-block.swig' %}
    {% endif %}
{% endfor %}