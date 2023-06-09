const navbar = document.querySelector("#nav");
const navBtn = document.querySelector("#nav-btn");
const closeBtn = document.querySelector("#close-btn");
const sidebar = document.querySelector("#sidebar");

//! ############### toggle 'navbar-fixed' class on the navbar ###############
// This code dynamically toggles the 'navbar-fixed' class on the navbar
// based on the scroll position and total page content height. It makes
// the navbar fixed when the page has enough content and the user scrolls
// beyond a certain point, and reverts to the default position otherwise.

// function to check if the body has enough content to scroll
function hasEnoughContent() {
  // check if the total height of the body is greater than the window height + 200
  return document.body.scrollHeight >= window.innerHeight + 200;
}

// function to check if the user has scrolled past a certain threshold
function isScrollPastThreshold() {
  // check if the user has scrolled down more than 80px
  return window.pageYOffset >= 80;
}

// function to check if the user is at the top of the page
function isAtTopOfPage() {
  // check if the user is at the very top of the page
  return window.pageYOffset === 0;
}

// function to add or remove 'navbar-fixed' class based on scroll position
function toggleNavbarFixed() {
  // if there is enough content to scroll
  if (hasEnoughContent()) {
    // if user has scrolled past the threshold, add the class
    if (isScrollPastThreshold()) {
      navbar.classList.add("navbar-fixed");
    }
    // if the user has not scrolled past the threshold, remove the class
    else {
      navbar.classList.remove("navbar-fixed");
    }
  }
  // if there is not enough content to scroll and the user is at the top of the page, remove the class
  else if (isAtTopOfPage()) {
    navbar.classList.remove("navbar-fixed");
  }
}

//* EVENT * add scroll event listener to the window
window.addEventListener("scroll", toggleNavbarFixed);

//! ############### show sidebar ###############
navBtn.addEventListener("click", function () {
  sidebar.classList.add("show-sidebar");
});
closeBtn.addEventListener("click", function () {
  sidebar.classList.remove("show-sidebar");
});

//! ############### set year for the footer ###############
const date = document.querySelector("#date");
date.innerHTML = new Date().getFullYear();

//! ############### animate the skill bars and their corresponding percentage text when they come into view ###############
const skillValues = document.querySelectorAll(".skill-value");
const skillTexts = document.querySelectorAll(".skill-text");

// set custom CSS variables on each element based on their data attributes.
function setAnimationEndValue() {
  // iterate through each skillValue element.
  skillValues.forEach((skillValue) => {
    // retrieve the skill level from the data attribute.
    const skillLevel = skillValue.getAttribute("data-skill-level");
    // set the custom CSS variable for skillValue using the retrieved skill level.
    skillValue.style.setProperty("--skill-level", `${skillLevel}%`);

    // select the skillText sibling element of the current skillValue.
    const skillText = skillValue.nextElementSibling;
    // set the custom CSS variable for skillText using the same skill level.
    skillText.style.setProperty("--skill-level", `${skillLevel}%`);

    // animate the percentage text in the skillText element based on the skillValue.
    animatePercentages(skillValue, skillText, skillLevel);
  });
}

function animatePercentages(skillValue, skillText, skillLevel) {
  // retrieve the current width of the skillValue bar and parse it as a number (removing the "px" unit).
  const skillValueWidth = parseFloat(window.getComputedStyle(skillValue).width);

  // retrieve the total width of the skillValue's parent container and parse it as a number (removing the "px" unit).
  const skillContainerWidth = parseFloat(
    window.getComputedStyle(skillValue.parentElement).width
  );

  // calculate the current percentage of the skillValue bar.
  const currentPercentage = Math.round(
    (skillValueWidth / skillContainerWidth) * 100
  );

  // update the skillText element's content with the current percentage value and a % symbol appended to it.
  skillText.textContent = `${currentPercentage}%`;

  // if the current percentage is less than the desired skill level,
  // continue updating the skillText by recursively invoking the animatePercentages function using requestAnimationFrame.
  if (currentPercentage < skillLevel) {
    requestAnimationFrame(() =>
      animatePercentages(skillValue, skillText, skillLevel)
    );
  }
}

// toggles a CSS class on a single element or a NodeList of elements.
function toggleCSSClass(target, action, cssClass) {
  // convert action to lowercase and determine if it's an "add" or "remove" action.
  const isAddAction = action.toLowerCase() === "add";
  const isRemoveAction = action.toLowerCase() === "remove";

  // check if the target is a NodeList.
  if (target instanceof NodeList) {
    // iterate through each element in the NodeList.
    target.forEach((element) => {
      // perform the add or remove action as specified.
      if (isAddAction) {
        element.classList.add(cssClass);
      } else if (isRemoveAction) {
        element.classList.remove(cssClass);
      }
    });
  } else {
    // the target is a single HTMLElement.
    // perform the add or remove action as specified.
    if (isAddAction) {
      target.classList.add(cssClass);
    } else if (isRemoveAction) {
      target.classList.remove(cssClass);
    }
  }
}

// intialize an IntersectionObserver to detect when the skills section comes into view.
// when the section is at least 40% visible, set the animation end values for skill bars and skill text,
// and add the animation classes to start the skill bar and text animations.
// when the section is completely out of view, remove the animation classes to reset the animations.
const observer = new IntersectionObserver(
  (entries) => {
    // grab only 1 entry, since we only have one target section.
    const entry = entries[0];
    if (entry.intersectionRatio >= 0.4) {
      // set the animation end values for skill bars, skill text,
      // and invoke requestAnimationFrame to prepare for the animations.
      setAnimationEndValue();
      // add the animation classes to start the skill bar and skill text animations.
      toggleCSSClass(skillValues, "add", "skill-value-animate");
      toggleCSSClass(skillTexts, "add", "skill-text-animate");
    } else if (entry.intersectionRatio === 0) {
      // remove the animation classes to reset the skill bar and text animations when the section is completely out of view.
      toggleCSSClass(skillValues, "remove", "skill-value-animate");
      toggleCSSClass(skillTexts, "remove", "skill-text-animate");
    }
  },
  // set the observer's threshold to trigger callbacks at 0% (completely out of view) and 40% visibility.
  { threshold: [0, 0.4] }
);

const skillsSection = document.querySelector(".skills");

//* EVENT * start observing the skillsSection, waiting for it to come into view to trigger the skill bar and text animations.
observer.observe(skillsSection);
