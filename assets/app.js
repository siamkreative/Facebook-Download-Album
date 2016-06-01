// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	if (response.status === 'connected') {

		// Logged into your app and Facebook.
		downloadAlbum();

	} else if (response.status === 'not_authorized') {

		// The person is logged into Facebook, but not your app.
		var msg = 'To use this free tool, please log ' + 'into this app.';
		$('.form-disabled').on('click', function (event) {
			event.preventDefault();
			alert(msg);
		});
		$('#status').html(msg);
		$('.fb-login-button').css('display', 'inline-block');

	} else {

		// The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
		var msg = 'To use this free tool, please log ' + 'into Facebook.';
		$('.form-disabled').on('click', function (event) {
			event.preventDefault();
			alert(msg);
		});
		$('#status').html(msg);
		$('.fb-login-button').css('display', 'inline-block');

	}
}

// This function is called when someone finishes with the Login Button.
function checkLoginState() {
	FB.getLoginStatus(function (response) {
		statusChangeCallback(response);
	});
}

// Init parameters for the SDK
window.fbAsyncInit = function () {
	FB.init({
		appId: '1117073418349661',
		cookie: true,
		xfbml: true,
		version: 'v2.6'
	});

	FB.getLoginStatus(function (response) {
		statusChangeCallback(response);
	});
};

// Load the SDK asynchronously
(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Our callback function
function downloadAlbum() {

	// Graph API - Display the current user's name
	FB.api('/me', function (response) {
		$('#status').html('Thanks for using this tool, ' + response.name);
	});

	// Enable the form
	$('#form').removeClass('form-disabled');
	$('#form').on('submit', function (event) {
		event.preventDefault();

		// Show loading spinner
		$('#results').show();

		// Get the Album ID from the requested URL
		var id;
		var str = $('#album_url').val();
		if (str.indexOf("album_id=") >= 0) {
			id = str.split('album_id=')[1];
		} else if (str.indexOf('set=a.')) {
			id = str.split('set=a.')[1];
			id = id.split('.')[0];
		}

		// Graph API - Get album photos
		FB.api(id + '/?fields=photos{images}', function (response) {

			// Count the photos
			var count = Object.keys(response.photos.data).length;

			// Show photos as thumbnails
			var dynamicItems = '';
			var sizeSmallest;
			var sizeBiggest;
			var list = $('#list').html('');
			$.each(response.photos.data, function (index, val) {
				sizeSmallest = val.images[val.images.length - 1];
				sizeBiggest = val.images[0];
				dynamicItems += '<a download class="download" href="' + sizeBiggest.source + '"><img src="' + sizeSmallest.source + '" width="' + sizeSmallest.width + '" height="' + sizeSmallest.height + '" alt=""></a>';
			});
			list.append(dynamicItems);

			// Download photos using vanilla JavaScript for the onClick event
			$('#download_all .count').html('(' + count + ')');
			$('#download_single').show();
			$('#download_all').show().click(function (event) {
				event.preventDefault();
				$('.download').each(function (index, el) {
					document.getElementsByClassName("download")[index].click();
				});
			});

		});
	});
}