const testBtn = document.getElementById('postBtn');
const testInsert = document.getElementById('testInsert');
const uploadBtn = document.getElementById('uploadBtn');

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
      });
    });
}


/**
 * Get all posts by userRef and users that userRef is following
 * @param {*} userRef ref to current logged in user
 */
// function getPostsFeedByUser(userRef){
//   userRef.get()
//   firestore.collection('posts').where('ownRef','==', userRef)
//     .get().then(ref=>{
//       ref.forEach(postRef=>{
//         //TODO
//         console.log(postRef.id);
//       });
//     });
// }

/**
 * Get upload the current image in uploadControl and once uploaded, put it in uploadImg tag
 * 
 */
function uploadFile() {
  const ref = firebase.storage().ref();
  const file = document.querySelector('#uploadControl').files[0];
  const name = (+new Date()) + '-' + file.name;
  const metadata = {
    contentType: file.type
  };
  //task will be the Promise returned after trying to put the image onto firebase storage
  const task = ref.child(name).put(file, metadata);
  task.then((snapshot) => {
    const urlPromise = ref.child(name).getDownloadURL();
    console.log(snapshot, urlPromise);
    urlPromise.then(function(urlSnapshot){
      //urlSnapshot is the link to the content just added to storage
      console.log(urlSnapshot); 
      document.querySelector('#uploadImg').src = urlSnapshot;
    });;
  }).catch((error) => {
    console.error(error);
  });
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

    uploadBtn.addEventListener('click', function(){
      uploadFile();
    });


    console.log("userRef:", userRef);
    // getPostsByUser(userRef);
    // getUserFollowing(userRef);

  } else {
    console.log('not logged in');
  }
});

