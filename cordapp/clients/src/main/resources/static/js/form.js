let form = document.getElementById('form');
let reset = document.getElementById('reset');

reset.addEventListener('click', function() {
  form.innerHTML = "<h5>Form</h5><button>Submit!</button>";
});

let add = document.getElementById('badd');
let names = document.getElementById('names');

add.addEventListener('click', function() {
  let lab =  document.createElement('label');
  lab.innerHTML = names.value + ": ";
  lab.htmlFor = names.value;
  form.insertBefore(lab, form.lastChild);

  let inp = document.createElement('input');
  inp.name = names.value;
  form.insertBefore(inp, form.lastChild);

  form.insertBefore(document.createElement('br'), form.lastChild);
});

let bact = document.getElementById('bact');
let acts = document.getElementById('acts');
let pact = document.getElementById('action');

bact.addEventListener('click', function() {
  form.action = acts.value;
  pact.innerHTML = "Action: " + acts.value;
});
