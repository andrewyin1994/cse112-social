const postBtn = document.getElementById('postBtn');
const testInsert = document.getElementById('testInsert');
const uploadBtn = document.getElementById('uploadBtn');
const testBtn = document.getElementById('testBtn');
const editBtn = document.getElementById('editBtn');

const modalEl = document.createElement('div');
const DEBUG = true;

/**
 * Post class, what will be added to Firestore
 * @param {*} userRef ref to current logged in user
 * @param {*} postText text that user wishes to post
 */
class Post {
  constructor(userRef, postText) {
    this.post = {
      ownRef: userRef,
      ownerId: userRef.id,
      postText: postText,
      createDate: new Date().getTime(),
      favorRefs: [],
      imageUrl: "",
      editedFlag: false,
      updateTime: new Date().getTime()
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
  
  if (DEBUG) console.log(payload);

  firestore.collection('posts').add(payload.post);
};

/**
 * Delete post from Firestore
 * @param {*} userRef ref to the user currently logged in
 * @param {*} postId ref to post being deleted
 */
function deletePost(postId) {
  return new Promise((resolve,reject) => {
    let query = firestore.collection('posts').doc(postId);
    query.delete().then(
      () => { //success
      console.log('Post deleted!');
    },(e) => { //fail
      console.log('Error removing post: ', e);
    });
  });
}

/**
 * Edit post on firestore
 */
function editPost(postId, editText) {
  return new Promise((resolve,reject) => {
    let query = firestore.collection('posts').doc(postId);
    query.update({
      postText: editText,
      editedFlag: true,
      updateTime: new Date().getTime()
    }).then(
      () => { //success
      console.log('Post updated!');
      mui.overlay('off', modalEl);
    },(e) => { //fail
      console.log('Error updating post: ', e);
      // document.querySelector("#postUpdateStatus").innerHTML = ("abc");
    });
  });
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
            ...parsedData, //this is the old parsedData to append to
            {
              //this is what is appended on as next entry
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

function editTest(postIdV) {
  modalEl.style.width = '28em';
  modalEl.style.height = '28em';
  modalEl.style.margin = '100px auto';
  modalEl.style.backgroundColor = '#fff';
 
  let postIdVal = (postIdV != null) ? postIdV : "";
  console.log("postId: ", postIdV,"postIdVal: ", postIdVal)

  modalEl.innerHTML = `<div class='mui-container-fluid' style='padding-top: 3em;'>` + `<div class='mui-row'>` + `<div class='mui-col-md-8 mui-col-md-offset-2'>` +
    `<form class='mui-form'>
  <legend>Edit Post</legend>
  <div class='mui-textfield mui-textfield--float-label'>
    <input type='text' name='postIdVal' id='postIdVal' value=${postIdVal}>
    <label for='postIdVal'>postId</label>
  </div>

  <div class='mui-textfield mui-textfield--float-label'>
  <input type='text' name='editText' id='editText'>
  <label for='editText'>text</label>
  </div>

</form> 

<button type='submit' class='mui-btn mui-btn--raised' id='btnSignUp' onclick='editPost(document.getElementById("postIdVal").value, document.getElementById("editText").value)'>Submit</button>
<p id="postUpdateStatus"></p>
</div>
</div></div>`;

  // show modal
  mui.overlay('on', modalEl);
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
    return postB[Object.keys(postB)[0]].createDate - postA[Object.keys(postA)[0]].createDate;
  });
}

var u;

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
    deleteTest(userRef);
  });


  uploadBtn.addEventListener('click', function(){
    uploadFile();
  });

  editBtn.addEventListener('click', function(){
    editTest("0mkuqZklhSe9aXEPKsDi");
  });


  testBtn2.addEventListener('click', ()=>{
    showPostTest();
  });
}

//generates markup for post
function postMaker(prop){
  const currTime = (prop.editedFlag)?`${timeago().format(prop.updateTime)} (edited)`:`${timeago().format(prop.createDate)}`;
  console.log("prop_id:", prop.id);
  return `<div class="mui-row">
  <div class="mui-col-md-6 mui-col-md-offset-3 mui-panel">
  <p id="${prop.id}">${prop.postText}</p>
  <p style="text-align:right;font-size:75%">${currTime}</p>
  <button class="mui-btn mui-btn--accent" id="editBtn" onclick="editTest('${prop.id}')">Edit</button>
  </div>
</div>`;
}

//tests basic functionality for showing posts
function showPostTest(){
  let userRef = firestore.doc(`users/${firebase.auth().currentUser.uid}`);
  let followingRefs;
  userRef.get().then(snapshot => {
    if (DEBUG) console.log('snapshot followingRefs')
    followingRefs = snapshot.data().followingRefs;
    showPost(userRef, followingRefs);
  });
  
}

//if you have friends, this will add their posts in too (may need fixing)
function showPost(userRef, followingRefs){
  // if (DEBUG) console.log('uid', userRef.id);
  // if (DEBUG) console.log(followingRefs);
  let refListReq = (followingRefs != null && followingRefs.length > 0) ? getPostsFeedByUser(userRef, followingRefs)
                                              :getPostsByUserRef(userRef);
  refListReq.then(function(postList){
    let sortedFeed = orderPostFeedByDate(postList);
    console.log("sorted:", sortedFeed);
    console.log(postList);
    let postMarkup = "";
    postList.forEach(function(post){
      console.log(post[Object.keys(post)[0]].createDate);
      postMarkup += (postMaker(post[Object.keys(post)[0]]));
    });
    document.querySelector('#post-container').innerHTML = postMarkup;
  });
}

/**
 * A callback function that handles all data returned by firestore about
 * current user
 * @param {Reference} userRef reference to the current logged in user
 * @param {Array<Reference>} followingRefs list of refs to followings
 * @param {Array<Reference>} followerRefs list of refs to followers
 */
function initPage(userRef, followingRefs, followerRefs){

  if (DEBUG) console.log('uid', userRef.id);
  if (DEBUG) console.log(followingRefs);
  if (DEBUG) console.log(followerRefs);

  // getPostsFeedByUser(userRef,followingRefs)
  getPostsFeedByUser(userRef, followingRefs).then(postFeed=>{
    let sortedFeed = orderPostFeedByDate(postFeed);
    if (DEBUG) console.log(sortedFeed);
    sortedFeed.forEach(post => {
      if(DEBUG) console.log(post[Object.keys(post)[0]].createDate);
    });
  });
}

// Real time listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  let userRef, followingRefs, followerRefs;

  // checks if user exists
  if (firebaseUser) {

    // Firebase doesn't check userRef validity
    userRef = firestore.doc(`users/${firebaseUser.uid}`);
    // console.log('uid:', userRef.id);
    // Get data from this user
    userRef.get().then(snapshot=>{

      followingRefs = snapshot.data().followingRefs;
      followerRefs = snapshot.data().followerRefs;
      initPage(userRef,followingRefs,followerRefs);
    });

    showPostTest();
    // registerPageHandlers(userRef);

  } else {
    if (DEBUG) console.log('not logged in');
  }
});

function deleteTest(userRef) {
  console.log('begin test');

  let payload = new Post(userRef, 'test');
  console.log('deleteTest uid', userRef.id);
  console.log('payload', payload);

  firestore.collection('posts').doc('test').set(payload.post).then(() => {
      deletePost('test');
  });
}

