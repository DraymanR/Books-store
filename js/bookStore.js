// // // document.addEventListener('DOMContentLoaded', displayBooks);
let booksCache = [];

function createHeaderRow() {


    const bookList = document.getElementById('bookList');
    const headerRow = document.createElement('div');
    headerRow.classList.add('book-header');
    headerRow.innerHTML = `
                <div>Book ID</div>
                <div>Title</div>
                <div>Price</div>
                <div>Availability</div>
                <div>Update</div>
                <div>Delete</div>
                <br>
                <button id="sortBook">sort  by price</button>
            `;

    bookList.appendChild(headerRow);
}

// Load books from localStorage or fetch from JSON
async function getAllBooks() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        booksCache = JSON.parse(storedBooks);
    } else {
        try {
            const response = await fetch('../myDB/bd.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            booksCache = await response.json();
            localStorage.setItem('books', JSON.stringify(booksCache));
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }
    return booksCache;
}

// Function to delete a book
function deleteBook(bookId) {
    booksCache = booksCache.filter(book => book.id !== bookId);
    localStorage.setItem('books', JSON.stringify(booksCache));
    displayBooks();
}

// Function to add a new book
function addBook() {
    console.log("addook()");

    const id = parseInt(document.getElementById('bookId').value);
    const title = document.getElementById('bookTitle').value;
    const price = parseFloat(document.getElementById('bookPrice').value);
    const image = document.getElementById('bookImage').value;
    const availability = document.getElementById('bookAvailability').checked;
    const rating = parseFloat(document.getElementById('bookRating').value);

    if (isNaN(price)) {
        alert('Please enter a valid price.');
        return;
    }

    // Check if the ID already exists
    if (booksCache.length > 0) {
        if (booksCache.some(book => book.id === id)) {
            alert('A book with this ID already exists. Please enter a different ID.');
            return;
        }
    }

    const newBook = {
        id,
        title,
        price,
        action: availability,
        image_routing: image,
        rate: rating
    };

    booksCache.push(newBook);
    localStorage.setItem('books', JSON.stringify(booksCache));
    displayBooks();

    // Clear input fields
    clearInputFields();
    hideAddBookCard();
}

// Function to update the book details
function updateBook(bookId) {
    const id = parseInt(document.getElementById('bookId').value);
    const title = document.getElementById('bookTitle').value;
    const price = parseFloat(document.getElementById('bookPrice').value);
    const image = document.getElementById('bookImage').value;
    const availability = document.getElementById('bookAvailability').checked;
    const rating = parseFloat(document.getElementById('bookRating').value);

    if (isNaN(price)) {
        alert('Please enter a valid price.');
        return;
    }

    // Check if the ID already exists and is not the same book being edited
    const existingBook = booksCache.find(book => book.id === id);
    if (existingBook && existingBook.id !== bookId) {
        alert('A book with this ID already exists. Please enter a different ID.');
        return;
    }

    // Find the book in the cache and update its details
    const bookIndex = booksCache.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        booksCache[bookIndex] = {
            id,
            title,
            price,
            action: availability,
            image_routing: image,
            rate: rating
        };
        localStorage.setItem('books', JSON.stringify(booksCache));
        displayBooks();
        clearInputFields();
        hideAddBookCard();
    }
}

// Function to show the add/edit book card
function showAddBookCard() {
    hideAddBookButton()
    document.getElementById('addBookCard').style.display = 'block';
}

// Function to hide the add book card
function hideAddBookCard() {
    document.getElementById('addBookCard').style.display = 'none';
    showAddBookButton()
}

function showAddBookButton() {
    document.getElementById('showFormButton').style.display = 'block';
}

function hideAddBookButton() {
    document.getElementById('showFormButton').style.display = 'none';
}

// Function to clear input fields
function clearInputFields() {
    document.getElementById('bookId').value = '';
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookPrice').value = '';
    document.getElementById('bookImage').value = '';
    document.getElementById('bookAvailability').checked = true;
    document.getElementById('bookRating').value = '';

    const addBookButton = document.getElementById('addBookButton');
    addBookButton.setAttribute('data-id', NaN);
    addBookButton.textContent = 'add Book';
}

// Function to populate the edit form with book details
function populateEditForm(book) {
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookPrice').value = book.price;
    document.getElementById('bookImage').value = book.image_routing;
    document.getElementById('bookAvailability').checked = book.action;
    document.getElementById('bookRating').value = book.rate;

    // Set a data attribute on the add button to identify which book is being edited
    const addBookButton = document.getElementById('addBookButton');
    addBookButton.setAttribute('data-id', book.id);
    addBookButton.textContent = 'Update Book';
    showAddBookCard();
}

function sortByProperty(property, isAscending = true) {
    booksCache.sort((a, b) => {
        if (a[property] < b[property]) return isAscending ? -1 : 1;
        if (a[property] > b[property]) return isAscending ? 1 : -1;
        return 0;
    });
}


async function displayBooks() {
    const books = await getAllBooks();
    const bookList = document.getElementById('bookList')
    bookList.innerHTML = '';

    createHeaderRow();

    // Add the sort button listener after creating the header row
    const sortButton = document.getElementById('sortBook');
    if (sortButton) {
        sortButton.addEventListener('click', function () {
            sortByProperty("price"); // Sort booksCache by price in ascending order
            localStorage.setItem('books', JSON.stringify(booksCache)); // Update localStorage
            displayBooks(); // Re-display sorted books
        });
    }
    if (books && books.length > 0) {
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');

            bookItem.innerHTML = `
                <div class="book-id">${book.id}</div>
                <div class="book-title">${book.title}</div>
                <div class="book-price">$${book.price.toFixed(2)}</div>
                <div class="book-availability">${book.action ? 'Available' : 'Out of stock'}</div>
                <button class="edit-book" data-id="${book.id}">✏️</button>
                <button class="delete-book" data-id="${book.id}">🗑️</button>
            `;
            // Add event listeners for delete and edit functionality
            bookItem.querySelector('.delete-book').addEventListener('click', function () {
                deleteBook(book.id);
            });

            bookItem.querySelector('.edit-book').addEventListener('click', function () {
                populateEditForm(book);
            });

            // Add an event listener to show book details
            bookItem.addEventListener('click', function () {
                showBookDetails(book);
            });

            bookList.appendChild(bookItem);
        });
    } else {
        bookList.innerHTML = '<p>No books available at the moment.</p>';
    }
}

// Function to show book details in the right panel
function showBookDetails(book) {
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `
        <h3>${book.title}</h3>
        <img src="${book.image_routing}" alt="${book.title}" style="width: 100%; height: auto;">
        <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
        <p><strong>Availability:</strong> ${book.action ? 'Available' : 'Out of stock'}</p>
        <p><strong>Rating:</strong> ${book.rate}</p>
    `;
}

// Initialize the display
async function initialize() {
    await getAllBooks();
    displayBooks();
}

// Call the initialize function to load books on page load
initialize();

// Event listeners for the add/update button
document.getElementById('showFormButton').addEventListener('click', showAddBookCard);

const addBookButton = document.getElementById('addBookButton');
addBookButton.addEventListener('click', function () {
    const bookId = parseInt(addBookButton.getAttribute('data-id'));
    if (isNaN(bookId)) {
        addBook();
    } else {
        updateBook(bookId);
    }

});

// Cancel button to hide the form
document.getElementById('cancelButton').addEventListener('click', function () {
    hideAddBookCard();
    clearInputFields();
});

