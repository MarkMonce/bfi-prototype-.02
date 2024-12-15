document.addEventListener("DOMContentLoaded", () => {
    console.log("unit_status_table.js: Script loaded and executing.");

    const handleTableUpdate = () => {
        const startDate = window.startDate || "Nov-41";
        const criteria = window.globalCriteria || [];
        console.log("Updating table with startDate:", startDate, "and criteria:", criteria);

        updateUnitStatusTable(startDate, criteria);
    };
    //recent change for treeview function
    window.addEventListener("criteriaChanged", handleTableUpdate);


    const updateUnitStatusTable = async (startDate, criteria = []) => {
        console.log("Fetching ship data...");
    
        let ships;
        try {
            const response = await fetch("shiptable.json");
            ships = await response.json();
            console.log("Fetched ship data:", ships);
        } catch (error) {
            console.error("Error fetching ship data:", error);
            return;
        }
    
        // Check if criteria are empty; render all ships by default
        if (criteria.length === 0) {
            console.warn("No criteria provided. Rendering all ships.");
        }
    
        // Normalize criteria for case-insensitive matching
        const normalizedCriteria = criteria.map(c => c.toLowerCase());
    
        // Filter ships based on criteria
        const filteredShips = ships.filter(ship => {
            const matchesUnitType = ship.UnitType && normalizedCriteria.includes(ship.UnitType.toLowerCase());
            const matchesSubType = ship.SubType && normalizedCriteria.includes(ship.SubType.toLowerCase());
            const matchesClass = ship.Class && normalizedCriteria.includes(ship.Class.toLowerCase());
            const matchesExactID = ship.ID && normalizedCriteria.includes(ship.ID.toLowerCase()); // Exact match for ID
            const matchesExactName = ship.Name && normalizedCriteria.includes(ship.Name.toLowerCase()); // Exact match for Name
    
            // Return true if any criterion matches or criteria are empty (render all ships)
            return (
                normalizedCriteria.length === 0 || // Show all ships if no criteria
                matchesUnitType || 
                matchesSubType || 
                matchesClass || 
                matchesExactID || 
                matchesExactName
            );
        });
    
        console.log("Filtered ships:", filteredShips);
    
        // Get unit status table container
        const unitStatusTableContainer = document.getElementById("mainSection__unitStatusTable");
        if (!unitStatusTableContainer) {
            console.error("Container for unit status table not found.");
            return;
        }
        unitStatusTableContainer.innerHTML = ""; // Clear previous content
    
        // If no ships match, show a message
        if (filteredShips.length === 0) {
            unitStatusTableContainer.innerHTML = "<p>No ships match the selected criteria or date range.</p>";
            console.warn("No ships matched the criteria.");
            return;
        }
    
        // Generate the table
        const table = document.createElement("table");
        table.classList.add("unit-status-table");
    
        // Create table header
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th class="id-column">Ship ID</th>
            <th class="name-column">Ship Name</th>
        `;
    
        // Add month columns based on startDate
        const [startMonth, startYear] = startDate.split("-");
        const startMonthIndex = new Date(`${startMonth} 1, 2000`).getMonth();
        const startYearFull = parseInt(`20${startYear}`, 10);
        const months = [];
        for (let i = 0; i < 12; i++) {
            const currentDate = new Date(startYearFull, startMonthIndex + i);
            const monthKey = `${currentDate.toLocaleString("default", { month: "short" })}-${currentDate.getFullYear().toString().slice(-2)}`;
            months.push(monthKey);
            const th = document.createElement("th");
            th.textContent = monthKey;
            th.classList.add("month-column");
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);
    
        // Populate table rows
        filteredShips.forEach(ship => {
            const { ID, Name, MonthlyStatus } = ship;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="id-column">${ID}</td>
                <td class="name-column">${Name}</td>
            `;
            months.forEach(monthKey => {
                const cell = document.createElement("td");
                cell.classList.add("month-column");
                if (MonthlyStatus && MonthlyStatus[monthKey]) {
                    const { code, details } = MonthlyStatus[monthKey];
                    cell.classList.add(`color-${code}`);
                    cell.title = details || "No details available";
                } else {
                    cell.classList.add("color-9");
                    cell.title = "No event for this month";
                }
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
    
        unitStatusTableContainer.appendChild(table);
        console.log("Table rendered successfully.");
    };
    
    
    // Event listener to update the table on criteria change
    document.getElementById("searchButton").addEventListener("click", () => {
        const startDate = window.startDate || "Nov-41";
        const criteria = window.globalCriteria || [];
        updateUnitStatusTable(startDate, criteria);
        console.log("Search triggered with criteria:", criteria);
    });
    
    

    // Attach event listeners
    console.log("unit_status_table.js: Adding event listeners.");
    window.addEventListener("startDateChanged", handleTableUpdate);
    window.addEventListener("criteriaChanged", handleTableUpdate);

    console.log("unit_status_table.js: Calling handleTableUpdate on page load.");
    handleTableUpdate(); // Trigger table rendering on initial load
});
