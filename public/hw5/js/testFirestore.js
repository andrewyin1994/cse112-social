// initialize Firebase
var config = {
    apiKey: "AIzaSyD2KbGQQLhhapSRQCa9y3cden7rmSL28tM",
    authDomain: "cse134gahuyi.firebaseapp.com",
    databaseURL: "https://cse134gahuyi.firebaseio.com",
    projectId: "cse134gahuyi",
    storageBucket: "cse134gahuyi.appspot.com",
    messagingSenderId: "741715887321"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();

const docRef = firestore.doc("samples/testData");

// create query selectors first for ids
const outputHeader = document.querySelector("#testingOutput");
const inputTextField = document.querySelector("#latestTestStatus");
const saveButton = document.querySelector("#saveButton");
const loadButton = document.querySelector("#loadButton");

saveButton.addEventListener("click", function() {
    const textToSave = inputTextField.value;
    console.log("Saving " + textToSave + " to Firestore");
    docRef.set({
        testStatus: textToSave
    }).then(function() {
        console.log("Save works! Success!");
    }).catch(function(error){
        console.log("Shit is not working: ", error);
    });
});

loadButton.addEventListener("click", function(){
    docRef.get().then(function (doc){
        if(doc && doc.exists){
        const myData = doc.data();
        outputHeader.innerText = "Test status: " + myData.testStatus;
        }
    }).catch(function(error){
        console.log("Got an error: ", error);
    });
});

getRealTimeUpdates = function() {
    docRef.onSnapshot(function (doc){
        if(doc && doc.exists){
            const myData = doc.data();
            outputHeader.innerText = "Test status: " + myData.testStatus;
        }
    })
}

getRealTimeUpdates();