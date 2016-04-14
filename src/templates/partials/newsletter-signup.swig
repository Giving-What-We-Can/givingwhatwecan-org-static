<div class="mailchimp-signup">
	<h2>Subscribe to our newsletter</h2>
<form action="//givingwhatwecan.us10.list-manage.com/subscribe/post?u=1ab3e4a8bd58783a2adff3c2e&amp;id=3ee570d9ad" method="post" id="mailchimp-signup-form" name="mc-embedded-subscribe-form" class="form form-inline" target="_blank" novalidate>
	<p>Opportunities to give more effectively, our latest charity evaluations, and updates from the Giving What We Can community, direct to your inbox. We send approximately one email per month, and we'll never share your email address.</p>
	<div class="controls">
		<div class="row">
			<div class="form-group col-sm-4">
				<label for="mailchimp-signup-EMAIL" class="control-label sr-only" aria-hidden="true">Email Address  <span class="asterisk">*</span></label>
				<input placeholder="Email Address" type="email" name="EMAIL" class="form-control" id="mailchimp-signup-EMAIL">
			</div>
			<div class="form-group col-sm-3">
				<label for="mailchimp-signup-FNAME" class="control-label sr-only" aria-hidden="true">First Name  <span class="asterisk">*</span></label>
				<input placeholder="First Name" type="email" name="FNAME" class="form-control" id="mailchimp-signup-FNAME">
			</div>
			<div class="form-group col-sm-3">
				<label for="mailchimp-signup-LNAME" class="control-label sr-only" aria-hidden="true">Last Name  <span class="asterisk">*</span></label>
				<input placeholder="Last Name" type="email" name="LNAME" class="form-control" id="mailchimp-signup-LNAME">
			</div>
			<!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
			<div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_1ab3e4a8bd58783a2adff3c2e_3ee570d9ad" tabindex="-1" value=""></div>
			

			<!-- add as a 'non-member' -->
			<input type="hidden" name="group[7037][4]" value="1" />
			<!-- opts people into all sub-lists -->
			<input type="hidden" name="group[7037][8]" value="1" />
			<input type="hidden" name="group[7037][128]" value="1" />
			<input type="hidden" name="group[7037][256]" value="1" />

			<!-- track signup location on site -->
			<input type="hidden" name="SIGNUPTYPE" value="{{collections[collection].metadata.singular}}" />
			<input type="hidden" name="SIGNUPLOC" value="Postscript" />

			<div class="form-group col-sm-2">
				<button type="submit" name="subscribe" id="mailchimp-signup-subscribe" class="btn btn-success">Subscribe</button>
			</div>
		</div>
	</div>
	<div id="mailchimp-signup-result" class="hidden alert"></div>
</form>
</div>

<div class="modal fade mailchimp-signup-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Subscribe to our Newsletter</h4>
      </div>
      <div class="modal-body">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">No thanks</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->


<script>
(function(){
	var d = document.getElementById("mailchimp-signup-subscribe");
	d.className += " disabled";
});
loadScript(function(){
	// trigger modal on scroll
	var showModal = cookies.get('newsletter_cta_shown') ? false : true;
	$(window).scroll(function() {
		var progress = 0.6;
	    if($(window).scrollTop() > $(document).height()*progress && showModal){
			newsletterModal();
	    }
	});

	// function to display the modal
	var newsletterModal = $.debounce(5000, true, function(){
		console.log('called');
		// should we actually show the modal?
		if(typeof cookies === 'undefined'){
			throw new Error ('Error: `browser-cookies` library is not installed.');
		}

		var form = $('.mailchimp-signup');
		var modal = $('.mailchimp-signup-modal');
		var parent = modal.parent();
		console.log(modal)
		modal.modal('show')
		.on('shown.bs.modal', function () {
		  form.appendTo(modal.find('.modal-body'))
		})
		.on('hide.bs.modal',function(){
        	form.appendTo(parent)
        })
        // hide the modal if the signup is successful
        form.on('newsletter_signup',function(event,data){
        	if(data.status==='success'){
        		modal.modal('hide');
        	}
        })

		// remember that we've seen the modal
		cookies.set('newsletter_cta_shown', "1",{expires: 14});
		showModal = false;

	});
});
</script>