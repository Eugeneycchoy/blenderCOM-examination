document.addEventListener("DOMContentLoaded", () => {
  // DOM
  const carouselInner = document.querySelector(
    ".taking-exam-question-carousel-inner"
  );
  const items = document.querySelectorAll(
    ".taking-exam-question-carousel-item"
  );
  const prevButton = document.querySelector(
    ".taking-exam-question-carousel-prev"
  );
  const nextButton = document.querySelector(
    ".taking-exam-question-carousel-next"
  );
  const questionNumber = document.querySelector(".question-count");
  const submitAnswersBtn = document.querySelector(".exam-submit-btn");
  const progressBarDots = document.querySelectorAll(".progress-bar-dot");
  const mcOptions = document.querySelectorAll(".mc");
  const assistanceBtn = document.querySelector(".exam-controls-left");
  const assistanceModalCloseBtn = document.querySelector(".close-modal-btn");

  let currentIndex = 0;

  // Array to store the answers
  // ** This might need to be implemented elsewhere where the code is not visible in the frontend?? ** //
  const quizAnswers = [
    0, 0, 1, 0, 3, 1, 0, 1, 2, 3, 0, 3, 1, 0, 0, 3, 0, 3, 0, 2,
  ];

  // Array to store selections for each question
  const selections = new Array(items.length).fill(null);

  /*
    UI Elements update
  */
  // Progress bar Implementation
  function updateProgressBarUI() {
    // Loop through each dot in the progress bar
    progressBarDots.forEach((dot, index) => {
      // Remove any existing state classes
      dot.classList.remove("answered", "unanswered", "active");

      // Add answered/unanswered class based on selections array
      // If the current index has a selection, add the answered class
      // Otherwise add the unanswered class
      if (selections[index] !== null) {
        dot.classList.add("answered");
      } else {
        dot.classList.add("unanswered");
      }

      // Add active class based on currentIndex
      // If the current index matches the loop index, add the active class
      if (index === currentIndex) {
        dot.classList.add("active");
      }
    });
  }
  // This controls what happens when a "Question Circle" is clicked
  function navigateWithProgressBar() {
    // Loop through each dot in the progress bar
    progressBarDots.forEach((dot, index) => {
      // Add click event listener to each dot
      dot.addEventListener("click", () => {
        // Update currentIndex to the index of the clicked dot
        currentIndex = index;

        // Update the carousel position, question count, and progress bar UI
        updateCarousel();
        updateQuestionCount();
        updateProgressBarUI();
        updateControlBtns();

        // Log the current index for debugging
        console.log("Current Index: " + currentIndex);
      });
    });
  }
  // Timer Implementation
  const timerElement = document.querySelector(".exam-countdown-timer");
  let timeLeft = 10 * 60; // 1 hour in seconds
  function updateTimer() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Format time with leading zeros
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    timerElement.textContent = formattedTime;

    // Add warning class when 10 minutes or less remain
    if (timeLeft <= 600) {
      // 600 seconds = 10 minutes
      timerElement.classList.add("warning");
    }

    // Decrease time and handle timer completion
    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(timerInterval); // Stop the timer when time is up
      timerElement.classList.remove("warning");
      alert("Time is up!"); // Notify the user
      // Add your exam submission logic here
    }
  }
  updateTimer();
  setInterval(updateTimer, 1000);
  // Question Carousel Implementation
  if (!carouselInner || !items.length || !prevButton || !nextButton) {
    console.error("Required carousel elements not found");
    return;
  }
  function updateCarousel() {
    // Translate the carousel to show the current slide
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update the visual state of the multiple-choice options for the current slide
    const currentSlideOptions = items[currentIndex].querySelectorAll(".mc");
    currentSlideOptions.forEach((option, index) => {
      // Add 'selected' class to the option if it matches the stored selection
      if (selections[currentIndex] === index) {
        option.classList.add("selected");
      } else {
        option.classList.remove("selected");
      }
    });
  }
  function updateQuestionCount() {
    questionNumber.textContent = currentIndex + 1;
  }
  // Check whether to display or hide the Prev/Next Button
  // eg. When doing the first question, there should not be a "Previous Question" button shown
  function updateControlBtns() {
    const previousQuestionButton = document.querySelector(
      ".taking-exam-question-carousel-prev"
    );
    const nextQuestionButton = document.querySelector(
      ".taking-exam-question-carousel-next"
    );

    if (!previousQuestionButton || !nextQuestionButton) {
      console.error("Navigation buttons not found");
      return;
    }

    // Show/hide previous button
    if (currentIndex === 0) {
      previousQuestionButton.classList.add("hidden");
    } else {
      previousQuestionButton.classList.remove("hidden");
    }

    // Show/hide next button
    if (currentIndex === items.length - 1) {
      nextQuestionButton.classList.add("hidden");
    } else {
      nextQuestionButton.classList.remove("hidden");
    }
  }
  // Image file submission
  function initializeImageUpload() {
    // DOM Elements
    const dropField = document.querySelector("#assistance-modal-drop-field");
    const fileInput = document.querySelector("#assistance-modal-file-input");
    const previewContainer = document.querySelector("#preview-container");

    // Handle file selection
    function handleFiles(files) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = function (e) {
        previewContainer.innerHTML = `
          <img src="${e.target.result}" alt="Preview" />
          <button class="remove-btn">Remove</button>
        `;

        // Add remove button functionality
        const removeBtn = previewContainer.querySelector(".remove-btn");
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          previewContainer.innerHTML = "";
          fileInput.value = "";
        });
      };
      reader.readAsDataURL(file);
    }

    // Drag and drop handlers
    dropField.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropField.classList.add("dragover");
    });

    dropField.addEventListener("dragleave", () => {
      dropField.classList.remove("dragover");
    });

    dropField.addEventListener("drop", (e) => {
      e.preventDefault();
      dropField.classList.remove("dragover");
      handleFiles(e.dataTransfer.files);
    });

    // Click to upload
    dropField.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      handleFiles(e.target.files);
    });
  }

  function navigateToQuestion(direction) {
    // Check bounds and return if invalid navigation
    if (
      (direction === -1 && currentIndex === 0) ||
      (direction === 1 && currentIndex === items.length - 1)
    ) {
      return;
    }

    // Update current index
    currentIndex += direction;

    // Update all UI components
    updateCarousel();
    updateQuestionCount();
    updateProgressBarUI();
    updateControlBtns();
  }

  // What happens when a MC selection is selected
  mcOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const slideOptions = Array.from(
        items[currentIndex].querySelectorAll(".mc")
      );
      const optionIndex = slideOptions.indexOf(option);

      // Store selection for current question
      selections[currentIndex] = optionIndex;

      // Update visual state
      slideOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");

      console.log(selections);
    });
  });

  function checkAnswers(answers, selections) {
    let correctCount = 0;

    // Compare answers with selections
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === selections[i]) {
        correctCount++;
      }
    }

    // Log the results
    console.log(
      `Score: ${correctCount} correct out of ${answers.length} questions`
    );
    return correctCount;
  }

  // Adding EventListers
  prevButton.addEventListener("click", () => navigateToQuestion(-1));
  nextButton.addEventListener("click", () => navigateToQuestion(1));
  submitAnswersBtn.addEventListener("click", () => {
    const darkOverlay = document.querySelector(".taking-exam-dark-overlay");
    // show the warning msg
    // if not all questions are answered
    const popupWarningModal = document.querySelector(".popup-warning");
    if (selections.includes(null)) {
      popupWarningModal.classList.add("show");
    } else {
      popupWarningModal.classList.remove("show");
    }

    darkOverlay.classList.add("show");

    const backToQuizBtn = document.querySelector(
      "#taking-exam > div.taking-exam-dark-overlay.show > div > div > button.btn-secondary"
    );
    backToQuizBtn.addEventListener("click", () => {
      darkOverlay.classList.remove("show");
    });
  });
  assistanceBtn.addEventListener("click", () => {
    // Display the assistance modal
    const darkOverlay = document.querySelector(".assistance-dark-overlay");
    darkOverlay.classList.add("show");
    document.body.classList.add("modal-open");
  });
  assistanceModalCloseBtn.addEventListener("click", () => {
    // Close the assistance modal if opened
    const darkOverlay = document.querySelector(".assistance-dark-overlay");
    darkOverlay.classList.remove("show");
    document.body.classList.remove("modal-open");
  });

  // confirm submission btn
  const confirmSubmitBtn = document.querySelector(".btn-confirm-submission");
  confirmSubmitBtn.addEventListener("click", () => {
    checkAnswers(quizAnswers, selections);
    // play loading screen animation
    // navigate to result page
  });

  // Page Navigation
  const submittingBtn = document.querySelector(".btn-confirm-submission");
  submittingBtn.addEventListener("click", () => {
    // Store the exam results before navigation
    const score = checkAnswers(quizAnswers, selections);
    localStorage.setItem("examScore", score);
    localStorage.setItem("totalQuestions", quizAnswers.length);

    // First navigate to loading screen
    window.location.href = "../result-loading-screen.html";
  });

  // Initial call to set up initial state
  updateProgressBarUI();
  navigateWithProgressBar();
  updateControlBtns();
  initializeImageUpload();
  console.log(selections);
});
