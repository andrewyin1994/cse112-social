var postModal = document.getElementById('postModal');
var post = document.getElementById('post');
postModal.addEventListener('click', activatePost);

// Cancel Function
function cancelFunc() {
  mui.overlay('off');
}

// PostModal onclick event`
function activatePost(){
  
  var modalEl = document.createElement('div');
  modalEl.style.width = '800px';
  modalEl.style.height = '500px';
  modalEl.style.margin = '300px auto';
  modalEl.innerHTML = `<div class="mui-container-fluid" id="post">
    <div class="mui-row">
      <div class="mui-col-md-6 mui-col-md-offset-3 mui-panel">
        <form class="mui-form">
          <table class="mui-table--bordered">
            <td>
              <img id="default" src="images/default-pic.png" width="35" height="35">
            </td>
            <td>
              <div>user name</div>
            </td>
          </table>
          <div class="mui-textfield mui-textfield--float-label">
            <input type="text" name="text" id="postContent">
            <label for="user">What's new with you?</label>
          </div>
        </form>

        <button class="mui-btn mui-btn--primary" id="btnPostCancel" onclick="cancelFunc();">CANCEL</button>
        <button class="mui-btn mui-btn--primary" id="btnPostCancel" onclick="mui.overlay('off')">CANCEL</button>
        <button class="mui-btn mui-btn--primary" disabled id="btnPost" style="float: right">POST</button>
      </div>
    </div>
  </div>`;

  // show modal
  mui.overlay('on', modalEl);
}