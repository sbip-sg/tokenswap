let login_button = document.getElementById("login");
login_button.addEventListener("click", function() {
  let node_div = document.getElementById("node-info");

  let addr = document.getElementById("addr");
  let user = document.getElementById("user");
  let password = document.getElementById("password");

  let request = new XMLHttpRequest();
  request.open('GET', '/dologin?hi=1&addr=' + addr.value + "&user=" + user.value + "&password=" + password.value +"&youarehigh=true", true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      node_div.innerHTML = this.response;
    } else {
      // We reached our target server, but it returned an error

    }
  };
  request.send();
});
