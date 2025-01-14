console.log("Script loaded successfully");

    function showSection(sectionId) {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = "none"; // Hide all sections
        });
        const activeSection = document.getElementById(sectionId);
        activeSection.classList.add('active');
        activeSection.style.display = "block"; // Show only the selected section

        // Reset search filter when changing sections
        const details = activeSection.querySelectorAll('details');
        details.forEach(detail => {
            detail.style.display = "block"; // Show all items in the new section
        });
        document.getElementById('searchBox').value = ""; // Clear search box
    }

function searchModules() {
    const query = document.getElementById('searchBox').value.toLowerCase().trim();
    const sections = document.querySelectorAll('section'); // Get all sections
    let matchFound = false;

    sections.forEach(section => {
        const details = section.querySelectorAll('details');
        let sectionMatch = false;

        details.forEach(detail => {
            const summaryElement = detail.querySelector('summary');
            const contentElement = detail.querySelector('p');
            const listItems = detail.querySelectorAll('li'); // Include <li> elements

            const originalSummaryText = summaryElement?.getAttribute('data-original-text') || summaryElement?.textContent;
            const originalContentText = contentElement?.getAttribute('data-original-text') || contentElement?.textContent;

            // Save original text as an attribute if not already saved
            if (!summaryElement.hasAttribute('data-original-text')) {
                summaryElement.setAttribute('data-original-text', originalSummaryText);
            }
            if (contentElement && !contentElement.hasAttribute('data-original-text')) {
                contentElement.setAttribute('data-original-text', originalContentText);
            }

            // Restore original text before applying highlights
            if (summaryElement) summaryElement.innerHTML = originalSummaryText;
            if (contentElement) contentElement.innerHTML = originalContentText;

            // Highlight matches in list items
            let listMatch = false;
            listItems.forEach(li => {
                const originalLiText = li.getAttribute('data-original-text') || li.textContent;
                if (!li.hasAttribute('data-original-text')) {
                    li.setAttribute('data-original-text', originalLiText);
                }
                li.innerHTML = originalLiText; // Reset to original
                if (originalLiText.toLowerCase().includes(query)) {
                    li.innerHTML = highlightText(originalLiText, query); // Highlight match
                    listMatch = true;
                    sectionMatch = true;
                    matchFound = true;
                }
            });

            // Check for matches in summary or content
            if (originalSummaryText.toLowerCase().includes(query) || originalContentText.toLowerCase().includes(query) || listMatch) {
                detail.style.display = 'block'; // Show matching module
                sectionMatch = true;
                matchFound = true;

                // Highlight matching text
                if (summaryElement) {
                    summaryElement.innerHTML = highlightText(originalSummaryText, query);
                }
                if (contentElement) {
                    contentElement.innerHTML = highlightText(originalContentText, query);
                }
            } else {
                detail.style.display = 'none'; // Hide non-matching module
            }
        });

        // Show or hide section based on matches
        section.style.display = sectionMatch ? 'block' : 'none';
    });

    // Handle "no results" message
    const noResultsMessage = document.getElementById('noResults');
    if (!matchFound) {
        if (!noResultsMessage) {
            const message = document.createElement('p');
            message.id = 'noResults';
            message.style.color = '#c792ea';
            message.style.textAlign = 'center';
            message.textContent = 'No matching modules found.';
            document.body.appendChild(message);
        }
    } else {
        const existingMessage = document.getElementById('noResults');
        if (existingMessage) existingMessage.remove();
    }
}

// Highlight function to wrap matching text
function highlightText(text, query) {
    if (!query) return text; // If no query, return the original text
    const regex = new RegExp(`(${query})`, 'gi'); // Create a regex for matching query
    return text.replace(regex, '<span style="background-color: #c792ea; color: #fff;">$1</span>');
}




let allDetailsOpen = false; // Tracks whether all details are currently open

function toggleAllDetails() {
    const allDetails = document.querySelectorAll('details'); // Select all <details> elements
    allDetails.forEach(detail => {
        detail.open = !allDetailsOpen; // Toggle open/close
    });

    // Update the button text based on the current state
    const toggleButton = document.getElementById('toggleAllButton');
    if (allDetailsOpen) {
        toggleButton.textContent = 'Open All Modules';
    } else {
        toggleButton.textContent = 'Close All Modules';
    }

    allDetailsOpen = !allDetailsOpen; // Update the state
}

    // Add listeners for both click and touch events
    const toggleButton = document.getElementById('toggleAllDetails');
    toggleButton.addEventListener('click', toggleAllDetails);
    toggleButton.addEventListener('touchstart', toggleAllDetails);

//Forum Scripts

fetch('http://localhost:3000/api/posts')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Use this data to display posts
    });


        const voteTracker = {};
        const posts = [];
        let showingTopRated = false;

function createPost() {
    const postTitle = document.getElementById('postTitle').value.trim();
    const postContent = document.getElementById('postContent').value.trim();

    if (postTitle === "" || postContent === "") {
        alert("Both title and content are required.");
        return;
    }

    fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent })
    })
    .then(response => response.json())
    .then(post => {
        console.log('Post created:', post);
        // Update the frontend with the new post
    });
}


function vote(postId, value) {
    fetch(`http://localhost:3000/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: value })
    })
    .then(response => response.json())
    .then(updatedPost => {
        console.log('Updated post:', updatedPost);
        // Update the frontend votes
    });
}



        function toggleSort() {
            const container = document.getElementById('forumPosts');
            const postElements = Array.from(container.querySelectorAll('.post'));

            if (showingTopRated) {
                // Show Newest Posts
                container.innerHTML = "";
                posts.forEach(post => container.appendChild(post));
            } else {
                // Show Top Rated Posts
                postElements.sort((a, b) => {
                    const votesA = parseInt(a.querySelector('.votes').textContent, 10) || 0;
                    const votesB = parseInt(b.querySelector('.votes').textContent, 10) || 0;
                    return votesB - votesA;
                });
                container.innerHTML = "";
                postElements.forEach(post => container.appendChild(post));
            }

            showingTopRated = !showingTopRated;
        }