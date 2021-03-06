const TeamSnip={currentSchedule:undefined,util:{uuid:function(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16))}}};const docRef=firestore.doc("team/schedule")
class Schedule{constructor(){this.schedule=[]}
addSchedule(name,number,position,archived,load){let scheduleEl=new scheduleElement(name,number,position,archived);this.schedule.push(scheduleEl);window.localStorage.schedule=JSON.stringify(TeamSnip.currentSchedule.schedule);console.log(load);if(load){docRef.set({team:window.localStorage.schedule})}}
editSchedule(playerId,name,number,position){let scheduleElement=this.findSchedule(playerId);scheduleElement.edit(name,number,position);window.localStorage.schedule=JSON.stringify(TeamSnip.currentSchedule.schedule);docRef.set({team:window.localStorage.schedule})}
findSchedule(playerId){let len=this.schedule.length;for(let i=0;i<len;i++){if(this.schedule[i].playerId===playerId){return(this.schedule[i])}}
return-1}
removeSchedule(playerId){let scheduleElement=this.findSchedule(playerId);scheduleElement.remove();window.localStorage.schedule=JSON.stringify(TeamSnip.currentSchedule.schedule);docRef.set({team:window.localStorage.schedule})}
get(){return this.schedule}
render(){let template=document.querySelector("#schedule");let markup="<ul>";for(let i=0,len=schedule.length;i<len;i++){markup+=schedule[i].render()}
for(let i=0,len=TeamSnip.currentSchedule.schedule.length;i<len;i++){markup+=TeamSnip.currentSchedule.schedule[i].render()}
markup+="</ul>";template.content.querySelector("#playerList").innerHTML=markup;let clonedTemplate=document.importNode(template.content,!0);let view=document.querySelector("#view");view.innerHTML="";view.appendChild(clonedTemplate);document.querySelector("#addBtn").addEventListener("click",function(){TeamSnip.currentSchedule.renderAddForm()},!1)}
renderAddForm(playerId){let template=document.querySelector("#playerFormTemplate"),clonedTemplate=document.importNode(template.content,!0),view=document.querySelector("#view");view.innerHTML="";view.appendChild(clonedTemplate);if(playerId){let player=TeamSnip.currentSchedule.findSchedule(playerId);document.querySelector("#playerName").value=player.name;document.querySelector("#playerPosition").value=player.position;document.querySelector("#playerNumber").value=player.number;document.querySelector("#addPlayerBtn").setAttribute("data-action","edit");document.querySelector("#addPlayerBtn").setAttribute("data-playerid",playerId)}
document.querySelector("#addPlayerBtn").addEventListener("click",function(){let name,position,number,playerId;name=document.querySelector("#playerName").value;position=document.querySelector("#playerPosition").value;number=document.querySelector("#playerNumber").value;playerId=document.querySelector("#addPlayerBtn").getAttribute("data-playerid");if(playerId){TeamSnip.currentSchedule.editSchedule(playerId,name,number,position)}else{TeamSnip.currentSchedule.addSchedule(name,number,position,!1,1)}
TeamSnip.currentSchedule.render()},!1);document.querySelector("#cancelPlayerBtn").addEventListener("click",function(){TeamSnip.currentSchedule.render()},!1)}}
class scheduleElement{constructor(name,number,position="Not assigned",archived){this.playerId=TeamSnip.util.uuid();this.name=name;this.number=number;this.position=position;this.archived=archived}
edit(name,number,position){this.name=name;this.number=number;this.position=position}
remove(){this.archived=!0}
restore(){this.archived=!1}
get(){if(!this.archived){return{id:this.playerId,name:this.name,number:this.number,position:this.position}}}
render(){let MARKUP="";if(!this.archived){MARKUP=`<li class="player btn">
				${this.name}; Time: ${this.number}
				<br>
				<strong>${this.position}</strong>
				<div class="recordControls">
				[
					<span class="editBtn" onclick="TeamSnip.currentSchedule.renderAddForm(this.id)" id="${this.playerId}">Edit</span>
				] &nbsp;&nbsp; [
					<span class="editBtn" onclick="TeamSnip.currentSchedule.removeSchedule(this.id); TeamSnip.currentSchedule.render()" id="${this.playerId}">Delete</span>
				]
				</div>
				</li>`}
return MARKUP}}
function reload(){for(let i=0;i<TeamSnip.currentSchedule.schedule.length;i++){if(TeamSnip.currentSchedule.schedule[i].archived==!0)
TeamSnip.currentSchedule.schedule[i].archived=!1}}
window.addEventListener("DOMContentLoaded",function(){TeamSnip.currentSchedule=new Schedule();if(!navigator.onLine){if(window.localStorage.loadedSched){var out=JSON.parse(window.localStorage.schedule);for(let i=0;i<out.length;i++){TeamSnip.currentSchedule.addSchedule(out[i].name,out[i].number,out[i].position,s[i].archived,0)}
TeamSnip.currentSchedule.render()}}
else{docRef.get().then(function(doc){if(doc&&doc.exists){const myData=doc.data().team;if(myData){var s=JSON.parse(myData);window.localStorage.schedule=s;for(let i=0;i<s.length;i++){TeamSnip.currentSchedule.addSchedule(s[i].name,s[i].number,s[i].position,s[i].archived,0)}}}
else{console.log("NO DOC")}
TeamSnip.currentSchedule.render()})}},!1)