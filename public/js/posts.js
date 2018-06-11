const testBtn = document.getElementById('postBtn');
const testInsert = document.getElementById('testInsert');

const DEBUG = false;

/**
 * Add post to firestore
 * @param {*} userRef ref to current logged in user
 */
function addPost(userRef) {
  const postText = document.getElementById("postText").value;
  let payload = {
    ownRef: userRef,
    text: postText,
    createDate: new Date().getTime(),
    favorRefs:[],
    imageUrl:""
  };
  
  if (DEBUG) console.log(payload);

  firestore.collection('posts').add(payload);
};

/**
 * Get all posts created by a user
 * @param {*} userRef ref to current logged in user
 */
function getPostsByUser(userRef){
  firestore.collection('posts').where('ownRef','==', userRef)
    .get().then(ref=>{
      ref.forEach(postRef=>{
        //TODO
        console.log(postRef.id);
      })
    })
}

/**
 * Get all users that userRef is following
 * @param {*} userRef ref to current logged in user
 */
function getUserFollowing(userRef){
  userRef.get('followingUsers').then(ref=>{
    ref.forEach(friendRef=>{
      console.log(friendRef.id)
    })
  })
}

/**
 * Get all posts by userRef and userRef's following
 * @param {*} userRef ref to current logged in user
 */
function getPostsFeedByUser(userRef){
  userRef.get()
  firestore.collection('posts').where('ownRef','==', userRef)
    .get().then(ref=>{
      ref.forEach(postRef=>{
        //TODO
        console.log(postRef.id);
      })
    })
}

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  // checks if user exists
  if (firebaseUser) {
    console.log(firebaseUser);
    // Firebase doesn't check userRef validity
    userRef = firestore.doc(`users/${firebaseUser.uid}`);

    // Register listener for add post button
    testBtn.addEventListener('click', function () {
      addPost(userRef);
    });

    // getPostsByUser(userRef);
    getUserFollowing(userRef);

  } else {
    console.log('not logged in');
  }
});

