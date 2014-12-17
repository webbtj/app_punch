// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).ready(function() {
	//todo retreive list of people and print them
	var people = [];
	$.ajax({
		url:"http://localhost:1337/Person/find",
		success:function(result){
			people = result;
			findPeople(people);

			// OnClick =====================================================================
			$('.person').click(function() {

				if($(this).hasClass('active')) {
					//todo post to this url and update the user based on the name with the current time/date
					$.post("http://localhost:1337/depart",
					{
					  name:this.childNodes[3].innerHTML
					}, function(result) {
					  console.log('depart.');
					});
					event.stopPropagation();
					$(this).removeClass('active');
				}
				else {
					$.post("http://localhost:1337/arrive",
					{
						name:this.childNodes[3].innerHTML
					}, function(result) {
						console.log('arrive.');
					});
					event.stopPropagation();
					$(this).addClass('active');
				}

			});

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
			console.log('finding;');
			console.log(people);
			setInterval(function() {console.log('doing something.'); findPeople(people);}, 5000);
		}
	}); //end of user.find and binding clicks


	function findPeople(result) {
		var text = '';
		console.log('find people.');
		if(result.length > 0) {
			text = "<section class='person' id='firstPerson'>" +
			"<div class='in'></div>" +

			"<div class='click-response'></div>" +

			"<img class='img-in' src='assets/img/icon_jeff.svg'>" +

			"<h1>"+result[0].name+"</h1>" +

			"</section>";
			for(var i = 1; i<result.length; i++) {
				text = text + "<section class='person'>" +
				"<div class='in'></div>" +

				"<div class='click-response'></div>" +

				"<img class='img-in' src='assets/img/icon_jeff.svg'>" +

				"<h1>"+result[i].name+"</h1>" +

				"</section>"
			}
			$("#people").html(text);
		}
	}

	
	//function findPeople() {
	//	var text = '';
	//	console.log('find people.');
	//	if(people.length > 0) {
	//		text = "<section class='person' id='firstPerson'>" +
	//		"<div class='in'></div>" +
    //
	//		"<div class='click-response'></div>" +
    //
	//		"<img class='img-in' src='assets/img/icon_jeff.svg'>" +
    //
	//		"<h1>"+people[0].name+"</h1>" +
    //
	//		"</section>";
	//		for(var i = 1; i<people.length; i++) {
	//			text = text + "<section class='person'>" +
	//			"<div class='in'></div>" +
    //
	//			"<div class='click-response'></div>" +
    //
	//			"<img class='img-in' src='assets/img/icon_jeff.svg'>" +
    //
	//			"<h1>"+people[i].name+"</h1>" +
    //
	//			"</section>"
	//		}
	//		$("#people").append(text);
	//	}
	//}
});
$(document).foundation();

