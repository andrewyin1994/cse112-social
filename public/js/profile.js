function getUserName(){
    firestore.collection('users').doc(firebase.auth().currentUser.uid).get().then(function(snapshot){
        console.log(snapshot.data().name);
    });
}
