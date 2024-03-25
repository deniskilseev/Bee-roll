const url = 'http://localhost:3000/posts/2'; // Replace with your API endpoint
// const data = {
//     creatorId: 5,
//     forumId: 16,
//     postTitle: 'Hi, Im gay',
//     postText: 'Well, yeah. Coming out.'
// }; // Replace with the data you want to send

// Define request options
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Send the POST request
fetch(url, options)
    .then(response => {
        if (!response.ok) {
            console.log(response.error)
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('POST request succeeded with JSON response', data);
    })
    .catch(error => {
        console.error('Error making POST request:', error);
    });