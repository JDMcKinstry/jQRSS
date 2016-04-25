;;(function($, $fn) {	//	see also: https://developers.google.com/feed/v1/jsondevguide#using_json
	if ($.jQRSS) return $.jQRSS;
		
	/**	b64EncodeUnicode(str)
	 *	@description	Cross browser encoding method to help deal with "The Unicode Problem".
	 *					If you'd like to save on code and know you don't needthe extra support,
	 *						you can remove the inner "if" statement.
	 */
	function b64EncodeUnicode(str) {
		//	the following if statement can be removed for use in most modern browsers
		//	it is simply included for cross-browser compatibility
		if (!window['btoa']) {
			var base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
			return base64.encode(str);
		}
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) { return String.fromCharCode('0x' + p1); }));
	}
	
	/**	jQRSSDebug()
	 *	@description	Simply method for posting information about the plugin to the console.
	 */
	function jQRSSDebug() {
		try {
			if (arguments.length && window['console'] && console['log']) {
				console.log(new Array(50).join("-") + "jQRSS-DEBUG-BEGIN" + new Array(50).join("-"));
				console.log.apply(console, arguments);
				console.log(new Array(50).join("-") + "-jQRSS-DEBUG-END-" + new Array(50).join("-"));
			}
		}
		catch(err) {}
	}
	
	//	default variables
	var paramsDefault = {
			callback: "?"
			, gURL: "//ajax.googleapis.com/ajax/services/feed/"
			, scoring: "h"
			, type: "load"
			, ver: "1.0"
		}
		, propsDefault = {
			count: "10", // max 100, -1 defaults to 100
			doLog: true,
			historical: false,
			output: "json", // json, json_xml, xml
			rss: null,
			userip: null,
			beforeSend: undefined,
			error: undefined,
			success: undefined
		}
		, requestDefault = {
			ajax: void(0)
			, callbacks: []
			, props: propsDefault
			, params: paramsDefault
		}
	
	//	temp fix to local testing
	if (location.toString().match(/file\:\/\//)) paramsDefault.gURL = "http:" + paramsDefault.gURL
	
	/**	jQRSS()
	 *	@description	Main method to be used for creating jQuery Plugin
	 *	@see			https://github.com/JDMcKinstry/jQRSS
	 */
	function jQRSS() {
		if (0 >= arguments.length) return this.jQRSS ? this.jQRSS : void(0);
		var args = arguments
			, cbList = []
			, params = $.extend(!0, {}, paramsDefault)
			, props = $.extend(!0, {}, propsDefault)
			, request = $.extend(!0, {}, requestDefault)
			, gURL = params.gURL + params.type
		
		for (var i = 0; i < args.length; i++) switch (typeof args[i]) {
			case "function":
				cbList.push(args[i]);
				break;
			case "object":
				if (args[i].hasOwnProperty('callbacks')) {
					$.each(args[i].callbacks, function(i, func) { cbList.push(func); });
					delete args[i].callbacks;
				}
				$.extend(!0, props, args[i]);
				break;
			case "string":
				$.extend(!0, props, { rss: args[i] });
		};
		
		if (props.rss) props.rss = encodeURIComponent(props.rss);
		else throw Error("Must include RSS Feed URL");
		
		gURL += "?v=" + params.ver;
		gURL += "&q=" + props.rss;
		gURL += "&callback=" + params.callback;
		
		var ajaxData = { num: props.count, output: props.output }
		
		//	for returning "... any additional historical entries that it might have in its cache."
		if (props.historical) ajaxData.scoring = params.scoring;
		//	"... Google is less likely to mistake requests for abuse when they include userip. ..."
		if (props.userip != null) ajaxData.userip = props.userip;
		//	language support
		if (props.language) ajaxData.hl = props.language;
		
		var ajaxCBDefaults = {
				beforeSend: function(jqXHR, settings) {
					if (props.doLog) $.jQRSS.debug("REQUESTING RSS XML", { ajaxData: ajaxData, ajaxRequest: settings.url, jqXHR: jqXHR, settings: settings, options: props });
				}
				, error: function(jqXHR, textStatus, errorThrown) {
					if (props.doLog) $.jQRSS.debug("ERROR REQUESTING RSS XML", { jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
				}
				, success: function(data, textStatus, jqXHR) {
					var feed, entries;
					if (props.output.match('json')) {
						feed = data['responseData'] && data.responseData['feed'] ? data.responseData.feed : null;
						entries = feed && feed['entries'] ? feed.entries : null;
					}
					else {
						feed = data['responseData'] && data.responseData['xmlString'] ? $($.parseXML(data.responseData['xmlString'])) : null;
						entries = feed && feed.find('channel > item').length ? feed.find('channel > item') : null;
					}
					
					if (props.doLog) $.jQRSS.debug("REQUEST RSS SUCCESS", { data: data, textStatus: textStatus, jqXHR: jqXHR, feed: feed, entries: entries });
					
					if (!cbList) return { data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e };
					
					return $.each(cbList, function(k, v) {
						if (typeof v == 'function') return v.call(this, feed ? feed : data, entries ? entries : null);
					});
				}
			}
		
		var ajaxOpts = {
				dataType: "json"
				, data: ajaxData
				, type: "GET"
				, url: gURL
				, xhrFields: { withCredentials: true }
				, beforeSend: props['beforeSend'] ? props.beforeSend : ajaxCBDefaults.beforeSend
				, error: props['beforeSend'] ? props.error : ajaxCBDefaults.error
				, success: props['beforeSend'] ? props.success : ajaxCBDefaults.success
			}
		
		
		var requestID = function() {
				var str = '';
				$.each(props, function(k,v){
					if (/boolean|number|string/i.test(Object.prototype.toString.call(v).slice(8, -1)))
						str += k.toString() + v.toString();
				})
				str = b64EncodeUnicode(str).replace(/[^0-9a-zA-Z]/g, '');
				return str.substr(0, 10) + str.substr(~~(str.length / 4), 10) + str.substr((~~(str.length / 4) * 2), 10) + str.substr((~~(str.length / 4) * 3), 10) + str.substr(-10, 10);
			}()
		
		request = {
			id: requestID
			, ajaxOptions: ajaxOpts
			, callbacks: cbList
			, props: props
			, params: params
		}
		
		var iExists = $.jQRSS.requests.map(function(req){ return req.id }).indexOf(requestID)
		
		if (iExists > -1) {
			if ($.jQRSS.requests[iExists].ajax) $.jQRSS.requests[iExists].ajax.stop();
			$.jQRSS.requests[iExists].ajax = $.ajax(ajaxOpts);
			return $.jQRSS.requests[iExists]
		}
		
		request.ajax = $.ajax(ajaxOpts);
		$.jQRSS.requests.push(request);
		return request;
	}
	
	jQRSS.debug = jQRSSDebug;
	
	jQRSS.requests = [];
	
	$.extend({ jQRSS: jQRSS });
	
})(jQuery, jQuery.fn);
