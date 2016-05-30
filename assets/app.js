$(function () {
	$('#form').on('submit', function (event) {
		event.preventDefault();

		// Show loading spinner
		$('#results').show();

		/**
		 * Get the Album ID from URL
		 */
		var id;
		id = $('#album_url').val().split('set=a.')[1];
		id = id.split('.')[0];

		/**
		 * Build the Graph API endpoint
		 */
		var params = {
			fields: 'photos{images}',
			access_token: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
		};
		var endpoint = 'https://graph.facebook.com/v2.6/' + id + '/?' + $.param(params, true);

		/**
		 * Get the Photos from Graph API
		 */
		$.getJSON(endpoint, function (json, textStatus) {

			/**
			 * Create list of photos
			 */
			var dynamicItems = '';
			var sizeSmallest;
			var sizeBiggest;
			var list = $('#list').html('');
			$.each(json.photos.data, function (index, val) {
				sizeSmallest = val.images[val.images.length - 1];
				sizeBiggest = val.images[0];
				dynamicItems += '<a download class="download" href="' + sizeBiggest.source + '"><img src="' + sizeSmallest.source + '" width="' + sizeSmallest.width + '" height="' + sizeSmallest.height + '" alt=""></a>';
			});
			list.append(dynamicItems);

			/**
			 * Download photos
			 * Uses vanilla JavaScript for the onClick event
			 */
			$('#download_single').show();
			$('#download_all').show().click(function (event) {
				event.preventDefault();
				$('.download').each(function (index, el) {
					document.getElementsByClassName("download")[index].click();
				});
			});
		});
	});
});