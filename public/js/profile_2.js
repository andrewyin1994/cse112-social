function changeProfile(){
	var name = document.getElementById("name").value;
	var email = document.getElementById("email").value;
	var city = document.getElementById("city").value;
	var post = document.getElementById("post").value;
	//alert(city);
	//var fireBaseRef = firebase.database().ref("UserInfo/Phillip").child("City");
	const firestore = firebase.firestore();
	firestore.collection('UserInfo').doc('Test').set({Name: name}).then((snapshot) => {
      //do something with snapshot
    	console.log(snapshot.data().key1);
  	});

/*
	fireBaseRef.set({
		Name: name,
		Email: email,
		City: city,
		Post: post
	});
*/
	//fireBaseRef.set("A");
}