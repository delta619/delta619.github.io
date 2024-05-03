const profileImage = document.querySelector('.profile-image');
const heartsContainer = document.querySelector('.hearts-container');
const shadesOverlay = document.querySelector('.shades-overlay');

profileImage.addEventListener('click', () => {
  createHeart();
  shadesOverlay.style.opacity = shadesOverlay.style.opacity === '1' ? '0' : '1';

});

function createHeart() {
  const heart = document.createElement('span');
  heart.textContent = '🍕';
  heart.style.position = 'absolute';
  heart.style.left = `${Math.random() * window.innerWidth}px`;
  heart.style.top = `${Math.random() * window.innerHeight}px`;
  heart.style.fontSize = `${Math.random() * 50 + 20}px`;
  heart.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  heart.style.animationName = 'heartAnimation';
  heart.style.animationDuration = `${Math.random() * 2 + 2}s`;
  heartsContainer.appendChild(heart);

//   setTimeout(() => {
//     heart.remove();
//   }, 4000);
}

