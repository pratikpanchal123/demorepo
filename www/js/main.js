function init() {
document.addEventListener("deviceready", deviceReady, false);
//document.addEventListener("offline", offlineHandler, false);
deviceReady();
$.mobile.defaultPageTransition = "none"
delete init;
}

//cordova plugin add https://github.com/antonioJASR/FileOpener.git - file open
/*function offlineHandler()
{
	$.mobile.changePage("#offlinePage");
}*/

function checkPreAuth() {
    var form = $("#loginForm");
    if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
}

function getDeviceInfo(){
var string = device.platform;
var cordova = device.cordova;
var model = device.model;
var platform = device.platform;
var uuid = device.uuid; 
var version = device.version;
$("#model").html(model);
$("#platform").html(platform);
$("#uid").html(uuid);
$("#cordova").html(cordova);
$("#version").html(version);

}

function handleLogin() {
    var form = $("#loginForm");

    var username = $("#username", form).val();
    var password = $("#password", form).val();
	if(username != '' && password!= '') {
        var login_info = {"method":"login","username":username,"password":password};
        $("#loginForm",form).attr("disabled","disabled");
        $('#message-box-login').html("");
        $.ajax({
            url : "http://cyberancient.com/fecograph/webservices/services.php",
            type : 'POST', // I want a type as POST
            data : "data=" + JSON.stringify(login_info),
            dataType : "json",
            beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success : function(data) {
                if (data.success ==1) {
					window.localStorage["username"] = username;
					window.localStorage["password"] = password;
                    //$.mobile.changePage("#dashboardPage");
                    $.mobile.changePage("#dataGeneratePage");
                }else{
                    $('#message-box-login').html(data.msg);
                    $("#submitButton").removeAttr("disabled");
                    return false;
                }
            }
        });
    }
    return false;
}


//Function get data from local storage, use this please.
function getLocalStorageData(key)
{
	return localStorage.getItem(key);
}

//Function set data in local storage, use this please.
function setLocalStorageData(key,data)
{
	return localStorage.setItem(key,data);
}

//Clear complete local storage
function clearLocalStorage()
{
	localStorage.clear();
}

//Remove particular item from local storage
function removeItemLocalStorage(username)
{
	var userdata = JSON.parse(getLocalStorageData('userdata'));
	delete userdata[username];
	setLocalStorageData('userdata',JSON.stringify(userdata));
}



function handleLogout() {
	window.localStorage.removeItem("usename");
	window.localStorage.removeItem("password");
	$.mobile.changePage("#loginPage");
}

// ------- camera function start ---------------
function cameraFunction(){
//alert('test');
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.FILE_URI });
}
function onSuccess(imageURI) {
    var image = document.getElementById('myImage');
    image.src = imageURI;
}
function onFail(message) {
    var failmessage = 'Failed because: ' + message;
	$("#errorfail").html(failmessage);
}
//---------------camera function end -----------------
// ------------contact search --------------------
function contactSearchResult(){

// find all contacts with 'Bob' in any name field
navigator.contacts.pickContact(function(contact){
        var stringing = 'The following contact has been selected:' + JSON.stringify(contact);
		$("#contactResult").html(stringing);
    },function(err){
        //console.log('Error: ' + err);
		$("#contactResult").html(err);
    });
}

/*function onSuccess(onSuccessC) {
    var string = 'Found ' + contacts.length + ' contacts.';
	$('#contactResult').html(contacts.length);
};*/

function onError(contactError) {
    //alert('onError!');
	$('#contactResult').html('onError!');
};
// ------------contact search end --------------------

// ---------- alert function ------------
//1- alert
function alertDismissed() {
    // do something
	$("#alertResult").html("You have dismissed alert");
}
function alertCheck(){
navigator.notification.alert(
    'You are the winner!',  // message
    alertDismissed,         // callback
    'Game Over',            // title
    'Done'                  // buttonName
);
}

//2 - confirm
function onConfirm(buttonIndex) {
   var confirmRs = 'You selected button ' + buttonIndex;
   $("#confirmResult").html(confirmRs);
}
function confirmCheck(){
navigator.notification.confirm(
    'You are the winner!', // message
     onConfirm,            // callback to invoke with index of button pressed
    'Game Over',           // title
    ['Restart','Exit']     // buttonLabels
);
}
//3 - prompt

function onPrompt(results) {
    var promtRs = "You selected button number " + results.buttonIndex + " and entered " + results.input1;
	$("#promptResult").html(promtRs);
}
function promptCheck(){
navigator.notification.prompt(
    'Please enter your name',  // message
    onPrompt,                  // callback to invoke
    'Registration',            // title
    ['Ok','Exit'],             // buttonLabels
    'Jane Doe'                 // defaultText
);
}
//------- alert end ----------------------

// ------- Network information ---------------- 
function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    var stringInfo = 'Connection type: ' + states[networkState];
	navigator.notification.alert(
    stringInfo,  // message
    alertDismissed,         // callback
    'Network Information',     // title
    'Done'                  // buttonName
);

}
// ------------- Network Information end ----------------
// ------------- Geolocation---------------
 function onSuccessCallCheck(position) {
   var TextResutl = 'Latitude: '+ position.coords.latitude + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n';
		
		//TextResutl ='tst';
	navigator.notification.alert(
		TextResutl,  // message
		alertDismissed,         // callback
		'Geolocation',     // title
		'Done'                  // buttonName
		);
		  
};

function getPosition(){
	navigator.geolocation.getCurrentPosition(onSuccessCallCheck, onErrorCallBack);
	/*TextResutl ='tst';
	navigator.notification.alert(
		TextResutl,  // message
		alertDismissed,         // callback
		'Geolocation',     // title
		'Done'                  // buttonName
		);*/
}

function onErrorCallBack(error) {
   /* var TextResutle ='code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n';*/
		  TextResutle = 'not';
		
	navigator.notification.alert(
		TextResutle,  // message
		alertDismissed,         // callback
		'Geolocation',     // title
		'Done'                  // buttonName
		);
}
// ------------- Geolocaltion end---------------
//--------------- Vibration--------------
function vibratePhone(){
navigator.vibrate(3000);
}
// ------------ Vibration end -------------
// ---------- File Download -------------------

function fileSystemSuccess(fileSystem) {
filepath = "https://www.google.co.in/images/srpr/logo11w.png";
var directoryEntry = fileSystem.root; // to get root path to directory
	var st = "'";
    directoryEntry.getDirectory("demo", {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail);
    var rootdir = fileSystem.root;
    var fp = rootdir.toURL();
    fp = fp+"/demo/image_name.png";
	var path = encodeURI(filepath);
    var fileTransfer = new FileTransfer();
	
	fileTransfer.download(path,fp,  
        function(entry) {
		navigator.notification.alert(
		entry.toURL(),  // message
		alertDismissed,         // callback
		'Geolocation',     // title
		'Done'                  // buttonName
		);
    	var image = document.getElementById('myImageDownload');
    image.src = entry.toURL();
    	},
    	function(error) {
    	    /*alert("download error source " + error.source);
    	    alert("download error target " + error.target);
    	    alert("upload error code" + error.code);*/
			navigator.notification.alert(
		error.code,  // message
		alertDismissed,         // callback
		'Geolocation',     // title
		'Done'                  // buttonName
		);
    	}
    );
}
function downloadFile(){
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
}

function onDirectorySuccess(parent) {
    console.log(parent);
}

function onDirectoryFail(error) {
    alert("Unable to create new directory: " + error.code);
}

function fileSystemFail(evt) {
    console.log(evt.target.error.code);
}
// ------------ File download end -------------------
function deviceReady() {
$("#cameraimg").on("click",cameraFunction);
$("#findContact").on("click",contactSearchResult);

}