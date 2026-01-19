const stars = document.querySelectorAll(".star");
const ratingInput = document.getElementById("ratingInput");

let selectedRating = 0;

stars.forEach((star) => {
  star.addEventListener("mouseover", () => {
    const value = star.getAttribute("data-value");
    highlightStars(value);
  });

  star.addEventListener("mouseout", () => {
    highlightStars(selectedRating);
  });

  star.addEventListener("click", () => {
    selectedRating = star.getAttribute("data-value");
    ratingInput.value = selectedRating;
    highlightStars(selectedRating);
  });
});

function highlightStars(value) {
  stars.forEach((star) => {
    star.classList.remove("hovered", "selected");
    if (star.getAttribute("data-value") <= value) {
      star.classList.add("selected");
    }
  });
}
