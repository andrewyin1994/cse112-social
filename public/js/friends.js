const testBtn = document.getElementById('testBtn');
const testInsert = document.getElementById('testInsert');

const DEBUG = true;

/**
 *
 * @param {*} selfQRef reference to self
 * @param {*} flwingQRefs newFollowingQRef will be added to it inplace 
 * @param {*} newFollowingQRef assumed to not exist in flwingQRefs
 * @returns {Promise} resolve()
 */
function addFriendByRefToFB(selfQRef, flwingQRefs, newFollowingQRef) {
  flwingQRefs.push(newFollowingQRef) // ***** array is modified inplace, change will persist
  return selfQRef.update({followingRefs: flwingQRefs});
}

/**
 *
 * @param {*} selfRef
 * @param {*} followingRefs qref === newFollowingId 
 * @param {*} newFollowingId existence will be checked
 */
function addFriendById(selfRef, followingRefs, newFollowingId) {
  let query = firestore.doc(`users/${newFollowingId}`);
  return new Promise((res, rej) => {
    query
      .get()
      .then(targetSRef => {
        if (targetSRef.exists && !isIdAlreadyFriend(followingRefs, newFollowingId)) {
          addFriendByRefToFB(selfRef, followingRefs, query).then((d) => {
            res(followingRefs)
          });
        } else 
          res(false)
      });
  });
}

/**
 * Check if the id is already in the following list before adding to firestore
 * @param {*} followingRefs
 * @param {*} newFollowingId
 */
function isIdAlreadyFriend(followingRefs, newFollowingId) {
  let exists = false;
  followingRefs.forEach(qRef => {
    if (qRef.id === newFollowingId) 
      exists = true;
    }
  )
  return exists;
}

/**
 *
 * @param {*} selfQRef query reference to self
 * @param {*} flwingQRefs newFollowingQRef[delIdx] will be deleted inplace 
 * @param {*} delIdx < flwingQRefs.length
 */
function deleteFriendByIdxFromFB(selfQRef, flwingQRefs, delIdx) {
  flwingQRefs.splice(delIdx, 1); // ***** array is modified inplace, change will persist
  return selfQRef.update({followingRefs: flwingQRefs});
}

/**
 *
 * @param {*} selfRef
 * @param {*} followingRefs contains exactly one element: el.id === newFollowingId
 * @param {*} newFollowingId existence will be checked
 */
function deleteFriendById(selfRef, followingRefs, newFollowingId) {
  return new Promise((res,rej)=>{
    let delIdx = -1
    for (let i = 0; i<followingRefs.length;i++){
      if(followingRefs[i].id===newFollowingId){
        delIdx = followingRefs[i].id
      }
    }

    // Only deleted when found
    if (delIdx != -1) deleteFriendByIdxFromFB(selfRef,followingRefs,delIdx).then((d) => {
      res(followingRefs)
    })
    else res(false);
  })
}

/**
 * Get a user data by his reference
 * @param {*} followingRefs
 * @returns {Promise}
 */
function getUserDataByRef(followingRefs) {
  return new Promise((resolve, reject) => {

    userRef
      .get()
      .then(snapshot => {

        followingRefs = snapshot
          .data()
          .followingRefs;
        followerRefs = snapshot
          .data()
          .followerRefs;
        handleUserData(userRef, followingRefs, followerRefs);
      })
  })
}

/**
 * Grab user data in a structured way
 * @param {*} followingRefs
 */
function getFriendsDataByRefs(followingRefs) {
  return new Promise((resolve, reject) => {
    let userDataList = []
    let counter = 0
    followingRefs.forEach(follwing => {
      console.log(following.data())
    })
  })
}

function grabFriends(followingRefs) {
  const d = firestore.doc(`users/${firebase.auth().currentUser.uid}`);
  const dR = firestore.doc(`users/e4L1ADzjqzQsc1DThDHZdTKbVuU2`);
  testBtn.addEventListener('click', function () {
    dR
      .get()
      .then(function (doc) {
        console.log(doc.exists);
        if (doc && doc.exists) {
          console.log("doc data if it exists: ");
          console.log(doc.data());
        }
      })
      .catch(function (err) {
        console.log("Error: ", err);
      });
    console.log("getting users");
    let testMsg = "";
    firestore
      .collection("users")
      .get()
      .then(function (querySnapshot) {
        querySnapshot
          .forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            testMsg += `<br>uid: ${doc.id} => <br>`;
            console.log(doc.id, " => ", doc.data());
            let data = doc.data();
            Object
              .keys(data)
              .forEach(dKey => {
                console.log(dKey, ": ", data[dKey]);
                testMsg += `<br>${dKey}: ${data[dKey].length == 0
                  ? "null"
                  : data[dKey]}`;
              });
          });
        testInsert.innerHTML = testMsg;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  });
}

function handleUserData(userRef, followingRefs, followerRefs) {
  // getFriendsDataByRefs(userRef).then(() => {},()=>{})
  deleteFriendById(userRef, followingRefs, "7oZiWgeMNnTmw0B5moy5nA9pApl2").then((e) => {})
}

function registerPageHandlers() {}

function registerFriendsHandlers() {}

// Real time listener
firebase
  .auth()
  .onAuthStateChanged(firebaseUser => {
    var userRef,
      followingRefs,
      followerRefs;

    // checks if user exists
    if (firebaseUser) {

      // Firebase doesn't check userRef validity
      userRef = firestore.doc(`users/${firebaseUser.uid}`);
      // Get data from this user
      userRef
        .get()
        .then(snapshot => {

          followingRefs = snapshot
            .data()
            .followingRefs;
          followerRefs = snapshot
            .data()
            .followerRefs;
          handleUserData(userRef, followingRefs, followerRefs);
        });

      registerPageHandlers(userRef);

    } else {
      if (DEBUG) 
        console.log('not logged in');
      }
    });