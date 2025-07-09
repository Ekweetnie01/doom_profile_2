document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const usernameInput = document.getElementById('username');
      const username = usernameInput.value.trim();

      if (username) {
        sessionStorage.setItem('slayerUsername', username);
        window.location.href = 'arsenal.html';
      } else {
        alert("A Slayer must have a name!");
        usernameInput.focus();
      }
    });
  }
});