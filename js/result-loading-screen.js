// document.addEventListener("DOMContentLoaded", () => {
//   // Redirect to results page after 3 seconds
//   setTimeout(() => {
//     window.location.href = "/exam-result.html";
//   }, 3000);
// });

document.addEventListener("DOMContentLoaded", () => {
  const progressText = document.getElementById("progress-text");
  let progress = 0;

  function updateProgress() {
    progress = (progress + 1) % 101;
    progressText.textContent = `${progress}%`;
  }

  setInterval(updateProgress, 20);

  // Redirect after 2.5 seconds with correct GitHub Pages path
  setTimeout(() => {
    // Use relative path to ensure correct navigation within the repository
    const baseUrl = "/blenderCOM-examination";
    window.location.href = `${baseUrl}/exam-result.html`;
  }, 2500);
});
