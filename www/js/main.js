function init() {
document.addEventListener("deviceready", deviceReady, false);
document.addEventListener("offline", offlineHandler, false);
deviceReady();
$.mobile.defaultPageTransition = "none"
delete init;
}

//cordova plugin add https://github.com/antonioJASR/FileOpener.git - file open
function offlineHandler()
{
	$.mobile.changePage("#offlinePage");
}

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

function handleSignup() {
	var form = $("#signupForm");
	var username = $("#susername", form).val();
	var password = $("#spassword", form).val();
	var mobile = $("#mobile", form).val();
	var email = $("#email", form).val();
	var name = $("#name", form).val();
	var gender = $('input[name=gender]:checked').val();
	var singupinfo = {"name":name,"email":email,"gender":gender,"method":"register","phone":mobile,"username":username,"password":password};
	
	$("#signupfrombutton",form).attr("disabled","disabled");
    $('#message-box').html("");
		$.ajax({
		url : "http://cyberancient.com/fecograph/webservices/services.php",
		type : 'POST', // I want a type as POST
		data : "data=" + JSON.stringify(singupinfo),
		dataType : "json",
        beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
        complete: function() { $.mobile.loading('hide'); }, //Hide spinner
        success : function(data) {
		//console.log(data);
			if (data.success ==1) {
				$.mobile.changePage("#regiserSuccessPage");
			}else{
				$('#message-box').html(data.msg);
				$("#submitButton").removeAttr("disabled");
			}
		}
	});
    return false;
}

function handleForgotPassword(){
    var form = $("#forgot_password");
    var username = $("#username", form).val();
    var recovery_info = {"username":username,"method":"forgot_password"};

    $.ajax({
        url : "http://cyberancient.com/fecograph/webservices/services.php",
        type : 'POST', // I want a type as POST
        data : "data=" + JSON.stringify(recovery_info),
        dataType : "json",
        beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
        complete: function() { $.mobile.loading('hide'); }, //Hide spinner
        success : function(data) {
            if (data.success == 1) {
                //$.mobile.changePage("#loginPage");
				$("#password_form").hide();
				$('#password_message').show();
                $("#password_message").html("Your password is: <b>"+data.password+"</b> <br> <br> Click here to continue with <a href='#loginPage'>login</a>");
            }else{
				$('#password_message').show();
				$("#password_form").show();
                $("#password_message").html(data.msg);
                $("#submitButton").removeAttr("disabled");
            }
        }
    });
    return false;
}
function handleGraphFormOne(){
	var form = $("#dataGenerateFrom");
	var values = $('input[name=graphValue]:checked').val();
	sessionStorage.setItem('type', values);
	$.mobile.changePage("#dataGeneratePageTwo");
	return false;
}

function handleGraphValues(){
var form = $("#dataGenerateFromTwo");
var username = getLocalStorageData('username');
//alert(username);
var sympt = sessionStorage.getItem("type");
//alert(sympt);
var dataString = "";
$('input[name="mid_type"]:checked').each(function() {
   dataString += this.value+',';
});
var sttt = dataString.substring(0,dataString.length - 1);
var data_values = {"stool_type":sympt,"symptoms":sttt};
//localStorage.clear();
var userdata = getLocalStorageData('userdata');
addUserData(username,data_values);
//var count = getCountOfUserData(username);
//alert(count);
$.mobile.changePage("#dataGeneratePage");

/*var userdata = localStorage.getItem('userdata');
console.log(JSON.parse(userdata));*/
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

//Count of data for particular user
function getCountOfUserData(username)
{
	var local_userdata = getLocalStorageData('userdata');
	
	//if(local_userdata == null || userdata[username]==undefined)
	if(local_userdata == null)
	{
		return "0";
	}
	else
	{
		var userdata = JSON.parse(local_userdata);
		if(userdata[username]==undefined)
		{
			return "0";
		}
		else
		{
			return userdata[username].data.length;
		}
	}
}

//Count of data for particular user
function removeUserData(username, data_key)
{
	var userdata = JSON.parse(getLocalStorageData('userdata'));

	if(userdata == null || userdata[username] == undefined)
	{
		return false;
	}
	else
	{
		userdata[username].data.splice(data_key,1);
		setLocalStorageData('userdata',JSON.stringify(userdata));
	}
}

function addUserData(username, data)
{
	//Get local data if any exists
	if(getLocalStorageData('userdata') == null || getLocalStorageData('userdata') == '{}')
	{
		//If null create user wise entry in userdata
		//if(userdata == null || userdata[username] == undefined)
		{
			var userdata = {};
			//var first_data = {"data":[{"stool_type":"type1-hard","symptoms":"incomplete,with pain"}]};
			var first_data = {"data":[data]};
			userdata[username] = first_data;
		}
		/*
		else
		{
			userdata[username].data.push(data);
		}
		*/
	}
	else
	{
		var userdata = JSON.parse(getLocalStorageData('userdata'));
		userdata[username].data.push(data);
	}
	setLocalStorageData('userdata',JSON.stringify(userdata));
}

function handleGraphValuesOnPageInit(){
	var form = $("#dataGenerateFrom");
	
	var username = getLocalStorageData('username');
	
	var count = getCountOfUserData(username);
	
	var message;

	message = "Your total values saved ="+count+"/30";
	$('#generateFecograph').button('disable');
	if(count >= 20){
		message = "Your total values saved ="+count+"/30 but still you can generate graph"
		$('#generateFecograph').button('enable');
	} 
	if (count >= 30){
	
		message = "Your total values saved ="+count+"/30,Generate graph to added new values";
		$('#generateFecograph').button('enable');
		$('#submitGraph').button('disable');
	}
	dispalyMessage(message);
	 return false;
}

function generateFinalGrahp(){
var data = getLocalStorageData('userdata');
var username = window.localStorage["username"];
 $.ajax({
        url : "http://cyberancient.com/fecograph/webservices/services.php",
        type : 'POST', // I want a type as POST
        data : "data=" + data + "&method=GraphData&username="+username ,
        dataType : "json",
        beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
        complete: function() { $.mobile.loading('hide'); }, //Hide spinner
        success : function(data) {
            if (data.success == 1) {
				if(data.clear_data == 1){
					//removeItemLocalStorage(username);
					$.mobile.changePage("#viewGraphPage");
					
				}else{
				//$.mobile.changePage("#graphGenerateSuccess");
				$.mobile.changePage("#viewGraphPage");
				}
			}else{
                alert('not test');
            }
        }
    });
 return false;
}

function dispalyMessage(message){
	$('#message-box-graphValue').html(message);
}

function dataCount(){
var str = localStorage.getItem("graphArray");
	if(str==null){
		return 0;
		}else{
			var arr  = str.split(",");
			return arr.length
		}
}


function handleLogout() {
	window.localStorage.removeItem("usename");
	window.localStorage.removeItem("password");
	$.mobile.changePage("#loginPage");
}
function resetForm(form_id){
	// alert("hi")
	// alert($("#"+form_id));
	$("#"+form_id).trigger('reset');
}
 var filepath;
function getGraphData(){
	$("#graphdata").html("");
	var username = getLocalStorageData('username');
    var graph_info = {"username":username,"method":"getGraphData"};
var st = "'";
    $.ajax({
        url : "http://cyberancient.com/fecograph/webservices/services.php",
        type : 'POST', // I want a type as POST
        data : "data=" + JSON.stringify(graph_info),
        dataType : "json",
        beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
        complete: function() { $.mobile.loading('hide'); }, //Hide spinner
        success : function(data) {
			var i = 0;
            if (data.success == 1) {
                $("#graphdata").append("<div id='records'>");
				$.each(data.record, function (col, graph_row) {
					filepath = data.record[col].graph_name;
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
                });
				$("#graphdata").append("</div>");
			}else{
                $("#graphdata").html(data.msg);
            }
        }
    });
    return false;
}

// file system function start
function fileSystemSuccess(fileSystem) {
    var directoryEntry = fileSystem.root; // to get root path to directory
	var st = "'";
    directoryEntry.getDirectory("fecograph", {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail);
    var rootdir = fileSystem.root;
    var fp = rootdir.toURL();
    fp = fp+"/fecograph/image_name.png";
	var path = encodeURI(filepath);
    var fileTransfer = new FileTransfer();
	fileTransfer.download(path,fp,  
        function(entry) {
    	    $("#graphdata").append("<div id='inner_div' style='width: 100%;'>");
					//$("#graphdata").append("<a href=<img style='width: 100%;' src='"+ filepath +"'>");
					$("#inner_div").append('<a href="javascript:window.plugins.fileOpener.open('+ st + entry.toURL() + st +')" ><img style="width: 100%;" src="'+ filepath +'"/></a>');
					$("#graphdata").append("</div>");
					$("#graphdata").append("<div id='test' style='width: 100%;'>");
				$("#test").append('<input class="ui-btn ui-icon-mail" type="button" value="Share" onclick="window.plugins.socialsharing.share(null, null, '+ st + filepath + st +', null)" >');
				$("#graphdata").append("</div>");
    	},
    	function(error) {
    	    alert("download error source " + error.source);
    	    alert("download error target " + error.target);
    	    alert("upload error code" + error.code);
    	}
    );
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
//--------file system function end 

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
    alert('Failed because: ' + message);
}
//---------------camera function end -----------------

function contactSearchResult(){

// find all contacts with 'Bob' in any name field
/*var options      = new ContactFindOptions();
options.filter   = "Bob";
options.multiple = true;
options.desiredFields = [navigator.contacts.fieldType.id];
var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
navigator.contacts.find(fields, onSuccessC, onError, options);*/
navigator.contacts.pickContact(function(contact){
        var stringing = 'The following contact has been selected:' + JSON.stringify(contact);
		$("#contactResult").html(stringing);
    },function(err){
        //console.log('Error: ' + err);
		$("#contactResult").html(err);
    });
}

function onSuccess(onSuccessC) {
    var string = 'Found ' + contacts.length + ' contacts.';
	$('#contactResult').html(contacts.length);
};

function onError(contactError) {
    //alert('onError!');
	$('#contactResult').html('onError!');
};
function deviceReady() {
$("#cameraimg").on("click",cameraFunction);
$("#findContact").on("click",contactSearchResult);

}