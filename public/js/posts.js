const testBtn = document.getElementById('postBtn');
const testInsert = document.getElementById('testInsert');

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
  testInsert.innerHTML = JSON.stringify(addText);

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

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if (firebaseUser) {
    console.log(firebaseUser);
    testBtn.addEventListener('click', function () {
      writePost(firebaseUser);
   });
  } else {
    console.log('not logged in');
  }
});

