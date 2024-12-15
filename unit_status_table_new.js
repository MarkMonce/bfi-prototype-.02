window.addEventListener("criteriaChanged", () => {
    if (window.startDate && globalCriteria) {
        updateUnitStatusTable(window.startDate, globalCriteria);
    }
});

const updateUnitStatusTable = async (startDate, criteria = []) => {
    console.log("unit_status_table.js: Updating table with startDate:", startDate, "and criteria:", criteria);

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

    // Filter ships based on criteria
    const filteredShips = criteria.length
        ? ships.filter(ship => criteria.some(criterion => ship.UnitType === criterion || ship.Name.includes(criterion)))
        : ships;

    // Clear the container and rebuild the table
    unitStatusTableContainer.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add("unit-status-table");

    // Create header and rows (existing logic)
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th class="id-column">Ship ID</th>
        <th class="name-column">Ship Name</th>
    `;
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
            if (MonthlyStatus[monthKey]) {
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
};
