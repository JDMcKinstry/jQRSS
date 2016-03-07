[jQRSS](https://github.com/JDMcKinstry/jQRSS/) - RSS Feed Reading Made EZ!
================================

This simple and easy to use jQuery Plugin makes calling RSS Feeds simple and easy and provides plenty of feedback in the developer console *if* available! It maintains a list of Ajax calls for RSS feeds. It also includings easy to override options, in case you want to make it a little more "your own.

#### Simply include it anywhere after your call to jQuery and then use as simple as:

	$.jQRSS('http://www.yourRSSurl.com/', { options }, function (newsFeed) { /* do work! */ })

### Options:

 - **count**: Number of entries to return. Default 10. Max 100. (-1 == 100)
 - **historical**: Boolean setting. Default false. This value instructs the system to return any additional historical entries that it might have in its cache
 - **output**: "*json* || *json_xm*l || *xml*" Defaults to "json"
 - **rss**: String url to path of RSS Feed. [*Can be passed as simple string parameter instead*]
 - **userip**: Setting this to the end user's ip will help Google know this is not a bot making unfeathered calls, and reduce the chance of a erroneous return.
 
### Overwritable Methods
#### In general, the following methods should not be changed, but if you'd like to change how the Plugin works upon each ajax call, here you go!

 - beforeSend
 - error
 - success

## Example jsFiddle Play
http://jsfiddle.net/SpYk3/Pp44S/
