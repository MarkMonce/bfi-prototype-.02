document.addEventListener("DOMContentLoaded", () => {
    const unitStatusTableContainer = document.getElementById("mainSection__unitStatusTable");
    if (!unitStatusTableContainer) {
        console.error("unit_status_table.js: No container with id 'mainSection__unitStatusTable' found!");
        return;
    }

    const updateUnitStatusTable = async (startDate) => {
        console.log("unit_status_table.js: Updating table with startDate:", startDate);

        // Fetch the ship data
        let ships;
        try {
            const response = await fetch("shiptable.json");
            ships = await response.json();
            console.log("unit_status_table.js: Ship data loaded:", ships);
        } catch (error) {
            console.error("unit_status_table.js: Failed to fetch ship data:", error);
            return;
        }

        // Clear the container
        unitStatusTableContainer.innerHTML = "";

        // Create the table
        const table = document.createElement("table");
        table.classList.add("unit-status-table");

        // Create the table header
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th class="id-column">Ship ID</th>
            <th class="name-column">Ship Name</th>
        `;
        // Add a column for each month in the date range
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

        // Create rows for each ship
        ships.forEach(ship => {
            const { ID, Name, MonthlyStatus } = ship;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="id-column">${ID}</td>
                <td class="name-column">${Name}</td>
            `;
            // Add a cell for each month's status code
            months.forEach(monthKey => {
                const cell = document.createElement("td");
                cell.classList.add("month-column");
                if (MonthlyStatus[monthKey]) {
                    const { code, details } = MonthlyStatus[monthKey];
                    cell.classList.add(`color-${code}`); // Set background color based on code
                    cell.title = details || "No details available"; // Tooltip for details
                } else {
                    cell.classList.add("color-9"); // Default color for empty months
                    cell.title = "No event for this month"; // Tooltip for empty cells
                }
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        // Append the table to the container
        unitStatusTableContainer.appendChild(table);
    };

    // Listen for startDate changes
    window.addEventListener("startDateChanged", () => {
        if (window.startDate) {
            updateUnitStatusTable(window.startDate);
        }
    });

    // Initial load with the current startDate
    if (window.startDate) {
        updateUnitStatusTable(window.startDate);
    }
});
