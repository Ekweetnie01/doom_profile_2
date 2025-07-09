# Doom Slayer Profile Creator - A Web Dev Learning Journey

Welcome to the Doom Slayer Profile Creator! This project is a hands-on exercise for learning the fundamentals of web development, including HTML, CSS, and JavaScript. You'll build a simple, themed web application where you can create your own Doom Slayer character.

## Project Overview

This project is designed to be a fun, interactive way to apply your web development knowledge. Each file has a specific role in bringing the application to life.

### Core Files

*   **`Index.html`**: The landing page of the application. This file contains the initial login form that welcomes the "Slayer" and asks for their name before they can proceed.

*   **`arsenal.html`**: After logging in, the user is taken here to select their primary weapon from a dynamic grid. The choice is saved for the next step.

*   **`create.html`**: The main page for character creation. It includes a form to input your Slayer's details, such as name, age, gender, and a short bio. It also features a power level calculator and displays the weapon chosen on the previous page.

*   **`style.css`**: The stylesheet for the project. It provides the Doom-inspired aesthetic, including the color scheme, fonts, and layout for all HTML files.

*   **`login.js`**: This script handles the logic for the login form on `Index.html`. It captures the username entered by the user and stores it in the browser's session storage before redirecting to the arsenal page.

*   **`arsenal.js`**: This script populates the weapon grid on `arsenal.html`, handles weapon selection, and saves the choice to session storage before proceeding to the creation page.

*   **`slayer-script.js`**: This is the primary script for the `create.html` page. It handles:
    *   Displaying the username and selected weapon from previous steps.
    *   Validating the character creation form.
    *   Calculating the Slayer's power level based on their age.
    *   Dynamically updating the page with the calculated stats.
    *   A character counter for the biography field.

### Assets

*   **`public/`**: This directory contains all the static assets for the project, such as images for the background and character profiles.

## How to Use

1.  Open the `Index.html` file in your web browser.
2.  Enter a username and password and click the "Continue to Creation" button.
3.  You will be redirected to `arsenal.html` to choose your weapon.
4.  Click "Continue to Creation" to proceed to the final step.
4.  Fill out the character creation form.
5.  Use the "Calculate Stats" button to see your Slayer's power level.

## Learning Exercises

This section is for you to document your learning journey. Each day, as you learn a new concept, you can add a new exercise here.

**Day 1: HTML Basics**
*   [ ] Create the basic structure of `Index.html` and `create.html`.
*   [ ] Add headings, paragraphs, and form elements.

**Day 2: CSS Styling**
*   [ ] Link `style.css` to the HTML files.
*   [ ] Use CSS to style the pages with a Doom-inspired theme.
*   [ ] Learn about selectors, properties, and values.

**Day 3: JavaScript Fundamentals**
*   [ ] Create the `login.js` and `slayer-script.js` files.
*   [ ] Use JavaScript to handle form submissions and user interactions.
*   [ ] Learn about variables, functions, and DOM manipulation.
