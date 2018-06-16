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
      updateTime: new Date().getTime(),
      likedCnt:0,
      name:""
    }
  }
}

/**
 * Add post to firestore
 * @param {*} userRef ref to current logged in user
 */
function addPost(userRef) {
  console.log('user', userRef, userRef.name);

  const postText = document.getElementById('postText').value;
    
  let payload = new Post(userRef, postText);
  
  const currImg = document.querySelector('#uploadImg').dataset.imgref;

  if(currImg != "") payload.post.imageUrl = currImg;

  if (DEBUG) console.log("payload:", payload);
  firestore.doc(`users/${firebase.auth().currentUser.uid}`).get().then(e=>{
     payload.post.name = e.data().name;
     firestore.collection('posts').add(payload.post).then(() => {
      mui.overlay('off', modalEl);
      showPostTest();
    });
  });
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
      if(DEBUG) console.log('Post deleted!');
    },(e) => { //fail
      if(DEBUG) console.log('Error removing post: ', e);
    });
  });
}

/**
 * Edit post on firestore
 * @param {*} postId ref to post being edited
 * @param {*} editText ref to text you want to edit with
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
      showPostTest();
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


/**
 * create/Shows editing modal
 * @param {*} postIdv postid value
 */
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

/**
 * Orders post feed by post date (most recent first)
 * @param {} postFeed the list of posts to sort by date
 * @returns {*} newly sorted postFeed
 */
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
function uploadFile(userRef) {
  const ref = firebase.storage().ref();
  const file = document.querySelector('#uploadControl').files[0];
  // we do +new Date() to force the time to be epoch time instead of standard day-month-year etc
  const name = userRef.id + '/' + (+new Date()) + '-' + file.name;
  console.log(name);
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
      document.querySelector('#uploadImg').dataset.imgref = name;
      //query.doc(`posts/${userRef.id}`).update({imageUrl:`${name}`});
    });
  }).catch((error) => {
    if (DEBUG) console.error(error);
  });
}

/**
 * Holds the event listeners/handlers for the page
 * @param {*} userRef the reference to the user
 */
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
    uploadFile(userRef);
  });

  editBtn.addEventListener('click', function(){
    editTest("0mkuqZklhSe9aXEPKsDi");
  });


  testBtn2.addEventListener('click', ()=>{
    showPostTest();
  });
}

/**
 * Makes the homepage post html
 * @param {*} prop emulates react obj that renders a stream   
 * @return {*} the post html
 */
function postMaker(prop){
  const currTime = (prop.editedFlag)?`${timeago().format(prop.updateTime)} (edited)`:`${timeago().format(prop.createDate)}`;
  console.log("prop_id:", prop);
  return `<div class="mui-row">
  <div class="mui-col-md-6 mui-col-md-offset-3 mui-col-xs-7 mui-col-xs-offset-3 mui-panel">
    <div>
      <img id="default" src="images/default-pic.png" width="35" height="35" style="float: left">
      <button id="trashcanBtn" style="float: right" style="border-radius: 50%">
        <img id="trashcan" src="images/trashcan.png" width="40" height="40">
      </button>
      <p class = "mui-col-md-offset-1">${prop.name}</p>
      <p class = "mui-col-md-offset-1" style="font-size:75%">${currTime}</p>
      <br>
    </div>
  <p id="${prop.id}">${prop.postText}</p>
  <br>
  <button class="mui-btn mui-btn--raised mui-btn--primary" id="editBtn" onclick="editTest('${prop.id}')">Edit</button>
  <button class="mui-btn mui-btn--raised mui-btn--primary" id="likeBtn-${prop.id}">Like</button>
  <button class="mui-btn mui-btn--raised mui-btn--primary" id="showBtn-${prop.id}">${prop.likedCnt}</button>

  </div>
</div>`;
}

/**
 * tests basic functionality for showing posts
 */
function showPostTest(){
  let userRef = firestore.doc(`users/${firebase.auth().currentUser.uid}`);
  let followingRefs;
  userRef.get().then(snapshot => {
    if (DEBUG) console.log('snapshot followingRefs')
    followingRefs = snapshot.data().followingRefs;
    showPost(userRef, followingRefs);
  });
}

/**
 * If you have friends, this will add their posts in too 
 * @param {*} userRef ref to user
 * @param {*} followingRefs list of refs of friends you are following
 */
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
      const currPost = post[Object.keys(post)[0]];
      postMarkup += (postMaker(currPost));
      // document.querySelector(`#likeBtn-${currPost.id}`).addEventListener('click', likePost(currPost));
    });
    document.querySelector('#post-container').innerHTML = postMarkup;

    postList.forEach(function(post){
      console.log(post[Object.keys(post)[0]].createDate);
      const currPost = post[Object.keys(post)[0]];
      let likeBtn = document.querySelector(`#likeBtn-${currPost.id}`);
      let likedFlag = false;
      firestore.doc(`posts/${currPost.id}`).collection('likedBy').get().then((snapshot)=>{
        snapshot.forEach(e=>{
          if(e.id == userRef.id) likedFlag = true;
        });
      });
      if(likedFlag)
        likeBtn.onclick = (e)=>{likePost(currPost, userRef);};
      else
        likeBtn.onclick = (e)=>{unlikePost(currPost, userRef);};
    });
  });
}

function updateField(fbRef, field, newVal){
  firestore.doc(fbRef).update({[field]: newVal});
}

function likePost(currPost, userRef){  
  if (DEBUG) console.log("currPost: ", currPost);
  const query = firestore.doc(`posts/${currPost.id}`).collection('likedBy');
  query.doc(userRef.id).set({liked: true}).then((snapshot) => {
      query.get().then(subSnap=>{
        if(DEBUG) console.log(subSnap.size);
        document.getElementById(`showBtn-${currPost.id}`).innerHTML = subSnap.size;

        updateField(`posts/${currPost.id}`, 'likedCnt', subSnap.size);
      });
  });
  document.querySelector(`#likeBtn-${currPost.id}`).onclick = (e)=>{
    likePost(currPost, userRef);
  };
  document.querySelector(`#likeBtn-${currPost.id}`).onclick =  (e)=>{
    unlikePost(currPost, userRef);
  };
}

function unlikePost(currPost, userRef){  
  if (DEBUG) console.log("currPost: ", currPost);
  const query = firestore.doc(`posts/${currPost.id}`).collection('likedBy');
  query.doc(userRef.id).delete().then((snapshot) => {
      query.get().then(subSnap=>{
        if(DEBUG) console.log(subSnap.size);
        document.getElementById(`showBtn-${currPost.id}`).innerHTML = subSnap.size;

        updateField(`posts/${currPost.id}`, 'likedCnt', subSnap.size);
      });
  });
  document.querySelector(`#likeBtn-${currPost.id}`).onclick = (e)=>{
    unlikePost(currPost, userRef);
  };
  document.querySelector(`#likeBtn-${currPost.id}`).onclick = (e)=>{
    likePost(currPost, userRef);
  };;
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
    //registerPageHandlers(userRef);

  } else {
    if (DEBUG) console.log('not logged in');
  }
});

/**
 * tests firebase post deletion
 * @param userRef ref to user
 */
function deleteTest(userRef) {
  console.log('begin test');

  let payload = new Post(userRef, 'test');
  console.log('deleteTest uid', userRef.id);
  console.log('payload', payload);

  firestore.collection('posts').doc('test').set(payload.post).then(() => {
      deletePost('test');
  });
}