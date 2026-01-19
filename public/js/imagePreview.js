const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const currentImage = document.getElementById("currentImage");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    imagePreview.src = reader.result;
    imagePreview.style.display = "block";

    // hide old image after selecting new one
    if (currentImage) {
      currentImage.style.display = "none";
    }
  };

  reader.readAsDataURL(file);
});
