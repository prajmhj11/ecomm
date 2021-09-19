$(document).ready(function() {
    "use strict";

    var $form = $(".require-validation");
    console.log($form);
    $('form.require-validation').bind('submit', function(e) {
        var $form         = $(".require-validation"),
        inputSelector = ['input[type=email]', 'input[type=password]',
                         'input[type=text]', 'input[type=file]',
                         'textarea'].join(', '),
        $inputs       = $form.find('.required').find(inputSelector),
        $errorMessage = $form.find('div.error'),
        valid         = true;
        $errorMessage.addClass('d-none');

        $('.has-error').removeClass('has-error');
        $inputs.each(function(i, el) {
            var $input = $(el);
            if ($input.val() === '') {
                $input.parent().addClass('has-error');
                $errorMessage.removeClass('d-none');
                e.preventDefault();
            }
        });

        if (!$form.data('cc-on-file')) {
			e.preventDefault();
            console.log($form.data('stripe-publishable-key'));
			Stripe.setPublishableKey($form.data('stripe-publishable-key'));
			Stripe.createToken({
				number: $('.card-number').val(),
				cvc: $('.card-cvc').val(),
				exp_month: $('.card-expiry-month').val(),
				exp_year: $('.card-expiry-year').val()
			}, stripeResponseHandler);
        }

    });

    function stripeResponseHandler(status, response) {
      if (response.error) {
        $('.error').removeClass('hide').find('.alert').text(response.error.message);
        $('.stripe-submit').attr('disabled',false);
      }
      else {
        // token contains id, last4, and card type
        var token = response['id'];
        // insert the token into the form so it gets submitted to the server
        $form.find('input[type=text]').empty();
        $form.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
        $('.stripe-submit').attr('disabled',true);
        $form.get(0).submit();
      }
    }
});