const HIDDEN_COLUMNS = ['UnitType', 'SubType', 'Class'];


function filterShips(data, searchTerms) {
    if (searchTerms.length === 0) return data; // Return all data if no search terms are provided

    return data.filter(item => {
        // Explicitly match search terms to specific fields
        return searchTerms.some(term => 
            (item.SubType && item.SubType.toUpperCase() === term.toUpperCase()) || 
            (item.UnitType && item.UnitType.toUpperCase() === term.toUpperCase()) ||
            (item.Class && item.Class.toUpperCase() === term.toUpperCase())
        );
    });
}

function generateTable(data) {
    // Create table
    const table = document.createElement('table');
    table.border = "1";

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Add headers dynamically based on keys, excluding hidden columns
    if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
            if (!HIDDEN_COLUMNS.includes(key)) {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            }
        });
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.entries(row).forEach(([key, value]) => {
            if (!HIDDEN_COLUMNS.includes(key)) {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            }
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Append table to the body or a specific div
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous results
    outputDiv.appendChild(table);
}


function loadAndFilterTable(searchCriteria = []) {
    fetch('shipTable.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Table JSON data successfully loaded:", data);

            // If no search criteria, return full table
            const filteredData = searchCriteria.length > 0 ? filterShips(data, searchCriteria) : data;

            // Generate and display the table
            generateTable(filteredData);
        })
        .catch(error => {
            console.error("Error loading table JSON:", error);
            // alert("An error occurred while loading the table data.");
            console.log("Debug: ", globalCriteria);
        });
}

// Ensure table loads on initial page load with all records
document.addEventListener('DOMContentLoaded', () => {
    loadAndFilterTable(); // Load all records initially
});

document.getElementById('searchButton').addEventListener('click', () => {
    const checkedItems = Array.from(
        document.querySelectorAll('.searchtree input[type="checkbox"]:checked')
    );

    const selectedCriteria = checkedItems.map(checkbox => checkbox.parentElement.textContent.trim());
    const additionalCriteriaInput = document.getElementById('additionalCriteria').value;
    const additionalCriteria = additionalCriteriaInput
        ? additionalCriteriaInput.split(',').map(item => item.trim()).filter(item => item)
        : [];

    const globalCriteria = [...selectedCriteria, ...additionalCriteria];

    // Ensure full table is shown if no criteria are selected
    if (globalCriteria.length === 0) {
        loadAndFilterTable(); // Load all records
    } else {
        loadAndFilterTable(globalCriteria);
    }
});