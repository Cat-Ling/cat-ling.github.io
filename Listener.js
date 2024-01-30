/*
Pinnacle of technological innovation, it submits the form when you press the enter key.
*/
document.getElementById('urlContainer').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    submitUrl();
  }
});
// Triggers Submit.js's submitURL() function.
document.getElementById('submitBtn').addEventListener('click', submitUrl);