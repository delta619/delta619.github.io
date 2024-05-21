$('.profile-image').mouseenter(function () {
  // Show the shades
  $('.img_shades').css('visibility', 'visible');

  // Get the dimensions and position of the profile image
  const profileImageRect = this.getBoundingClientRect();

  // Create "I am Batman" message
  const message = document.createElement('div');
  message.textContent = "I am Batman";
  message.style.position = 'fixed';
  message.style.top = '20px'; // Position it 20px from the top
  message.style.right = '20px'; // Position it 20px from the right
  message.style.fontSize = '24px';
  message.style.color = 'white';
  message.style.backgroundColor = 'black';
  message.style.padding = '10px';
  message.style.borderRadius = '5px';
  message.style.zIndex = '9999';
  document.body.appendChild(message);

  setTimeout(() => {
      message.remove();
  }, 2000);
});

$('.profile-image').mouseleave(function () {
  // Hide the shades
  $('.img_shades').css('visibility', 'hidden');
});
