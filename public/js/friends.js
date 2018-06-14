const testBtn = document.getElementById('testBtn');
const testInsert = document.getElementById('testInsert');

const FOLLOWER_COUNT = 'followerCount'
const DEBUG = true


const findCtnr = document.querySelector('#rcmd-container')
const flwingCtnr = document.querySelector('#flwing-container')
const flwerCtnr = document.querySelector('#flwer-container')

/**-------------------------- following api -------------------------------- */
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
  return selfQRef.update({ followingRefs: flwingQRefs });
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
            res(new UserInfo(targetSRef))
          });
        } else
          res(false)
      });
  });
}

/**
* Tool function to check if the id exists in the ref list
* @param {Array<Reference>} followingRefs
* @param {String} newFollowingId
*/
function refsHasId(followingRefs, newFollowingId) {
  // let exists = false; followingRefs.forEach(qRef => {   if (qRef.id ===
  // newFollowingId)     exists = true;   } ) return exists;
  return followingRefs.some(((qRef) => {
    return qRef.id === newFollowingId
  }))
}

/**
*
* @param {*} selfQRef query reference to self
* @param {*} flwingQRefs newFollowingQRef[delIdx] will be deleted inplace
* @param {*} delIdx < flwingQRefs.length
*/
function delFollowingByIdxFromFB(selfQRef, flwingQRefs, delIdx) {
  flwingQRefs.splice(delIdx, 1); // ***** array is modified inplace, change will persist
  return selfQRef.update({ followingRefs: flwingQRefs });
}

/**
*
* @param {*} selfRef
* @param {*} followingRefs contains exactly one element: el.id === newFollowingId
* @param {*} targetFollowingId existence in fb will be checked
*/
function delFollowingById(selfRef, followingRefs, targetFollowingId) {
  let query = firestore.doc(`users/${targetFollowingId}`);
  return new Promise((res, rej) => {
    let delIdx = -1
    for (let i = 0; i < followingRefs.length; i++) {
      if (followingRefs[i].id === targetFollowingId) {
        delIdx = followingRefs[i].id
      }
    }

    // Only deleted when found
    if (delIdx !== -1){
      // Grab the user data even if we delete it, to be consistent
      query.get().then(targetSRef=>{

        delFollowingByIdxFromFB(selfRef, followingRefs, delIdx).then((d) => {
          res(new UserInfo(targetSRef))
        })
      })
    } else res(false);
  }
  )
}

/**---------------------------follower api --------------------------------- */
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
  return selfQRef.update({ followerRefs: flwerQRefs });
}

/**
*
* @param {*} selfRef
* @param {*} followerRefs contains exactly one element: el.id === newFollowingId
* @param {*} targetFollowerId existence in fb will be checked
*/
function delFollowerById(selfRef, followerRefs, targetFollowerId) {
  return new Promise((res, rej) => {
    let delIdx = -1
    for (let i = 0; i < followerRefs.length; i++) {
      if (followerRefs[i].id === targetFollowerId) {
        delIdx = followerRefs[i].id
      }
    }

    // Only deleted when found
    if (delIdx !== -1)
      delFollowerByIdxFromFB(selfRef, followerRefs, delIdx).then((d) => {
        res(followerRefs)
      })
    else
      res(false);
  }
  ) // end promise()
}

/**--------------------------get user info api ------------------------------ */
/**
* Used locally for visibility purpose
*/
class UserInfo {
  /**
* @param {*} userSnapshot snapshot reference returned by firestore after
* calling QueryReference.get()
*/
  constructor(userSnapshot) {
    /************* Don't forget to change createUserDOM() with changes to this ctor ****************/
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
    qref
      .get()
      .then(snapshot => {

        if (snapshot.exists) {
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
function getUserInfoById(fs, uid) {
  return getUserInfoByRef(fs.doc(`users/${uid}`))
}

/**
* Grab user data in a structured way
* @param {*} userRefs
* @return {Promise}
*/
function getUsersInfoByRefs(userRefs) {
  return new Promise((resolve, reject) => {
    // when there're no eleemnts, resolve should still be called
    if (userRefs.length === 0)
      resolve([])

    let userInfoList = []
    let counter = 0
    userRefs.forEach(userRef => {
      getUserInfoByRef(userRef).then((info) => {
        if (userRef) {
          if (DEBUG)
            console.log(info)
          counter++;
          userInfoList = [
            ...userInfoList,
            info
          ]

          if (counter === userRefs.length) {
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
function getRcmdUsersInfo(fs, selfRef, followingRefs) {
  return new Promise((resolve, reject) => {
    let query = fs
      .collection('users')
      .where(FOLLOWER_COUNT, '>', 1);
    let infoList = []
    query
      .get()
      .then(snapshots => {
        snapshots.forEach(snapshot => {
          // exclude already-following users from rcmd list
          if (!refsHasId(followingRefs, snapshot.id) && selfRef.id !== snapshot.id) {
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

/**------------- user dom update for add/del ops ------------------ */

/**
* A uid may have multiple user tiles in following, follower sections
* @param {String} uid whose doms have property data-uid="${uid}"
* @return {Array<Node>} an array of doms that corresponds to uid
*/
function getUserDOMsByUid(uid, parent) {
  return parent.querySelectorAll(`div[data-uid="${uid}"]`)
}

function setBtnTextFollowed(uid, parent) {
  getUserDOMsByUid(uid, parent).forEach(dom => {
    let btn = dom.querySelector('button')
    btn.textContent = 'UNFOLLOW'
  })
}

function setBtnTextUnfollowed(uid, parent) {
  getUserDOMsByUid(uid, parent).forEach(dom => {
    let btn = dom.querySelector('button')
    btn.textContent = 'FOLLOW'
    // btn.onClick = setUserDOMsfollowed
  })
}

/**
* Return a dom element that could be injected into the DOM page
* @param {UserInfo} userInfo infomate returned from fb
* @param {*} uid
* @param {*} type used to determine what handlers should be registered to follow/delete
*/
function createUserDOM(userInfo, following) {

  let d = document.createElement('div');
  d.innerHTML = `
      <div class="mui-panel mui--text-center user-tile" data-uid=${userInfo.uid}>
        <div><img class="user-tile-avatar" src="images/default-pic.png"></div>
        <div class="user-tile-name">${userInfo.uid}</div>
        <button class="user-tile-btn mui-btn mui-btn--flat mui-btn--danger" >${following
      ? 'UNFOLLOW'
      : 'FOLLOW'}</button>
      </div>
      `;
  return d.firstElementChild
}

/*-------------------------- dom Handlers --------------------------- */



function followBtnHandler(e) {
  let btnElement = e.currentTarget
  if (DEBUG)
    console.log(followingRefs)
  addFollowingById(userRef, followingRefs, this.uid).then((addedUserInfo) => {
    if (addedUserInfo) {
      if (DEBUG)
        console.log(followingRefs)
      setBtnTextFollowed(this.uid, document)
      if(!existsUserDOMIn(addedUserInfo, flwingCtnr)) addUserTileTo(addedUserInfo,true, flwingCtnr)

      btnElement.onclick = unfollowBtnHandler.bind({
        uid: this.uid // continue to pass the target user id around
      })
    }
  })
}

function unfollowBtnHandler(e) {
  let btnElement = e.currentTarget
  if (DEBUG)
    console.log(followingRefs)
  delFollowingById(userRef, followingRefs, this.uid).then((deletedUserInfo) => {
    if (deletedUserInfo) {
      if (DEBUG)
        console.log(followingRefs)

      btnElement.onclick = followBtnHandler.bind({
        uid: this.uid // continue to pass the target user id around
      })

      setBtnTextUnfollowed(this.uid, document)


      if(existsUserDOMIn(deletedUserInfo, flwingCtnr)) delUserTileFrom(deletedUserInfo, flwingCtnr)

      if(existsUserDOMIn(deletedUserInfo, flwerCtnr)) {
        delUserTileFrom(deletedUserInfo, flwerCtnr)
        addUserTileTo(deletedUserInfo, false, flwerCtnr)
      }
    }
  })
}

function showrcmd() {
  findCtnr.className = "visible-container"
  flwingCtnr.className = "hidden-container"
  flwerCtnr.className = "hidden-container"
}

function showflwing() {
  findCtnr.className = "hidden-container"
  flwingCtnr.className = "visible-container"
  flwerCtnr.className = "hidden-container"
}

function showflwer() {
  findCtnr.className = "hidden-container"
  flwingCtnr.className = "hidden-container"
  flwerCtnr.className = "visible-container"
}

function existsUserDOMIn(userInfo,parent) {
  return getUserDOMsByUid(userInfo.uid,parent).length>0;
}

function delUserTileFrom(userInfo, parent){
  getUserDOMsByUid(userInfo.uid,parent).forEach(dom=>dom.remove());
}

function addUserTileTo(userInfo, isFollowing, parent){
  let dom = createUserDOM(userInfo, isFollowing)
  let btn = dom.querySelector('button')
  btn.onclick = isFollowing? unfollowBtnHandler.bind({ uid: userInfo.uid }): 
                            followBtnHandler.bind({ uid: userInfo.uid })
  parent.appendChild(dom)
}

/**
* Register page handlers for already existing info
* @param {Array<UserInfo>} flwings
* @param {Array<UserInfo>} nonFlwings
*/
function registerPageHandlers(flwings, nonFlwings, parent) {
  // following users have unfollow btns
  flwings.forEach(info => {
    getUserDOMsByUid(info.uid, parent).forEach(dom => {
      let btn = dom.querySelector('button')
      btn.onclick = unfollowBtnHandler.bind({ uid: info.uid })
    })
  })

  nonFlwings.forEach(info => {
    getUserDOMsByUid(info.uid, parent).forEach(dom => {
      let btn = dom.querySelector('button')
      btn.onclick = followBtnHandler.bind({ uid: info.uid })
    })
  })
}

/**-------------------------- fill page content ------------------------------ */

var userRef,
  followingRefs,
  followerRefs;

/**
* fetch data from fs to initialize page content
* @param {*} userRef
* @param {*} followingRefs
* @param {*} followerRefs
*/
function initPage(userRef, followingRefs, followerRefs) {
  Promise.all([
    getUsersInfoByRefs(followingRefs),
    getUsersInfoByRefs(followerRefs)
  ]).then(values => {

    if (DEBUG)
      console.log(values)

    let [
      flwings,
      followers] = values;

    // flwings users followed by default
    flwings.forEach(flwing => {
      addUserTileTo(flwing, true, flwingCtnr)
    })

    // flwerCtnr users followed by default
    followers.forEach(flwer => {
      // Exclude mutual relationships
      if (!refsHasId(flwings, flwer.id))
        addUserTileTo(flwer, false, flwerCtnr)
      else addUserTileTo(flwer, true, flwerCtnr)
    })

    // ******* attention: we're dividing all refs into two parts: following and
    // non-following ********************************************************
    // registerPageHandlers(flwings, nonFlwings);
  })
}

/*-------------------------- initialization --------------------------- */
// Real time listener
firebase
  .auth()
  .onAuthStateChanged(firebaseUser => {
    // var userRef,   followingRefs,   followerRefs; checks if user exists
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
          initPage(userRef, followingRefs, followerRefs);
        });

      showrcmd()

    } else {
      if (DEBUG)
        console.log('not logged in');
    }
  });