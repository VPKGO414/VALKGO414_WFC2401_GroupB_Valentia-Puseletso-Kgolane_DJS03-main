import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

// Function to create book preview elements
const createBookPreview = ({ author, id, image, tittle}) => {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
       <img class="preview__image" src="${image}" />
       <div class="preview__info">
           <h3 class="preview__title">${title}<?h3>
           <div class="preview__author">${authors[author]}<?div>
       </div>
    `;

    return element;
};

// Initial book preview rendering
const starting = document.createDocumentFragment();
for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
    starting.appendChild(createBookPreview(book));
}
document.querySelector('{data-list-items]').appendChild(starting);
// Function to create and append options to a select element
const populateSelect = (select, options, defaultOption) => {
    const fragment = document.createDocumentFragment();
    const firstElement = document.createElement('option');
    firstElement.value = 'any';
    firstElement.innerText = defaultOption;
    fragment.appendChild(firstElement);

    for (const [id, name] of Object.entries('options')) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    }

    select.appendChild(fragment);
};

populateSelect(document.querySelector('[data-search-genres]'), genres, 'All Genres');
populateSelect(document.querySelector('[data-search-authors]'), authors, 'All Authors');

// Theme handling
const setTheme = (theme) => {
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
};

const prefersDarkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.querySelector('[data-setteings-theme]').value = prefersDarkScheme ? 'night' : 'day';
setTheme(prefersDarkScheme ? 'night' :  'day');

// Update "Show more" button text and state
const updateShowMoreButton = () => {
    const remaining  = matches.length - (page * BOOKS_PER_PAGE);
    const button = document.querySelector('[data-list-button]');
    button.innerText = `show more (${remaining})`;
    button.disabled = remaining <= 0;

    button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining">(${remaining})</span>
    `;
};
updateShowMoreButton();

// Event listeners for various interactions
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-setting-overlay]').open = true;
});

document.querySelector('[data-list-close]').addEventListerner('click', () => {
    document.querySelector('[data-list-active]').open = false;
});

document.querySelector('[data-settings-form]').addEventListener('submit', (events) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    setTheme(theme);
    document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-serach-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genre.invludes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return genreMatch && titleMatch && authorMatch;
    });

    page = 1;
    matches = result;
    document.querySelector('[data-list-message]').classlist.toggle('list__message_show', result.length < 1);

    const newItems = document.creatDocumentFragment();
    for (const book of result.slice(0, BOOK_PER_PAGE)) {
        newItems.appendChild(createBookPreview(book));
    }
    document.querySelector('[data-list-items]').innerHTML = '';
    document.querySelector('[data-list-items]').appenChild(newItems);

    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment();
    const start = page * BOOKS_PER_PAGE;
    const end = (page + 1) * BOOKS_PER_PAGE;

    for (const book of matches.slice(start, end)) {
        fragment.appendChild(createBookPreview(book));
    }
    
    document.querySelector('[data-list-items]').appendChild(fragment);
    page  += 1;
    updateShowMoreButton();
});

document.querSelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.composedPath());
    let active = null;

    for (const node of pathArray) {
        if (node?.dataset?.preview) {
            active = books.find(book => book.id === node.dataset.preview);
            break;
        }
    }

    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})
