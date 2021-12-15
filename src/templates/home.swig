{% extends './layout.swig' %}
{% set contentBlockSet = 'newhome' %}

{% block banner %}

{% endblock %}

{% block content %}
	{% include './partials/custom-alert.swig' %}
	{% include './partials/content-block-set.swig' %}

<script>
loadScript(function(){
	$(document).ready(function() {
		$('.scroll-to').click(function(e){
			e.preventDefault();
			var element = $($(this).attr('href'));
			console.log ($(this).attr('href'), $(this), element)
			if(element.length)
			  element[0].scrollIntoView({behavior: "smooth"});
		})

		$('.video-modal-link').on('click', function () {
			$('#videoModal').modal('show')
			$('#video').attr('src', $(this).data( 'src' ) + '?autoplay=1&modestbranding=1&showinfo=0' ); 
		})
		$('#videoModal').on('hide.bs.modal', function () {
			$('#video').attr('src',''); 
		})
	})
})
</script>

{% endblock %}

{% block scripts %}
	{% parent %}
{% endblock %}
