document.addEventListener('DOMContentLoaded', () => {
  const h3s = document.querySelectorAll('h3');
  let lis = '';
  for (let i = 0; i < h3s.length; i++) {
    const h3 = h3s[i];
    const id = h3.id || 'section' + i;
    h3.id = id;
    lis += '<li><a href="#'+id+'">' + h3.innerHTML + '</a></li>';
  }
  document.getElementById("mokuji").innerHTML = lis;
});
