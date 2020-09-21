// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
"use strict";

//var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
const connection = new signalR.HubConnectionBuilder().withUrl("/chathub").withAutomaticReconnect().build();
var connectionid = "";
async function start() {
    try {
        await connection.start();
        console.log("connected");
        document.getElementById("Login").click();
    } catch (err) {
        console.log(err);
        setTimeout(() => start(), 10000);
    }
};

connection.onclose(async () => {
    await start();
});

var date = new Date();
console.log('start', date);
//Disable send button until connection is established
document.getElementById("SendAll").disabled = true;

connection.on("ReceiveMessage", function (user, message) {  
    console.log("ReceiveMessage+++++++++++++++++++");
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " SaysAll " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

//ReceiveMessageToUser
connection.on("ReceiveMessageToUser", function (user, message) {
    console.log("ReceiveMessageToUser++++++++++++");
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + ": " + msg;
    console.log(encodedMsg);
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    console.log("XXXXXX")
    document.getElementById("SendAll").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("SendAll").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessageAll", user, message).catch(function (err) {
        start();
        return console.error(err.toString());
    });
    event.preventDefault();
});


function Login() {
    console.log('login');
    var user = document.getElementById("userInput").value;
    if (user == "" || user == null) {
        console.log("NoUser");
    } else {
        connection.invoke("Login", user).then(
            it => {
                connectionid = it;
                console.log("ConnectionID :", it)
            }).catch(function (err) {
                return console.error(err.toString());
            });
    }
}

function LogoutbyConnectionId() {
    var user = document.getElementById("userInput").value;
    connection.invoke("LogoutByUser", user, connectionid).catch(function (err) {
        return console.error(err.toString());
    });
}

function LogoutAllUser() {
    console.log("LogoutAllUser");
    var user = document.getElementById("userInput").value;
    console.log("LogoutAllUser", user);
    connection.invoke("LogoutAllUser", user).catch(function (err) {
        console.log("errLogoutAllUser")
        return console.error(err.toString());
    });
}

document.getElementById("SendToUser").addEventListener("click", function (event) {
    console.log("SendToUser");
    var usersend = document.getElementById("userInput").value;
    var userrecieve = document.getElementById("messageTouser").value;
    var message = document.getElementById("messageInput").value;
    console.log(usersend, userrecieve, message);
    connection.invoke("SendMessageToUser", usersend, userrecieve, message).then(it => {
        console.log("Success SendMessageToUser",it);
    }).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});



//Empleyee
document.getElementById("Empleyee").addEventListener("click", function (event) {
    var usersend = document.getElementById("userInput").value;
    var userrecieve = document.getElementById("messageTouser").value;
    var message = document.getElementById("messageInput").value;
    console.log(usersend, userrecieve, message);
    connection.invoke("AddEmployee", usersend, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("GetEmpleyee").addEventListener("click", function (event) {
    var name = document.getElementById("GetName").value;
    console.log(name);
    var li = document.createElement("h1");
    //UserOnline
    connection.invoke("GetEmployee", name).then(it => {
        li.textContent = it;
        console.log(it)
    }).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
    document.getElementById("UserOnline").appendChild(li);
});


document.getElementById("GetOnline").addEventListener("click", function (event) {
    //UserOnline
    connection.invoke("GetOnline").then(it => {
        console.log(it)
    }).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});



//document.getElementById("GetUserOnline").addEventListener("click", function (event) {
//    //connection.invoke("GetUserOnline").catch(function (err) {
//    //    return console.error(err.toString());
//    //});
//    //event.preventDefault(); 

//    //connection.invoke("GetUserOnlinexxx");
//    //var encodedMsg = connection.invoke("GetUserOnlinexxx").then(it => Alert(it));
//    //var li = document.createElement("li");
//    //li.textContent = encodedMsg;
//    //document.getElementById("UserOnline").appendChild(li);

//    //connection.invoke("GetUserOnline").then(it => {
//    //    it.forEach(it => {
//    //        var li = document.createElement("li");
//    //        li.textContent = it;

//    //        var x = document.getElementById("UserOnline").children.Array();
//    //        var isDuplicated = x.find(element => element == it);
//    //        console.log(isDuplicated);
//    //        if (isDuplicated == null) {
//    //            document.getElementById("UserOnline").appendChild(li);
//    //        }
//    //    })
//    //});
//});
