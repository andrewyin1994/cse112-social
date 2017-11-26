/*
Goal:
Add functionality for at least 5 features:
1) login
2) logout
3) scheduling
4) roster
5) statistics

useful:
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
use localStorage, which is a built-in object in the browser/webAPI/ that allows you to store key value pairs,
use it to store arrays of objects or whatever kind of data you need
(key k: value v, v can be any kind of thing, even an array[]) 
sessionStorage is stored until the browser session ends
*/

function clearStorage() {
    window.localStorage.clear();
    return true;
}

function test() {
    //show current localStorage
    console.log(window.localStorage);
    
    //example in appending
    var tmp = {'usr': 'pwd'};
    console.log(tmp);
    tmp['dog']='cat';
    console.log(tmp);
    
    
    window.localStorage['login'] = JSON.stringify(tmp);
    console.log(window.localStorage['login']);
    var out = JSON.parse(window.localStorage['login']);
    console.log(tmp);
}

function test2() {
    //grab the current username and password
    usr = document.loginForm.user.value;
    pwd = document.loginForm.password.value;
    if(test=='usr') {
        window.location.href = "team.html";
        return true;
    }
    else {
        console.log("wrong");
        //alert("wrong");
        return false;
    }
   
}

function verify() {
    
}

function logIn(/*usr, pwd*/) {
    /* TODO */

    return false;
}

function logOut() {
    /* TODO */
    return false;
}

function handleSchedule() {
    /* TODO */
    return false;
}

function createRoster() {
    /* TODO */
    return false;
}

function appendRoster() {
    /* TODO */
    return false;
}

function handleStatistics(){
    /* TODO */
    return false;
}