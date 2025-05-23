document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    examDarkOverlay: document.querySelector(".exam-dark-overlay"),
    examModal: document.querySelector(".exam-modal-agreement"),
    modalCloseBtn: document.querySelector(".close-modal-btn"),
    takeExamBtns: document.querySelectorAll(".take-exam"),
    carousels: document.querySelectorAll(".carousel"),
  };

  // Add this object at the top of your file with other constants
  const EXAM_ROUTES = {
    // Level 0 Examinations
    "Basic 3D Modeling in Blender": "./exams/level-0-1.html",
    "Introduction to Blender Animation": "./exams/level-0-2.html",
    "Creating Simple Objects in Blender": "./exams/level-0-3.html",
    "Blender Basics: Modeling and Texturing": "./exams/level-0-4.html",
    "Animating Basic Shapes in Blender": "./exams/level-0-5.html",
    "Blender Beginner's 3D Challenge": "./exams/level-0-6.html",
    "Fundamentals of Blender Animation": "./exams/level-0-7.html",
    "Simple Scene Creation in Blender": "./exams/level-0-8.html",
    "Blender Basics: Lighting and Rendering": "./exams/level-0-9.html",
    "Getting Started with Blender Sculpting": "./exams/level-0-10.html",

    // Level 1 Examinations
    "Advanced 3D Modeling Techniques in Blender": "./exams/level-1-1.html",
    "Intermediate Blender Animation": "./exams/level-1-2.html",
    "Complex Object Creation in Blender": "./exams/level-1-3.html",
    "Blender Intermediate: Texturing and Shading": "./exams/level-1-4.html",
    "Animating Characters in Blender": "./exams/level-1-5.html",
    "Blender Intermediate 3D Challenge": "./exams/level-1-6.html",
    "Blender Workflow Optimization": "./exams/level-1-7.html",
    "Creating Detailed Scenes in Blender": "./exams/level-1-8.html",
    "Blender Intermediate: Lighting and Rendering": "./exams/level-1-9.html",
    "Advanced Sculpting Techniques in Blender": "./exams/level-1-10.html",
  };

  // Take Exam Buttons Event Listeners
  // Carousel Controller
  function initializeCarousel(carousel) {
    const state = {
      inner: carousel.querySelector(".carousel-inner"),
      items: carousel.querySelectorAll(".carousel-item"),
      currentIndex: 0,
    };

    const buttons = {
      prev: carousel.querySelector(".prev"),
      next: carousel.querySelector(".next"),
    };

    function getScrollOffset() {
      const windowWidth = window.innerWidth;

      // Adjust scroll percentage based on breakpoints
      if (windowWidth < 576) {
        return 100; // Mobile: full width scroll
      } else if (windowWidth < 992) {
        return 50; // Tablet: half width scroll
      } else {
        return 40; // Desktop: original scroll width
      }
    }

    function updateCarousel() {
      const scrollOffset = getScrollOffset();
      state.inner.style.transform = `translateX(-${
        state.currentIndex * scrollOffset
      }%)`;
    }

    // Update carousel on window resize
    window.addEventListener("resize", updateCarousel);

    function navigate(direction) {
      if (direction === "prev") {
        state.currentIndex =
          state.currentIndex > 0
            ? state.currentIndex - 1
            : state.items.length - 1;
      } else {
        state.currentIndex =
          state.currentIndex < state.items.length - 1
            ? state.currentIndex + 1
            : 0;
      }
      updateCarousel();
    }

    // Event Listeners
    buttons.prev.addEventListener("click", () => navigate("prev"));
    buttons.next.addEventListener("click", () => navigate("next"));
  }

  // Modal Controller
  const modalController = {
    show() {
      elements.examDarkOverlay.classList.add("show");
      document.body.classList.add("modal-open");
    },

    close() {
      elements.examDarkOverlay.classList.remove("show");
      document.body.classList.remove("modal-open");

      // Fix the selector to match HTML
      const examModalTitleh2s = document.querySelectorAll(
        ".exam-modal-exam-title"
      );
      examModalTitleh2s.forEach((h2) => h2.classList.add("d-none"));
    },

    init() {
      // Modal Event Listeners
      elements.examDarkOverlay.addEventListener("click", (event) => {
        if (event.target === elements.examDarkOverlay) {
          this.close();
        }
      });

      elements.modalCloseBtn.addEventListener("click", () => this.close());
      elements.examModal.addEventListener("click", (event) =>
        event.stopPropagation()
      );

      // Take Exam Buttons with navigation
      elements.takeExamBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.show();
          // Get the level from button's class
          const level = btn.className.match(/level-(\d+-\d+)/)?.[1];
          if (level) {
            // Show corresponding title
            const title = document.querySelector(
              `.exam-modal-exam-title.level-${level}`
            );
            if (title) title.classList.remove("d-none");
          }
        });
      });
    },
  };

  // What happens after the Take Exam button from
  // the exam thumbnail is clicked
  // i.e. It should show a popup modal
  const ExamButtonController = {
    levels: {
      zero: Array.from({ length: 10 }, (_, i) => `0-${i + 1}`),
      one: Array.from({ length: 10 }, (_, i) => `1-${i + 1}`),
    },

    init() {
      this.levels.zero.concat(this.levels.one).forEach((level) => {
        const button = document.querySelector(`.take-exam.level-${level}`);
        if (button) {
          button.addEventListener("click", () => this.handleExamClick(level));
        }
      });
    },

    handleExamClick(level) {
      // Hide all titles first
      document
        .querySelectorAll(".exam-modal-exam-title")
        .forEach((title) => title.classList.add("d-none"));

      // Show selected title
      const titleElement = document.querySelector(
        `.exam-modal-exam-title.level-${level}`
      );
      if (titleElement) {
        titleElement.classList.remove("d-none");
      }

      // Show modal
      modalController.show();
    },
  };

  // Handle the DOM retrieval as well as
  // eventListener application of the
  // "Take Exam" button from the confirmation modal
  const ExamNavigationController = {
    // init() gets the DOM
    // then add an eventListener to the DOM element
    init() {
      const takeExamBtn = document.querySelector(
        ".agreement-content-btn.take-exam"
      );
      if (!takeExamBtn) {
        console.error("Take exam button not found");
        return;
      }

      takeExamBtn.addEventListener("click", () => this.handleNavigation());
    },

    // This following code is what happens after the
    // takeExamBtn is clicked
    handleNavigation() {
      // Check the title that does not have a ".d-none" class
      // Meaning that it is not hidden
      const visibleTitle = document.querySelector(
        ".exam-modal-exam-title:not(.d-none)"
      );

      // Edge case check
      if (!visibleTitle) {
        console.error("No exam title selected");
        return;
      }

      // get rid of the space in both ends of the string
      const examTitle = visibleTitle.textContent.trim();
      // get the url, according to the exam title
      const targetRoute = EXAM_ROUTES[examTitle];

      // Edge case check
      if (!targetRoute) {
        console.error(`No route found for exam: ${examTitle}`);
        return;
      }

      // Navigate to the target url
      window.location.href = `${targetRoute}`;
    },
  };

  // Decides which examination the user will
  // be navigated to once "Take Exam" Button
  // in the popup modal is clicked

  // Initialize
  elements.carousels.forEach((carousel) => initializeCarousel(carousel));
  modalController.init();
  ExamButtonController.init();
  ExamNavigationController.init();
});
