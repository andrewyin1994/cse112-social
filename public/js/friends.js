const testBtn = document.getElementById('testBtn');
const testInsert = document.getElementById('testInsert');

const EMAIL_FIELD = 'email'
const DEBUG = true


const findCtnr = document.getElementById('find-container')
const flwingCtnr = document.getElementById('flwing-container')
const flwerCtnr = document.getElementById('flwer-container')

const qresultCtnr  = document.getElementById('qresult')

const searchInput = document.getElementById('search-input')
const searchForm = document.getElementById('search-form')


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
 * Wrapper function around refsHasId
 * @param {String} uid check if is following current uid by accessing global
 * followingRefs
 */
function isFollowing(uid){
  return refsHasId(followingRefs,uid)
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
        delIdx = i
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
        delIdx = i
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
    // this.name = snapshot.data().name,
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
* @param {Reference} email there's only one nonself user with such email in firestore
* @return {UserInfo} a single UserInfo object that matches the given email in fs
*/
function searchUsersInfoByEmail(fs, selfRef, email) {
  return new Promise((resolve, reject) => {
    let query = fs
      .collection('users')
      .where(EMAIL_FIELD, '==', email);

    query
      .get()
      .then(snapshots => {
        snapshots.forEach(snapshot => {
          // exclude self
          if (selfRef.id !== snapshot.id) {
            resolve(new UserInfo(snapshot))
          } // endif
        }) // end foreach
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

  if (DEBUG)
    console.log(followingRefs)
  addFollowingById(userRef, followingRefs, this.uid).then((addedUserInfo) => {
    if (addedUserInfo) {
      if (DEBUG)
        console.log(followingRefs)
      setBtnTextFollowed(this.uid, document)
      if(!existsUserDOMIn(addedUserInfo, flwingCtnr)) addUserTileTo(addedUserInfo,true, flwingCtnr)

      getUserDOMsByUid(this.uid,document).forEach(dom=>{
        dom.querySelector('button').onclick=unfollowBtnHandler.bind({
          uid: this.uid // continue to pass the target user id around
        })
      })
    }
  })
}

function unfollowBtnHandler(e) {

  if (DEBUG)
    console.log(followingRefs)
  delFollowingById(userRef, followingRefs, this.uid).then((deletedUserInfo) => {
    if (deletedUserInfo) {
      if (DEBUG)
        console.log(followingRefs)

      getUserDOMsByUid(this.uid,document).forEach(dom=>{
        dom.querySelector('button').onclick = followBtnHandler.bind({
          uid: this.uid // continue to pass the target user id around
        })
      })

      setBtnTextUnfollowed(this.uid, document)

      // only delete from following container
      if(existsUserDOMIn(deletedUserInfo, flwingCtnr)) delUserTileFrom(deletedUserInfo, flwingCtnr)

      // replace existing dom in follower container
      // if(existsUserDOMIn(deletedUserInfo, flwerCtnr)) {
      //   delUserTileFrom(deletedUserInfo, flwerCtnr)
      //   addUserTileTo(deletedUserInfo, false, flwerCtnr)
      // }

      // replace existing dom in query result container
      // if(existsUserDOMIn(deletedUserInfo, qresultCtnr)) {
      //   delUserTileFrom(deletedUserInfo, qresultCtnr)
      //   addUserTileTo(deletedUserInfo, false, qresultCtnr)
      // }
    }
  })
}

function showfind() {
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

/**
 * Remove user from ui dom
 * @param {UserInfo} userInfo information of user being deleted from dom
 * @param {Element} parent the immediate parent container from which the file will be
 * deleted
 */
function delUserTileFrom(userInfo, parent){
  getUserDOMsByUid(userInfo.uid,parent).forEach(dom=>dom.remove());
}

/**
 * add user to ui dom
 * @param {UserInfo} userInfo information of user being added to dom
 * @param {Boolean} isFollowing used to determine button
 * @param {Element} parent the immediate parent container that holds all user tiles
 * @returns
 */
function addUserTileTo(userInfo, isFollowing, parent, 
  unflhdlr = unfollowBtnHandler.bind({ uid: userInfo.uid }), 
  flhdlr = followBtnHandler.bind({ uid: userInfo.uid })){
  let dom = createUserDOM(userInfo, isFollowing)
  let btn = dom.querySelector('button')
  btn.onclick = isFollowing? unflhdlr: flhdlr
  parent.appendChild(dom)
}

/**
* Register page handlers for search tab
*/
function registerPageHandlers() {
  searchForm.onsubmit=function(e){
    e.preventDefault()

    qresultCtnr.innerHTML=""

    let val = searchInput.value.trim()

    if (validMail(val)) searchUsersInfoByEmail(firestore, userRef, val).then((userInfo)=>{
      if(DEBUG) console.log(userInfo) 
      addUserTileTo(userInfo,refsHasId(followingRefs, userInfo.uid), qresultCtnr)
    })

    return false
  }
}

function validMail(mail)
{
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
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
    registerPageHandlers();
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
            initPage(userRef, followingRefs, followerRefs);        });

      showfind()

    } else {
      if (DEBUG)
        console.log('not logged in');
    }
  });
