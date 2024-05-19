###DJS03: BOOK CONNECT - ABSTRACTIONS

#Book Connect Refractoring

##Overview

This document outlines the factoring process for the "Book Connect" application. It highlights the changes made to improve maintainability, extenfibility, and readability by applying concepts of objects and functions for abstraction.

##Issues

**Code Duplication:**
Several parts of the code cotained repetitive blocks, making the codebase harder to maintain and update.

**Lack of Abstraction:**
The original code did not have adequately utilize objects and functins for abstraction, leading to a more complex and less flexible code structure.

**Event Handling:**
Event listeners were added inline, leading to potential issues with readability and maintainability.

**Theme Handling:**
Theme switching logic was embedded within multiple parts of the code, reducing readability and making future updates more complex.

**Select Options Population:**
The population of select elements for genres and authors was repetitive and not abstracted into reusable functions.

##Issues Addressed

**Code Duplication:**
Repetative code blocks were refactored into reusable functions, improving maintainability and readability.
      -Example: The code to create book preview elements was repeated multiple times. This was refractored into a single function `createBookPreview`.
     

    const createBookPreview = ({ author, id, image, title }) => {
       const element = document.createElement('button');
       element.classList = 'preview';
       element.setAttribute('data-preview', id);

    element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
      </div>
    `;

    return element;
    };

**Lack of Abstraction:**
I created functions and utilized objects to abstract and encapsulate code logic, making the codebase more modular and extendable.

**Event Handling:**
I organized the event listeners into clearly defined functions to enhance readability and maintainability.
      -Example: Event listeners were previously added directly within inline eventhandlers. SO now they are organized into functions.

    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false;
    });

    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
    });

**Theme Handling:**
Centralized theme switching logic into a dedicated function simplifying future modifications.
      -Example: Theme switching logic was scattered and is now centralized in the `setTheme` function.

    const setTheme = (theme) => {
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    };

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('night');
    } else {
    setTheme('day');
    }

**Select Options Population:**
I have abstracted the population of select options into a reusable functon, reducing redundancy.
      -Example: Previously, options for select elements were populated with repetitive code. This was refactored into the `populateSelect` function.

    const populateSelect = (select, options, defaultOption) => {
    const fragment = document.createDocumentFragment();
    const firstElement = document.createElement('option');
    firstElement.value = 'any';
    firstElement.innerText = defaultOption;
    fragment.appendChild(firstElement);

    for (const [id, name] of Object.entries(options)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    }

    select.appendChild(fragment);
    };

    populateSelect(document.querySelector('[data-search-genres]'), genres, 'All Genres');
    populateSelect(document.querySelector('[data-search-authors]'), authors, 'All Authors');


##Summary of the Refactoring Process
The refactoring process involved restructuring the codebase to incorporate the aforementioned improvements. The updated code now boats a modular structure with reusable functions, making it easier to understand, maintain and extend.
      
