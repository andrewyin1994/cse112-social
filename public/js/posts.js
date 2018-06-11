const testBtn = document.getElementById('postBtn');
const testInsert = document.getElementById('testInsert');

function sendPost(firebaseUser) {
  const cR = firestore.collection(`users/`)
  testBtn.addEventListener('click', function () {
    cR.get().then(function (doc) {
      console.log(doc.exists);
      if (doc && doc.exists) {
        console.log(doc.data());
      }
    })
      .catch(function (err) {
        console.log("Error: ", err);
      });
    console.log("done");
    const postText = document.getElementById("postText").value;
    let addText = {
      id: firebaseUser.uid,
      text: postText,
      tdee: 0,
      time: new Date().getTime(),
      email: firebaseUser.email
    }
    testInsert.innerHTML = JSON.stringify(addText);
  });
}

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if (firebaseUser) {
    console.log(firebaseUser);
    // sendPost(firebaseUser);
    writePost(firebaseUser);
  } else {
    console.log('not logged in');
  }
});

function writePost(firebaseUser) {
  const postText = document.getElementById("postText").value;
  let addText = {
    id: firebaseUser.uid,
    text: postText,
    tdee: 0,
    time: new Date().getTime(),
    email: firebaseUser.email
  }
  console.log(addText);
  
  firestore.collection('posts').add(
    {
      id: firebaseUser.uid,
      text: postText,
      tdee: 0,
      time: new Date().getTime(),
      email: firebaseUser.email
    }
  );
};