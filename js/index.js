$(document).ready(function() {
	
	var replacements = [
		[/\s+(him|her)(\s+|\.)/g, " them "],
		[/\s+(his|her)(\s+|\.)/g, " their "],
		[/\s+(he|she)(\s+|\.)/g, " they "],
		[/\s+(he's|she's)(\s+|\.)/g, " they're "],
		[/\s+(himself|herself)(\s+|\.)/, " themself "],
		[/\s+(male|man|female|woman|girl|boy)(\s+|\.)/, " individual "],
		[/\s+(males|men|females|women|girls|boys)(\s+|\.)/, " individuals "]
	];


	var stringReplacements = function(message) {
		for (var i = 0; i < replacements.length; i++) {
			message = message.replace(replacements[i][0], replacements[i][1]);
		}
		return message;
	};

	$("#submit-button").click(function(event) {
		$("#output-content").removeClass("pad-right");

		var alert = "<p class='error-message'>You must enter a name!</p>";

		// Pulls the values from the form
		var name = $("#name").val();
		var gender = $("#gender option:selected").val();

		// Sets this for just the HTTP request
		var aGenderThatWorksWithAPI = gender;

		// Encodes the name to send
		var encodedName = encodeURIComponent(name);

		// Makes sure that there is a name and a gender that has been entered
		if (name.length == 0) {
			$("#error-message-container").empty().append(alert);
			return false;
		}

		/* We are going to send the request as a male, since the API endpoint doesn't
		 * support any other identification, and then do string replacements on our end
		 * I flipped a coin and chose male since it was 50-50
		 */
		if (gender == "non-binary") {
			aGenderThatWorksWithAPI = "male";
		}


		// Show loading message on our end, until the response comes back
		$("#output-container").empty().append("Loading...");

		/* I decided to send the request to a PHP endpoint I defined, since there are too many CORS related issues I couldn't mitigate
		 * The PHP endpoint makes its own GET request from there
		 */
		return $.ajax({
			method: "POST",
			url: "php/send_request.php",
			data: {
				name: encodedName,
				gender: aGenderThatWorksWithAPI
			}
		})

		// Promise chaining kicks ass vs. callbacks IMO
		.done(function(response) {
			var responseObj = JSON.parse(response);
			var responseText = responseObj.Text;

			if (gender === "non-binary") {
				responseText = stringReplacements(responseText);
			}

			$("#output-container").addClass("pad-right");
			$("#output-container").empty().append(responseText);
		})
		.fail(function() {
			$("#output-container").empty().append("Failed to find a story for you.  Looks like your name broke the server!");
		});
	});
	
});