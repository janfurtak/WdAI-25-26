function getRandomImage() {
  const index = Math.floor(Math.random() * 9) + 1;
  return `../assets/IMG_${index}.jpg`;
}

function changeImage(img) {
  let newSrc;
  do {
    newSrc = getRandomImage();
  } while (img.src.endsWith(newSrc));
  img.src = newSrc;
}

document.querySelector(".Img").addEventListener("click", (e) => {
  changeImage(e.target);
});
