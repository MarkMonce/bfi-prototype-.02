document.addEventListener("DOMContentLoaded", () => {
    // const DEFAULT_START_DATE = "Jan-42"; // Commented out for testing purposes

    const container = document.getElementById('timelineContainer');
    if (!container) {
        console.error("portable_timeline_maker.js: No container with id 'timelineContainer' found!");
        return;
    }

    let timeline, tableBody, events = [];

    const createTimelineStructure = () => {
        container.innerHTML = ""; // Clear the container to avoid duplicates
        timeline = document.createElement("div");
        timeline.classList.add("line");
        container.appendChild(timeline);

        const tableElement = document.createElement("table");
        tableBody = document.createElement("tbody");
        tableBody.innerHTML = `<tr>${'<td></td>'.repeat(12)}</tr>`;
        tableElement.appendChild(tableBody);
        container.appendChild(tableElement);

        console.log("portable_timeline_maker.js: Timeline structure created.");
    };

    const parseStartDate = (input) => {
        const [shortMonth, shortYear] = input.split("-");
        const year = parseInt(shortYear, 10) + 1900;
        const monthIndex = new Date(`${shortMonth} 1, 2000`).getMonth();
        return new Date(year, monthIndex, 1);
    };

    const generateMonthMap = (startDate) => {
        console.log("portable_timeline_maker.js: Generating month map for startDate:", startDate);
        const start = parseStartDate(startDate);
        const map = {};
        for (let i = 0; i < 12; i++) {
            const month = new Date(start.getFullYear(), start.getMonth() + i, 1);
            const key = `${month.toLocaleString('default', { month: 'short' })}-${month.getFullYear().toString().slice(-2)}`;
            map[key] = i;
        }
        console.log("portable_timeline_maker.js: Month map generated:", map);
        return map;
    };

    const loadEvents = async (startDate) => {
        console.log("portable_timeline_maker.js: Loading events with startDate:", startDate);

        createTimelineStructure();
        const monthMap = generateMonthMap(startDate);

        try {
            const response = await fetch("sample_events.json");
            events = await response.json();
            console.log("portable_timeline_maker.js: Events loaded:", events);
        } catch (error) {
            console.warn("portable_timeline_maker.js: Could not load events. Proceeding with an empty timeline.");
        }

        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event["exact date"]);
            const start = parseStartDate(startDate);
            return (
                eventDate >= start &&
                eventDate < new Date(start.getFullYear(), start.getMonth() + 12)
            );
        });

        renderCircles(filteredEvents, monthMap);
        console.log("portable_timeline_maker.js: Circles rendered.");
    };

    const renderCircles = (events, monthMap) => {
        timeline.innerHTML = ""; // Clear existing circles
        clearTable(); // Clear table contents to prevent duplication

        events.forEach(event => {
            const eventDate = new Date(event["exact date"]);
            const monthKey = `${eventDate.toLocaleString('default', { month: 'short' })}-${eventDate.getFullYear().toString().slice(-2)}`;
            const columnIndex = monthMap[monthKey];
            if (columnIndex === undefined) return;

            const { details } = event;
            const rows = tableBody.querySelectorAll("tr");
            let targetCell = null;

            for (const row of rows) {
                const cell = row.children[columnIndex];
                if (!cell.textContent) {
                    targetCell = cell;
                    break;
                }
            }

            if (!targetCell) {
                const newRow = document.createElement("tr");
                for (let i = 0; i < 12; i++) {
                    newRow.appendChild(document.createElement("td"));
                }
                tableBody.appendChild(newRow);
                targetCell = newRow.children[columnIndex];
            }

            if (targetCell) {
                targetCell.textContent = details;

                const cellRect = targetCell.getBoundingClientRect();
                const timelineRect = timeline.getBoundingClientRect();
                const positionInPixels = cellRect.left + cellRect.width / 2 - timelineRect.left;

                const newCircle = document.createElement("div");
                newCircle.classList.add("circle");
                newCircle.setAttribute("title", details);
                newCircle.style.left = `${positionInPixels}px`;
                timeline.appendChild(newCircle);
            }
        });
    };

    const clearTable = () => {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            Array.from(row.children).forEach(cell => {
                cell.textContent = ""; // Clear cell contents
            });
        });
    };

    // Listen for startDate changes
    window.addEventListener("startDateChanged", () => {
        console.log("portable_timeline_maker.js: startDateChanged event detected. New startDate:", window.startDate);
        if (window.startDate) {
            loadEvents(window.startDate);
        }
    });

    // Initial load with the startDate from date-control.js
    if (window.startDate) {
        console.log("portable_timeline_maker.js: Initial load with startDate:", window.startDate);
        loadEvents(window.startDate);
    }
});
