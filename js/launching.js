
// This is an event that will perform the animation call and stop the link from jumping immediately.
document.getElementById('spaceship-link').addEventListener('click', function (e) {
    e.preventDefault();

    const ship = document.getElementById('spaceship-img');
    ship.classList.add('launching');

    // After animation ends, go to the page.
    setTimeout(() => {
      window.location.href = this.href;
    }, 1500);
});