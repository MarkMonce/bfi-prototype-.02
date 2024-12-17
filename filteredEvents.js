document.addEventListener("DOMContentLoaded", () => {
    const eventsAndDetailsDiv = document.getElementById("mainSection__eventsAndDetails");
    eventsAndDetailsDiv.classList.add("events-details");

    // Function to update the combined search filters display
    const updateEventsAndDetails = () => {
        const startDate = window.startDate || "N/A";
        const criteria = window.globalCriteria || [];
        const selectedUnitText = window.selectedUnit
            ? `Ship ID: ${window.selectedUnit}`
            : "No unit selected";

        // Remove existing results container
        let resultsContainer = eventsAndDetailsDiv.querySelector(".results-container");
        if (resultsContainer) {
            resultsContainer.remove();
        }

        // Create a new results container
        resultsContainer = document.createElement("div");
        resultsContainer.classList.add("results-container");
        resultsContainer.style.cssText = "margin-bottom: 10px;";

        resultsContainer.innerHTML = `
            <div style="height: 75px; overflow-y: auto; border: 1px solid #ccc; padding: 2px; box-sizing: border-box;">
                <ul style="list-style-type: none; padding: 0; margin: 0;">
                    <li><strong>Start Date:</strong> ${startDate}</li>
                    <li><strong>Search Criteria:</strong>
                        <ul style="margin-left: 15px; list-style-type: disc;">
                            ${criteria.length > 0
                                ? criteria.map(item => `<li>${item}</li>`).join("")
                                : "<li>No criteria selected</li>"}
                        </ul>
                    </li>
                    <li><strong>Selected Unit:</strong> ${selectedUnitText}</li>
                </ul>
            </div>
        `;

        // Prepend the results container to ensure it's at the top
        eventsAndDetailsDiv.prepend(resultsContainer);

        // Call the function to add the sample events list
        addSampleEvents();
    };

    // Function to render the sample events list
    const addSampleEvents = () => {
        const sampleEvents = [
            { date: "December 7, 1941", location: "Pearl Harbor, Hawaii", details: "Surprise attack on the U.S. Pacific Fleet, leading to U.S. entry into World War II." },
            { date: "June 4-7, 1942", location: "Midway Atoll", details: "Decisive U.S. naval victory at Midway, shifting the momentum in the Pacific War." },
            { date: "August 7, 1942", location: "Guadalcanal", details: "Allied forces launch the first major offensive in the Pacific, securing the island after months of fighting." },
            { date: "October 23-26, 1944", location: "Leyte Gulf", details: "Largest naval battle in history, crippling the Japanese Navy." },
            { date: "February 19, 1945", location: "Iwo Jima", details: "U.S. Marines land on Iwo Jima, engaging in one of the fiercest battles of the war." }
        ];

        // Remove any existing sample events list
        let existingSampleEvents = eventsAndDetailsDiv.querySelector(".sample-events-list");
        if (existingSampleEvents) {
            existingSampleEvents.remove();
        }

        // Create a container for sample events
        const sampleEventsContainer = document.createElement("div");
        sampleEventsContainer.classList.add("sample-events-list");
        sampleEventsContainer.style.cssText = "margin-top: 15px;";

        const ul = document.createElement("ul");
        // ul.style.cssText = "list-style-type: none; padding: 0; margin: 0; font-family: 'Courier New', monospace; font-size: 12px; color: black;";
        ul.style.cssText = "list-style-type: none; padding: 0; margin: 0; font-family: 'Courier New', monospace; color: black;";

        // Populate the list with sample events
        sampleEvents.forEach(event => {
            const li = document.createElement("li");
            li.style.cssText = "margin-bottom: 10px;";
            li.innerHTML = `
                <strong>Date:</strong> ${event.date}<br>
                <strong>Location:</strong> ${event.location}<br>
                <strong>Details:</strong> ${event.details}
            `;
            ul.appendChild(li);
        });

        sampleEventsContainer.appendChild(ul);

        // Append the sample events container below the results
        eventsAndDetailsDiv.appendChild(sampleEventsContainer);
    };

    // Event delegation for table clicks (updates Selected Unit)
    const unitStatusTableContainer = document.getElementById("mainSection__unitStatusTable");
    unitStatusTableContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.tagName === "TD" && !target.closest("thead")) {
            const row = target.parentElement;
            const shipIdCell = row.querySelector(".id-column");
            const shipNameCell = row.querySelector(".name-column");
            if (shipIdCell && shipNameCell) {
                window.selectedUnit = `${shipIdCell.textContent.trim()} - ${shipNameCell.textContent.trim()}`;
                updateEventsAndDetails();
            }
        }
    });

    // Listen for global updates
    window.addEventListener("criteriaChanged", updateEventsAndDetails);
    window.addEventListener("startDateChanged", updateEventsAndDetails);

    // Initial Setup
    updateEventsAndDetails();
});
