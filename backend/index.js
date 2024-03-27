const url = 'http://localhost:3000/users/putUser/'; // Replace with your API endpoint
const data = {
    creatorId: 5,
    forumId: 16,
    postTitle: 'Hi, Im gay',
    postText: 'Well, yeah. Coming out.'
}; // Replace with the data you want to send

// Define request options
const options = {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
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