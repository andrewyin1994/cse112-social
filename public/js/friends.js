const testBtn = document.getElementById('testBtn');
const testInsert = document.getElementById('testInsert');

const DEBUG = true;
const FOLLOWER_COUNT = 'followerCount'
/**---------------------------------------------------------------------------------- */
/* When adding/delete following, firestore should automatically add/del 
the followee's followerRefs array and followerCount field */

/**
 * When follower adds/dels his own following, firestore should automatically 
 * add/del the followee's followerRefs array and followerCount field
 * @param {*} selfQRef reference to self
 * @param {*} flwingQRefs newFollowingQRef will be added to it inplace 
 * @param {*} newFollowingQRef assumed to not exist in flwingQRefs
 * @returns {Promise} resolve()
 */
function addFollowingByRefToFB(selfQRef, flwingQRefs, newFollowingQRef) {
  flwingQRefs.push(newFollowingQRef) // ***** array is modified inplace, change will persist
  return selfQRef.update({followingRefs: flwingQRefs});
}

/**
 *
 * @param {*} selfRef
 * @param {*} followingRefs qref === newFollowingId 
 * @param {*} newFollowingId existence in fb will be checked
 */
function addFollowingById(selfRef, followingRefs, newFollowingId) {
  let query = firestore.doc(`users/${newFollowingId}`);
  return new Promise((res, rej) => {
    query
      .get()
      .then(targetSRef => {
        if (targetSRef.exists && !refsHasId(followingRefs, newFollowingId)) {
          addFollowingByRefToFB(selfRef, followingRefs, query).then((d) => {
            res(followingRefs)
          });
        } else 
          res(false)
      });
  });
}

/**
 * Check if the id is already in the ref list before adding to firestore
 * @param {*} followingRefs
 * @param {*} newFollowingId
 */
function refsHasId(followingRefs, newFollowingId) {
  // let exists = false;
  // followingRefs.forEach(qRef => {
  //   if (qRef.id === newFollowingId) 
  //     exists = true;
  //   }
  // )
  // return exists;
  return followingRefs.some(((qRef)=>{ return qRef.id === newFollowingId }))
}

/**
 *
 * @param {*} selfQRef query reference to self
 * @param {*} flwingQRefs newFollowingQRef[delIdx] will be deleted inplace 
 * @param {*} delIdx < flwingQRefs.length
 */
function delFollowingByIdxFromFB(selfQRef, flwingQRefs, delIdx) {
  flwingQRefs.splice(delIdx, 1); // ***** array is modified inplace, change will persist
  return selfQRef.update({followingRefs: flwingQRefs});
}

/**
 *
 * @param {*} selfRef
 * @param {*} followingRefs contains exactly one element: el.id === newFollowingId
 * @param {*} targetFollowingId existence in fb will be checked
 */
function delFollowingById(selfRef, followingRefs, targetFollowingId) {
  return new Promise((res,rej)=>{
    let delIdx = -1
    for (let i = 0; i<followingRefs.length;i++){
      if(followingRefs[i].id===targetFollowingId){
        delIdx = followingRefs[i].id
      }
    }

    // Only deleted when found
    if (delIdx !== -1) delFollowingByIdxFromFB(selfRef,followingRefs,delIdx).then((d) => {
      res(followingRefs)
    })
    else res(false);
  })
}

/**---------------------------------------------------------------------------------- */
/* You can't add followers, but you could remove them 
 * When you delete follower, firestore should automatically decrement your 
 * followerCount and remove you from follower's followingRefs list */

/**
 * You can't add followers, but you could remove them 
 * When you delete follower, firestore should automatically decrement your 
 * followerCount and remove you from follower's followingRefs list 
 * @param {*} selfQRef query reference to self
 * @param {*} flwerQRefs newFollowingQRef[delIdx] will be deleted inplace 
 * @param {*} delIdx < flwingQRefs.length
 */
function delFollowerByIdxFromFB(selfQRef, flwerQRefs, delIdx) {
  flwerQRefs.splice(delIdx, 1); // ***** array is modified inplace, change will persist
  return selfQRef.update({followerRefs: flwerQRefs});
}

/**
 *
 * @param {*} selfRef
 * @param {*} followerRefs contains exactly one element: el.id === newFollowingId
 * @param {*} targetFollowerId existence in fb will be checked
 */
function delFollowerById(selfRef, followerRefs, targetFollowerId) {
  return new Promise((res,rej)=>{
    let delIdx = -1
    for (let i = 0; i<followerRefs.length;i++){
      if(followerRefs[i].id===targetFollowerId){
        delIdx = followerRefs[i].id
      }
    }

    // Only deleted when found
    if (delIdx !== -1) delFollowerByIdxFromFB(selfRef,followerRefs,delIdx).then((d) => {
      res(followerRefs)
    })
    else res(false);
  }) // end promise()
}

/**---------------------------------------------------------------------------------- */
/**
 * Used locally for display purpose
 */
class UserInfo {
  /**
   * @param {*} userSnapshot snapshot reference returned by firestore after
   * calling QueryReference.get()
   */
  constructor(userSnapshot) {
    // this.username:snapshot.data().username,
    this.uid = userSnapshot.id;
    // this.avatarUrl:snapshot.avatarUrl
  }
}

/**
 * Get a user data by his reference
 * @param {*} qref the query reference to the user whose is assumed to exist in fb
 * @returns {Promise}
 */
function getUserInfoByRef(qref) {
  return new Promise((resolve, reject) => {
    qref.get().then(snapshot => {

        if(snapshot.exists) {
          resolve(new UserInfo(snapshot))
        } else {
          resolve(false)
        }
      })
  })
}

/**
 * Get a user data by his uid
 * @param {*} uid the uid whose info we want to get
 * @returns {Promise}
 */
function getUserInfoById(fs,uid) {
  return getUserInfoByRef(fs.doc(`users/${uid}`))
}

/**
 * Grab user data in a structured way
 * @param {*} userRefs
 * @return {Promise}
 */
function getUsersInfoByRefs(userRefs) {
  return new Promise((resolve, reject) => {
    let userInfoList = []
    let counter = 0
    userRefs.forEach(userRef => {
      getUserInfoByRef(userRef).then((info)=>{
        if(userRef){
          if(DEBUG) console.log(info)
          counter++;
          userInfoList = [
            ...userInfoList,
            info
          ]

          if(counter === userRefs.length){
            resolve(userInfoList)
          }
        } // endif
      }) // end then()
    }) // end foreach
  }) // end Promise()
}

/**
 * Return recommended user list, excluding self and followings
 * @param {Object} fs firestore object
 * @param {Reference} selfRef query reference to self
 * @param {Reference} followingRefs list of query reference to followings
 */
function getRcmdUsersInfo(fs, selfRef, followingRefs){
  return new Promise((resolve,reject)=>{
    let query = fs.collection('users')
      .where(FOLLOWER_COUNT,'>', 1);
    let infoList = []
    query.get().then(snapshots=>{
      snapshots.forEach(snapshot=>{
        // exclude already-following users from rcmd list
        if(!refsHasId(followingRefs, snapshot.id) && 
          selfRef.id !== snapshot.id){
          infoList = [
            ...infoList,
            new UserInfo(snapshot)
          ]
        } // endif
      }) // end foreach
      resolve(infoList)
    }) // end then()
  }) // end Promise()
}

function handleUserData(userRef, followingRefs, followerRefs) {
  // addFollowingById(userRef, followingRefs, "7oZiWgeMNnTmw0B5moy5nA9pApl2").then((e) => {})
  // addFollowingById(userRef, followingRefs, "CYjKvtzX7GOtBedx8MVB665lOnm1").then((e) => {})
  // delFollowingById(userRef, followingRefs, "7oZiWgeMNnTmw0B5moy5nA9pApl2").then((e) => {})
  getRcmdUsersInfo(firestore, userRef, followingRefs).then(rcmdList=>{
    if(DEBUG) console.log(rcmdList)
  })
  // getUserInfoByRef(userRef).then((userInfo)=>{
  //   if(DEBUG) console.log(userInfo)
  // })
  // getUsersInfoByRefs(followingRefs).then((userInfoList)=>{
  //   if(DEBUG) console.log(userInfoList)
  // })
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