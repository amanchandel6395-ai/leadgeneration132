async function searchNow(page = 1) {
    const query = document.getElementById("searchInput").value;
    if (!query) return alert("Please enter a keyword!");

    try {
        // Backend API call
        const response = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}&page=${page}`);
        const data = await response.json();

        const resultsDiv = document.getElementById("results");
        const paginationDiv = document.getElementById("pagination");
        resultsDiv.innerHTML = "";
        paginationDiv.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            resultsDiv.innerHTML = "<p>No results found</p>";
            return;
        }

        // Show results
        data.results.forEach(item => {
            resultsDiv.innerHTML += `
                <div class="result-card">
                    <h3>${item.title}</h3>
                    <p>${item.snippet}</p>
                    <a href="${item.link}" target="_blank">Open Link</a>
                </div>
            `;
        });

        // Pagination buttons
        paginationDiv.innerHTML = `
            <button onclick="searchNow(${page - 1})" ${page == 1 ? 'disabled' : ''}>Previous</button>
            <button onclick="searchNow(${page + 1})" ${data.hasMore ? '' : 'disabled'}>Next</button>
        `;

    } catch (err) {
        console.error(err);
        alert("Something went wrong. Check backend console.");
    }
}
