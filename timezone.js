timezoneJS.timezone.zoneFileBasePath = "tzdata";
//timezoneJS.timezone.defaultZoneFile = ["asia", 
//"northamerica", "southamerica"];
timezoneJS.timezone.loadingScheme = timezoneJS.timezone.loadingSchemes.PRELOAD_ALL;
timezoneJS.timezone.init({async: false});

var TIMEZONE = {
	properties: {
		timezone: "",
		offset: 0
	},
	getUTCDate: function(newDate){
		var utcDate = new Date(newDate.getUTCFullYear(),
			newDate.getUTCMonth(),
			newDate.getUTCDate(),
			newDate.getUTCHours(),
			newDate.getUTCMinutes(),
			newDate.getUTCSeconds());
		return utcDate;
	},
	getServerTime: function(callback){
		$.ajax({
			type: "GET",
			url: "/",
			data: {},
			success: function(data, status, request){
				var dateStr = request.getResponseHeader("date");
				var serverTimeMillisGMT = Date.parse(new Date(Date.parse(dateStr)).toUTCString());
				var localMillisUTC = Date.parse(new Date().toUTCString());
				offset = serverTimeMillisGMT -  localMillisUTC;
			
				var date = new Date();
		    	date.setTime(date.getTime() + offset);
		    	
		    	callback(date);
			},
			error: function(err){
				console.log("error in fetching server date:");
				console.log(err);
			}
		});
	},
	getLocalTime: function(){
		if(TIMEZONE.properties.timezone == ""){
			//return TIMEZONE.getUTCDate(new Date());
			return new Date();
		}else{
			return TIMEZONE.getTimeFromTZ(TIMEZONE.properties.timezone);
		}
	},
	getTimeFromTZ: function(timezone){
		var dt = new timezoneJS.Date(new Date(), timezone);
		var newDate = new Date(dt.year, dt.month, dt.date, dt.hours, dt.minutes, dt.seconds, dt.milliseconds);
		//var utcDate = new Date(TIMEZONE.getUTCDate(newDate));
		return newDate;
	},
	convertTimeFromTZ: function(dateTime, timezone){
		var dt = new timezoneJS.Date(dateTime, timezone);
		var newDate = new Date(dt.year, dt.month, dt.date, dt.hours, dt.minutes, dt.seconds, dt.milliseconds);
		return dt;
	},
	setTimezone: function(timezone){
		TIMEZONE.properties.timezone = timezone;
		var dt = new timezoneJS.Date(new Date(), timezone);
		var offset = dt.getTimezoneOffset();
		TIMEZONE.properties.offset = offset;
	},
	getTimezone: function(timezone){
		return TIMEZONE.properties.timezone;
	},
	setOffset: function(offset){
		TIMEZONE.properties.offset = offset;
	},
	getOffset: function(){
		return TIMEZONE.properties.offset;
	},
	getLocalTimezone: function(){
		var offset = new Date().getTimezoneOffset();
		return offset;
	},
	printServerTime: function(){
		TIMEZONE.getServerTime(function(date){
			console.log("Server time is " + date);
		});
	},
	printClientTime: function(){
		console.log("Client time is " + TIMEZONE.getClientTime());
	}

}