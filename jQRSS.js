(function($) {	//	see also: https://developers.google.com/feed/v1/jsondevguide#using_json
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
				
				var base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}},
					gURL = gURLArgs.gURL + gURLArgs.type + "?v=" + gURLArgs.ver + "&q=" + props.rss + "&callback=" + gURLArgs.callback,
					ajaxData = { num: props.count, output: props.output },
					ajaxID = base64.encode(props.rss + gURL).replace(/[^0-9a-zA-Z]/g, '');
				
				//	for returning "... any additional historical entries that it might have in its cache."
				if (props.historical) ajaxData.scoring = gURLArgs.scoring;
				//	"... Google is less likely to mistake requests for abuse when they include userip. ..."
				if (props.userip != null) ajaxData.userip = props.userip;
				//	language support
				if (props.language) ajaxData.hl = props.language;
				
				var ajaxOpts = {
						ajaxID: ajaxID,
						callback: cb,
						dataType: "json",
						data: ajaxData,
						type: "GET",
						url: gURL,
						xhrFields: { withCredentials: true },
						beforeSend: props['beforeSend'] ? props.beforeSend : function (jqXHR, settings) {
							if (props.doLog) {
								try {
									if (window['console']) {
										console.log(new Array(30).join('-'), "REQUESTING RSS XML", new Array(30).join('-')); 
										console.log({ ajaxData: ajaxData, ajaxRequest: settings.url, jqXHR: jqXHR, settings: settings, options: props }); 
										console.log(new Array(80).join('-'));
									}
								} catch(err) {  }
							}
							console.log(settings.url)
						},
						error: props['error'] ? props.error : function (jqXHR, textStatus, errorThrown) {
							if (props.doLog) {
								try {
									if (window['console']) {
										console.log(new Array(27).join('-'), "ERROR REQUESTING RSS XML", new Array(27).join('-')); 
										console.log({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown }); 
										console.log(new Array(80).join('-'));
									}
								} catch(err) {  }
								throw new Error("ERROR", textStatus, errorThrown );
							}
						},
						success: props['success'] ? props.success : function (data, textStatus, jqXHR) {
							var feed, entries;
							if (props.output.match('json')) {
								feed = data['responseData'] && data.responseData['feed'] ? data.responseData.feed : null;
								entries = feed && feed['entries'] ? feed.entries : null;
							}
							else {
								feed = data['responseData'] && data.responseData['xmlString'] ? $($.parseXML(data.responseData['xmlString'])) : null;
								entries = feed && feed.find('channel > item').length ? feed.find('channel > item') : null;
							}
							
							if (props.doLog) {
								try {
									if (window['console']) {
										console.log(new Array(30).join('-'), "SUCCESS", new Array(30).join('-'));
										console.log({ data: data, textStatus: textStatus, jqXHR: jqXHR, feed: feed, entries: entries });
										console.log(new Array(68).join('-'));
									}
								} catch(err) {  }
							}
							
							if (cb) return cb.call(this, feed ? feed : data, entries ? entries : null);
							else return { data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e };
						}
					},
					newCallID = true;
				
				if ($.jQRSS.ajax.length) {
					for (var i=0;i<$.jQRSS.ajax.length;i++) {
						if ($.jQRSS.ajax[i].ID == ajaxID) {
							$.jQRSS.ajax[i].abort();
							$.jQRSS.ajax[i] = $.ajax(ajaxOpts);
							$.jQRSS.ajax[i].ID = ajaxID;
							$.jQRSS.ajax[i].gURL = gURL;
							$.jQRSS.ajax[i].url= props.rss;
							return;
						}
					}
				}
				
				$.jQRSS.ajax.push($.ajax(ajaxOpts));
				$.jQRSS.ajax[$.jQRSS.ajax.length-1].ID = ajaxID;
				$.jQRSS.ajax[$.jQRSS.ajax.length-1].gURL = gURL;
				$.jQRSS.ajax[$.jQRSS.ajax.length-1].url = props.rss;
				
			}
		});
		$.jQRSS.ajax = [];	//	maintains running log of ajax calls for rss feeds
		$.jQRSS.gURLArgs = {
			callback: "?",
			gURL: "//ajax.googleapis.com/ajax/services/feed/",
			scoring: "h",
			type: "load",
			ver: "1.0"
		};
        $.jQRSS.props = {
            count: "10", // max 100, -1 defaults to 100
			doLog: true,
            historical: false,
            output: "json", // json, json_xml, xml
            rss: null,
            userip: null,
			beforeSend: undefined,
			error: undefined,
			success: undefined
        };
		//	temp fix to local testing
		if (location.toString().match(/file\:\/\//)) $.jQRSS.gURLArgs.gURL = "http:" + $.jQRSS.gURLArgs.gURL
	}
})(jQuery);
