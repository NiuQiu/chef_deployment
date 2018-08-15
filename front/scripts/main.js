$(function(){
	// unsured url, replce later
	var url = 'http://192.168.33.101:8080/order/rest/restaurant/';
	var restName = "Uli's Restaurant";
	var getUrl = "info/"+ restName;
	var postUrl = 'reserve';

	var $hours = $('#hours');
	var $addr = $('#addr');
	var $phone = $("#tel");

	var isClicked = false;

	$('.info').on('click', function(){
		if($('#currentRes').hasClass('visible')){
			$('#currentRes').removeClass('visible');
		}else{
			$('#currentRes').addClass('visible');
			$('#helper').addClass('visible');
		}
	});

	$('.close').on('click', function(){
		$('#currentRes').removeClass('visible');
		$('#helper').removeClass('visible');
	});

	$('#overlay').click(function(){
		$('#booking').removeClass('visible');
		$('#overlay').removeClass('visible');
		$('#returnMsg').empty().removeClass('visible');
		// remove picture
		$('.showPic').remove();
		$('#postForReserve').removeClass('visible');
	});

	$.ajax({
		type: 'get',
		url: url + getUrl,
		success: function(response){
			var business = response.hours;
			var contact = response.contact;

			$.each(business, function(i, info){
				$row = $('<tr>' +
				'<td>' + info.Day + ':</td>' +
				'<td>' + info.OpenHr +' - ' + info.CloseHr +'</td>' +
				'<tr/>');
				$hours.append($row);
			});

			$addr.append('<p>' + contact.Address + '</p');
			$phone.append('<p>' + contact.Phone + '</p')
		},
		error: function(xhr, res, text){
				console.log(res);
				msg = res;
		}

	});

	/*------------------
	 reservation button
	------------------*/
	$('.res').click(function(){
		if($('#booking').hasClass('visible')){
			$('#booking').removeClass('visible');

		}else{
			$('#postForReserve #time').val($('#postForReserve #time option[disabled]').val());
			$('#postForReserve #seats').empty();
			$('#booking').addClass('visible');
			$('#postForReserve').addClass('visible');
			$('#overlay').addClass('visible');
		}
	});

	/*------------------
	get available seats
	------------------*/
	$('#time').change(function(){
		var time = this.value;
		$('#seats').empty();
		$.ajax({
			type: 'get',
			url: url + time,
			success: function(seats){
				$('#seats').append('<option disabled selected value> -- select an option -- </option>');
				console.log(seats);
				var arr = seats.seatList;
				for(i=0; i< arr.length; i++){
					$('#seats').append('<option>' + arr[i] + '</option>');
					console.log(arr[i]);
				}
			},
			error: function(xhr, res, text){
				console.log(res);
				msg = res;
			}
		})
	});

	$('#helper').click(function(){
		$('#currentRes').removeClass('visible');
		$('#helper').removeClass('visible');
		$('#booking').removeClass('visible');
		$('#overlay').removeClass('visible');
	});


	$('#booking span').on('click', function(){
		$('#booking').removeClass('visible');
		$('#overlay').removeClass('visible');
		$('#returnMsg').empty().removeClass('visible');
		// remove picture
		$('.showPic').remove();
		$('#postForReserve').removeClass('visible');
	});

	$('#sub input[type=button]').click(function(){
		$('#booking').removeClass('visible');
		$('#overlay').removeClass('visible');
		$('#postForReserve').removeClass('visible');
	});

	/*------------------
	   book for seats
	------------------*/
	$('#sub input[type=submit]').click(function(){
		var msg = null;

		if($('#fname').val() === null || $('#fname').val().length === 0){
			$('#fname-err').html("Please fill out first name");
			document.getElementById("fname").focus();
			return;
		}else{
			$('#fname-err').html("");
		}

		if($('#lname').val() === null || $('#lname').val().length === 0){
			$('#lname-err').html("Please fill out last name");
			document.getElementById("lname").focus();
			return;
		}else{
			$('#lname-err').html("");
		}

		if($('#pnumber').val() === null || $('#pnumber').val().length === 0){
			$('#pnumber-err').html("Please fill out phone number");
			document.getElementById("tel").focus();
			return;
		}else{
			$('#pnumber-err').html("");
		}

		var reservation = {
			customer:{
				fname: $('#fname').val(),
				lname: $('#lname').val(),
				phone: $('#pnumber').val(),
			},
			table:{
				time: $('#time').val(),
				seats: $('#seats').val()
			}
		}
		$.ajax({
			type: 'post',
			url: url + postUrl,
			data: JSON.stringify(
				reservation
			),
			contentType: 'application/json',
			dataType: 'text',
			success: function(data){
				msg = data;
			},
			error: function(xhr, res, text){
				console.log(res);
				msg = res;
			}
		})
		.done(function(){
			$('#postForReserve.visible').removeClass('visible');
			$('#returnMsg').append('<img class="showPic" src="./resource/check.png">');
			$('#returnMsg').append('<p>' + msg + '</p>');
			$('#returnMsg').addClass('visible');
			// setTimeout(function(){
			// 	if(!$('#returnMsg').has('p')){
			// 		$('#returnMsg').empty().removeClass('visible');
			// 		return;
			// 	}
			// 	$('#postForReserve.visible').removeClass('visible');
			// 	$('#booking').removeClass('visible');
			// 	$('#overlay').removeClass('visible');
			// 	$('#returnMsg').empty().removeClass('visible');
			// }, 2000);


		})
		.fail(function(){
			$('#postForReserve.visible').removeClass('visible');
			$('#returnMsg').append('<img class="showPic" src="./resource/error.png">');
			$('#returnMsg').append('<p>' + msg + ': reservation is failed.</p>');
			$('#returnMsg').addClass('visible');
		});
	})


});
