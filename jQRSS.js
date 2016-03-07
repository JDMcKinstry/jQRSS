(function($) {	//	https://developers.google.com/feed/v1/jsondevguide#using_json
	if (!$.jQRSS) {
		$.extend({
			jQRSS: function() {
				if (0 >= arguments.length) return !1;
				var args = arguments,
					gURLArgs = $.jQRSS.gURLArgs,
					props = $.extend(true, {}, $.jQRSS.props),
					rss, cb;
				
				for (var i = 0; i < args.length; i++) switch (typeof args[i]) {
					case "function":
						cb = args[i];
						break;
					case "object":
						$.extend(!0, props, args[i]);
						break;
					case "string":
						$.extend(!0, props, { rss: args[i] });
				};
				
				if (props.rss) props.rss = escape(props.rss);
				else throw Error("Must include RSS Feed URL");
				
				var gURL = gURLArgs.gURL + gURLArgs.type + "?v=" + gURLArgs.ver + "&q=" + props.rss + "&callback=" + gURLArgs.callback,
					ajaxData = { num: props.count, output: props.output },
					ajaxID = props.rss.replace(/[^0-9a-zA-Z]/g, '').substr(-10);
				
				//	for returning "... any additional historical entries that it might have in its cache."
				if (props.historical) ajaxData.scoring = gURLArgs.scoring;
				//	"... Google is less likely to mistake requests for abuse when they include userip. ..."
				if (props.userip != null) ajaxData.userip = props.userip;
				
				var ajaxOpts = {
					url: gURL,
					dataType: props.output.match(/json/ig) ? "json" : "xml",
					data: ajaxData,
					type: "GET",
					xhrFields: { withCredentials: true },
					beforeSend: props['beforeSend'] ? props.beforeSend : function (jqXHR, settings) { 
						try {
							if (window['console']) {
								console.log(new Array(30).join('-'), "REQUESTING RSS XML", new Array(30).join('-')); 
								console.log({ ajaxData: ajaxData, ajaxRequest: settings.url, jqXHR: jqXHR, settings: settings, options: props }); 
								console.log(new Array(80).join('-'));
							}
						} catch(err) {  }
					},
					error: props['error'] ? props.error : function (jqXHR, textStatus, errorThrown) {
						try {
							if (window['console']) {
								console.log(new Array(27).join('-'), "ERROR REQUESTING RSS XML", new Array(27).join('-')); 
								console.log({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown }); 
								console.log(new Array(80).join('-'));
							}
						} catch(err) {  }
						throw new Error("ERROR", textStatus, errorThrown );
					},
					success: props['success'] ? props.success : function (data, textStatus, jqXHR) {  
						var f = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : null : null,
							e = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed['entries'] ? data.responseData.feed.entries : null : null : null
						try {
							if (window['console']) {
								console.log(new Array(30).join('-'), "SUCCESS", new Array(30).join('-'));
								console.log({ data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e });
								console.log(new Array(68).join('-'));
							}
						} catch(err) {  }
						
						if (cb) return cb.call(this, data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : data.responseData : null);
						else return { data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e };
					}
				}
				
				if ($.jQRSS.ajax[ajaxID]) $.jQRSS.ajax[ajaxID].abort();
				$.jQRSS.ajax[ajaxID] = $.ajax(ajaxOpts);
			}
		});
		$.jQRSS.ajax = {};	//	maintains running log of ajax calls for rss feeds
		$.jQRSS.gURLArgs = {
			callback: "?",
			gURL: "http://ajax.googleapis.com/ajax/services/feed/",
			scoring: "h",
			type: "load",
			ver: "1.0"
		};
        $.jQRSS.props = {
            count: "10", // max 100, -1 defaults to 100
            historical: false,
            output: "json", // json, json_xml, xml
            rss: null,
            userip: null,
			beforeSend: undefined,
			error: undefined,
			success: undefined
        };
	}
})(jQuery);
