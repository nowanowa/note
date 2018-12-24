const parapara = (id, src, msg) => {
  const fig = document.getElementById(id);
  const imgs = fig.querySelectorAll('img');
  for (let i = imgs.length; i --> 0; ) {
    const img = imgs[i];
    img.hidden = img.getAttribute('src') != src;
  }
  fig.querySelector('.msg').innerHTML = msg;
};
