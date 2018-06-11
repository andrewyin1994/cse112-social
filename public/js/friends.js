
const testBtn = document.getElementById('testBtn');
const testInsert = document.getElementById('testInsert');

function grabFriends() {
  const d = firestore.doc(`users/${firebase.auth().currentUser.uid}`)
  const dR = firestore.doc(`users/e4L1ADzjqzQsc1DThDHZdTKbVuU2`)
  testBtn.addEventListener('click', function () {
    dR.get().then(function (doc) {
      console.log(doc.exists)
      if (doc && doc.exists) {
        console.log("doc data if it exists: ")
        console.log(doc.data());
      }
    })
      .catch(function (err) {
        console.log("Error: ", err);
      });
    console.log("getting users");
    let testMsg = "";
    firestore.collection("users").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        testMsg += `<br>uid: ${doc.id} => <br>`;
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        Object.keys(data).forEach(dKey => {
          console.log(dKey, ": ", data[dKey]);
          testMsg += `<br>${dKey}: ${data[dKey].length == 0 ? "null" : data[dKey]}`;
        });
      });
      testInsert.innerHTML = testMsg;
    }).catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  });
}


// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if (firebaseUser) {
    console.log(firebaseUser);
    grabFriends();
  } else {
    console.log('not logged in');
  }
});

