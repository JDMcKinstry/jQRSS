[jQRSS](https://github.com/JDMcKinstry/jQRSS/) - RSS Feed Reading Made EZ!
================================

This simple and easy to use jQuery Plugin makes calling RSS Feeds simple and easy and provides plenty of feedback in the developer console *if* available! It maintains a list of Ajax calls for RSS feeds. It also includings easy to override options, in case you want to make it a little more "your own.

## Quick Links
 - [Raw JS][1]
 - [Raw JS Minified][2]

#### Simply include it anywhere after your call to jQuery

	<script src="//rawgit.com/JDMcKinstry/jQRSS/master/jQRSS.js"></script>


#### And then use as simple as:

	$.jQRSS('http://www.yourRSSurl.com/', { options }, function (newsFeed, feedEntries) { /* do work! */ })

### Options:

 - **count**: Number of entries to return. Default 10. Max 100. (-1 == 100)
 - **historical**: Boolean setting. Default false. This value instructs the system to return any additional historical entries that it might have in its cache
 - **output**: "*json* || *json_xm*l || *xml*" Defaults to "json"
 - **rss**: String url to path of RSS Feed. [*Can be passed as simple string parameter instead*]
 - **userip**: Setting this to the end user's ip will help Google know this is not a bot making unfeathered calls, and reduce the chance of a erroneous return.
 - ***doLog***: Boolean whether or not to send information to the `console.log`

## Example Use of Callback
```js
$.jQRSS('http://www.fake-feed.com/myRSS/', { count: 8, output: 'xml' }, 
	function(feed, entries) {
		$('body').append(entries);
	}
);
```

### Overwritable Methods
#### In general, the following methods should not be changed, but if you'd like to change how the Plugin works upon each ajax call, here you go!

 - beforeSend
 - error
 - success

## Example jsFiddle Play
http://jsfiddle.net/SpYk3/Pp44S/

##Full Example Options Use

	$.jQRSS({
		count: 10,
		historical: false,
		output: 'json',
		rss: 'http://www.fake-feed.com/myRSS/',
		userip: '<? $_USERIP; ?>',
		beforeSend: function (jqXHR, settings) {
			alert(settings.ajaxID);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		},
		success: function(data, textStatus, jqXHR) {
			console.log(data.responseData['feed']);
		}
	});	//	no need for callback since your already manipulating the success method, thus a cb would never be called anyway

---

[1] https://rawgit.com/JDMcKinstry/jQRSS/master/jQRSS.js
[2] https://rawgit.com/JDMcKinstry/jQRSS/master/jQRSS.min.js
