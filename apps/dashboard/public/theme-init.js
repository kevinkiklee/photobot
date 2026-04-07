(() => {
  var t = localStorage.getItem('theme');
  if (t === 'light') {
    return;
  }
  if (t === 'dark' || !t) {
    document.documentElement.classList.add('dark');
  }
})();
