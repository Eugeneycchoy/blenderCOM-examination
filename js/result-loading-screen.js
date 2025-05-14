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

  // Redirect after 3 seconds
  setTimeout(() => {
    window.location.href = "blenderCOM-examination/exam-result.html";
  }, 2500);
});
