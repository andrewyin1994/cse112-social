const postBtn = document.getElementById('postBtn');
const testInsert = document.getElementById('testInsert');
const uploadBtn = document.getElementById('uploadBtn');
const testBtn = document.getElementById('testBtn');

const DEBUG = true;

class Post {
  constructor(userRef, postText) {
    this.post = {
      ownRef: userRef,
      ownerId: userRef.id,
      postText: postText,
      createDate: new Date().getTime(),
      favorRefs: [],
      imageUrl: [],
<<<<<<< HEAD
      ownerId: userRef.id
=======
>>>>>>> 8316ab6d52b3a0c4288bb5113b7626e61905b56a
    }
  }
}

/**
 * Add post to firestore
 * @param {*} userRef ref to current logged in user
 */
function addPost(userRef) {
  const postText = document.getElementById('postText').value;
    
  let payload = new Post(userRef, postText);
  
  // let payload = {
  //   ownRef: userRef,
  //   text: postText,
  //   createDate: new Date().getTime(),
  //   favorRefs:[],
  //   imageUrl:''
  // };
  
  if (DEBUG) console.log(payload);

  firestore.collection('posts').add(payload.post);
};

/**
 * Delete post from firestore
 * @param {*} userRef ref to the user currently logged in
 * @param {*} postId ref to post being deleted
 */
function deletePost(postId) {
  return new Promise((resolve,reject) => {
    let query = firestore.collection('posts').doc(postId);
    query.delete().then(() => {
      console.log('Post deleted!');
    },
    (e) => {
      console.log('Error removing post: ', e);
    });
  });
}

/**
 * Edit post on firestore
 */
function editPost(postId) {
  
}

/**
 * Get all posts created by a user
 * @param {*} userRef ref to current logged in user
 * @returns {Promise} resolve([{[postResult.id]: {id: postResult.id,...postContent}])
 */
function getPostsByUserRef(userRef){
  return new Promise((resolve,reject)=>{
    let parsedData = [];
    let query = firestore.collection('posts').where('ownRef','==', userRef);
    query.orderBy('createDate');
    query.get().then(postsRefs=>{
        postsRefs.forEach(postResult=>{
          postContent=postResult.data();

          // append newly parsed data to currently parsed data array
          parsedData = [
            ...parsedData,
            {
              [postResult.id]: {
                id: postResult.id,
                ...postContent
              }
            }
          ];
        });
        resolve(parsedData);
      });
  });
}

/**
 * Get all posts by userRef and users that userRef is following
 * @param {Reference} userRef ref to current logged in user
 * @param {Array<Reference>} followingRefs list of refs to followings
 * @returns {Promise} promise.then(postsContents=>{...})
 */
function getPostsFeedByUser(userRef, followingRefs){

  return new Promise((resolve,reject)=>{
    let counter = 0; // Keep track of # of request promises being solved
    let postFeedList = [];

    followingRefs.forEach((friendRef)=>{
      counter++;
      getPostsByUserRef(friendRef).then(posts=>{

      if (DEBUG) console.log('posts', posts);

        // Update postFeedList
        postFeedList = [
          ...postFeedList,
          ...posts
        ]

        // 
        if (counter === followingRefs.length){
          getPostsByUserRef(userRef).then(selfPosts=>{

            postFeedList = [
              ...postFeedList,
              ...selfPosts
            ]

            resolve(postFeedList)
          });
        }
      });
    });
  });
}

function orderPostFeedByDate(postFeed){
  return postFeed.sort((postA,postB)=>{
    return postA[Object.keys(postA)[0]].createDate - postB[Object.keys(postB)[0]].createDate;
  });
}

/**
 * Get upload the current image in uploadControl and once uploaded, put it in uploadImg tag
 * 
 */
function uploadFile() {
  const ref = firebase.storage().ref();
  const file = document.querySelector('#uploadControl').files[0];
  // we do +new Date() to force the time to be epoch time instead of standard day-month-year etc
  const name = (+new Date()) + '-' + file.name;
  const metadata = {
    contentType: file.type
  };
  //task will be the Promise returned after trying to put the image onto firebase storage
  const task = ref.child(name).put(file, metadata);
  task.then((snapshot) => {
    const urlPromise = ref.child(name).getDownloadURL();
    if (DEBUG) console.log(snapshot, urlPromise);
    urlPromise.then(function(urlSnapshot){
      //urlSnapshot is the link to the content just added to storage
      if (DEBUG) console.log(urlSnapshot); 
      document.querySelector('#uploadImg').src = urlSnapshot;
    });;
  }).catch((error) => {
    if (DEBUG) console.error(error);
  });
}

function registerPageHandlers(userRef) {
  console.log('register page handler');
  // Register listener for add post button
  postBtn.addEventListener('click', function () {
    addPost(userRef);
  });

  testBtn.addEventListener('click', function() {
    deleteTest('test');
  });

  uploadBtn.addEventListener('click', function(){
    uploadFile();
  });
}

/**
 * A callback function that handles all data returned by firestore about
 * current user
 * @param {Reference} userRef reference to the current logged in user
 * @param {Array<Reference>} followingRefs list of refs to followings
 * @param {Array<Reference>} followingRefs list of refs to followers
 */
function handleUserData(userRef, followingRefs, followerRefs){

  if (DEBUG) console.log('uid', userRef);
  if (DEBUG) console.log(followingRefs);
  if (DEBUG) console.log(followerRefs);

  // getPostsFeedByUser(userRef,followingRefs)
  getPostsFeedByUser(userRef, followingRefs).then(postFeed=>{
    let sortedFeed = orderPostFeedByDate(postFeed)
    if (DEBUG) console.log(sortedFeed)
    sortedFeed.forEach(post => {
      if(DEBUG) console.log(post[Object.keys(post)[0]].createDate)
    })
  })
}

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  var userRef, followingRefs, followerRefs;

  // checks if user exists
  if (firebaseUser) {

    // Firebase doesn't check userRef validity
    userRef = firestore.doc(`users/${firebaseUser.uid}`);
    // console.log('uid:', userRef.id);
    // Get data from this user
    userRef.get().then(snapshot=>{

      followingRefs = snapshot.data().followingRefs;
      followerRefs = snapshot.data().followerRefs;
      handleUserData(userRef,followingRefs,followerRefs);
    });

    registerPageHandlers(userRef);

  } else {
    if (DEBUG) console.log('not logged in');
  }
});

function deleteTest(userRef) {
  console.log('begin test');

  let payload = new Post(userRef, 'test');
  
  console.log('payload', payload);

  // let payload = {
  //   ownRef: userRef,
  //   text: 'test',
  //   createDate: new Date().getTime(),
  //   favorRefs:[],
  //   imageUrl:''
  // };

  firestore.collection('posts').doc('test').set(payload.post).then(() => {
      deletePost(userRef,'test').then(() => {}
    );
  });
}

