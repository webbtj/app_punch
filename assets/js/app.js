// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).ready(function() {
	var people = [];
	getPeople();
	function getPeople() {
		$.ajax({
			url:"http://localhost:1337/Person/find",
			success:function(result){
				//people = result;
				findPeople(result);
				setInterval(function() {getPeople()}, 5000);
			}
		});
	}

	function findPeople(result) {
		var text = '';
		if(result.length > 0) {
			if(result[0].active != false) {
				text = "<section class='person active'"
			} else {
				text = "<section class='person'"
			}
			text = text + "id='firstPerson'>" +
			"<div class='in'></div>" +

			"<div class='click-response'></div>" +

			"<img class='img-in' src='assets/img/icon_josh.svg'>" +

			"<h1>"+result[0].name+"</h1>" +

			"</section>";
			for(var i = 1; i<result.length; i++) {
				if(result[i].active != false) {
					text = text + "<section class='person active'>"
				} else {
					text = text + "<section class='person'>"
				}
				text = text +
				"<div class='in'></div>" +

				"<div class='click-response'></div>" +

				"<img class='img-in' src='assets/img/icon_josh.svg'>" +

				"<h1>"+result[i].name+"</h1>" +

				"</section>"
			}
			$("#people").html(text);

			// Applying header height to firstName margin-top ==============================

			var headerHeight = $('header').outerHeight();

			$('#firstPerson').css('margin-top', headerHeight + 'px');

			// Click Response ==============================================================

			$('.person').on("touchStart click", function(event) {

				var clickDimension = $('.click-response').outerHeight() / 2;
				var topOffset = $(this).offset().top;

				$(this).find('.click-response').css('position', 'absolute').css('top', event.pageY - topOffset - clickDimension).css('left', event.pageX - clickDimension);
				$(this).find('.click-response').addClass('active clicked');
				setTimeout(function() {
					$('.clicked').removeClass('active clicked');
				}, 200);

			});
		}
	}

	//bind click event to a person as they are created
	$( "body" ).delegate( ".person", "click", function() {
		if($(this).hasClass('active')) {
			//todo post to this url and update the user based on the name with the current time/date
			$.post("http://localhost:1337/depart",
				{
					name:this.childNodes[3].innerHTML,
					active: false
				}, function(result) {
					console.log('depart.');
				});
			event.stopPropagation();
			$(this).removeClass('active');
		}
		else {
			$.post("http://localhost:1337/arrive",
				{
					name:this.childNodes[3].innerHTML,
					active: true
				}, function(result) {
					console.log('arrive.');
				});
			event.stopPropagation();
			$(this).addClass('active');
		}
	});
});
$(document).foundation();

