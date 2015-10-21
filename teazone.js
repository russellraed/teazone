var TZConfig = {
    dataSource: "https://cdn.rawgit.com/mde/timezone-js/master/src/date.js",
    debug: true,
    zepto: "//zeptojs.com/zepto.min.js",
    zoneFileBasePath: "ftp://ftp.iana.org/tz/data/"
}

var TZLibrary = {
    prepareEnvironment: function(){
        var head = document.getElementsByTagName("head")[0];
        head.addEventListener("load", function(event) {
            var source = event.target.getAttribute("src");
            if (event.target.nodeName === "SCRIPT" && TZConfig.dataSource == source){
                TZLibrary.log("js file " + source + " loaded");
                timezoneJS.timezone.zoneFileBasePath = TZConfig.zoneFileBasePath;
                timezoneJS.timezone.loadingScheme = timezoneJS.timezone.loadingSchemes.PRELOAD_ALL;
                timezoneJS.timezone.init({async: false});
                TZLibrary.log("tz configurations are set");
            }
        }, true);
    },
    loadJSFile: function(filename){
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);

        if(!this.appendFile(fileref)){
            TZLibrary.log("[ERROR] js file " + filename + " could not be loaded");
        }
    },
    appendFile: function(file){
        if (typeof file != "undefined"){
            document.getElementsByTagName("head")[0].appendChild(file);
            return true;
        }
        return false;
    },
    log: function(message){
        if(TZConfig.debug){
            console.log(message);
        }
    },
    logHttpRequest: function(state, req){
        var stateLabel = "";
        switch (state) {
            case 0:
                stateLabel = 'UNSENT';
            case 1:
                stateLabel = 'OPENED';
            case 2:
                stateLabel = 'HEADERS_RECEIVED';
            case 3:
                stateLabel = 'LOADING';
            case 4:
                stateLabel = 'DONE';
            default:
                stateLabel = '';
        }
        TZLibrary.log("Inside the onreadystatechange event with readyState: " + stateLabel);
        TZLibrary.log("REQUEST: ");
        TZLibrary.log(req);
    }
}

var TeaZone = function(){
    TZLibrary.prepareEnvironment();
    this.loadLibraries();
    this.loadTZData(TZConfig.dataSource);
    this.serverTime();
}

TeaZone.prototype.loadLibraries = function(){
    TZLibrary.log("loading zepto from " + TZConfig.zepto);
    TZLibrary.loadJSFile(TZConfig.zepto);
}

TeaZone.prototype.loadTZData = function(source){
    TZLibrary.log("loading tz data from " + source);
    TZLibrary.loadJSFile(source);
}

TeaZone.prototype.serverTime = function(){
    var req = new XMLHttpRequest();
    req.onload = function () {
        TZLibrary.log('Inside the onload event');
    };
    req.onreadystatechange = function () {
        TZLibrary.logHttpRequest(state, req);
    };
    req.open('GET', "/", true);
    req.send();
}