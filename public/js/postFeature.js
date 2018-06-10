const d = firestore.doc(`users/${firebase.auth().currentUser.uid}`)
const dR = firestore.doc(`users/e4L1ADzjqzQsc1DThDHZdTKbVuU2`)
dR.get().then(function(doc) {
 console.log(doc.exists)
 if (doc && doc.exists) {
  console.log(doc.data())
 }
})
.catch(function(err) {
 console.log("Error: ", err);
});
firestore.collection("users").get().then(function(querySnapshot) {
 querySnapshot.forEach(function(doc) {
   // doc.data() is never undefined for query doc snapshots
   console.log(doc.id, " => ", doc.data());
 });
}).catch(function(error) {
  console.log("Error getting documents: ", error);
});