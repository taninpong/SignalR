//// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
//// for details on configuring this project to bundle and minify static web assets.

//// Write your Javascript code.

////var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
//console.log('startconnectionasdfasdf');
////Disable send button until connection is established
////document.getElementById("SendAll").disabled = true;

//document.getElementById("mybutton").addEventListener("click", function (ev) {
//    var fristname = document.getElementById("fristname").value;
//    var lastname = document.getElementById("lastname").value;
//    var email = document.getElementById("email").value;
//    var phonenumber = document.getElementById("phonenumber").value;
//    console.log(fristname, lastname, email, phonenumber);
//    //var message = document.getElementById("messageInput").value;
//    connection.invoke("AddEmployee", fristname, lastname, email, phonenumber).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});