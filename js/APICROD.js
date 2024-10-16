async function getAllBooks() {
    let books = []
    for (let index = 0; index < 5; index++) {
        const book = await getOneBook(index)
        books.push(book)
    }
    return books; 
}
async function getOneBook(index) {
    try {
        const response = await fetch(`http://localhost:3000/${index}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const book = await response.json(); // Parse the JSON
        console.log(book);

        return book; 
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}


// async function displayBooks() {

//     const books = await getAllBooks()
//     const bookList = document.getElementById('bookList');
//     if (books && books.length > 0) {
//         books.forEach(book => {
//             const bookItem = document.createElement('div');
//             bookItem.classList.add('book-item');

//             bookItem.innerHTML = `
//         <div class="book-id">${book.id}</div>
//         <div class="book-image"><img src="${book.image_routing}" alt="${book.title}"></div>
//         <div class="book-title">${book.title}</div>
//         <div class="book-price">$${book.price.toFixed(2)}</div>
//         <div class="book-availability">${book.action ? 'Available' : 'Out of stock'}</div>
//         <div class="book-rating">Rating: ${book.rate}</div>
//       `;

//             bookList.appendChild(bookItem);
//         });
//     } else {
//         bookList.innerHTML = '<p>No books available at the moment.</p>';
//     }
// }
