document.addEventListener("DOMContentLoaded", () => {
    const eventsAndDetailsDiv = document.getElementById("mainSection__eventsAndDetails");
    eventsAndDetailsDiv.classList.add("events-details");

    // Global Variable for Selected Unit
    window.selectedUnit = null;

    // Function to update events and details display
    // const updateEventsAndDetails = () => {
    //     const startDate = window.startDate || "N/A";
    //     const criteria = window.globalCriteria || [];
    //     const selectedUnitText = window.selectedUnit
    //         ? `Ship ID: ${window.selectedUnit}`
    //         : "No unit selected";

    //     // Generate the new UL content
    //     const ulContent = `
    //         <div style="height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 2px; box-sizing: border-box;">
    //             <ul style="list-style-type: none; padding: 0; margin: 0;">
    //                 <li><strong>Start Date:</strong> ${startDate}</li>
    //                 <li><strong>Search Criteria:</strong>
    //                     <ul style="margin-left: 15px; list-style-type: disc;">
    //                         ${criteria.length > 0
    //                             ? criteria.map(item => `<li>${item}</li>`).join("")
    //                             : "<li>No criteria selected</li>"}
    //                     </ul>
    //                 </li>
    //                 <li><strong>Selected Unit:</strong> ${selectedUnitText}</li>
    //             </ul>
    //         </div>
    //     `;

    //     // Clear existing content and add the UL to the top of the parent div
    //     eventsAndDetailsDiv.innerHTML = ulContent;
    // };

    const updateEventsAndDetails = () => {
        const startDate = window.startDate || "N/A";
        const criteria = window.globalCriteria || [];
        const selectedUnitText = window.selectedUnit
            ? `Ship ID: ${window.selectedUnit}`
            : "No unit selected";
    
        // Remove any existing result container first
        const existingResults = eventsAndDetailsDiv.querySelector(".results-container");
        if (existingResults) existingResults.remove();
    
        // Create and insert new content at the top
        const resultsContainer = document.createElement("div");
        resultsContainer.classList.add("results-container");
        resultsContainer.style.cssText = "width: 100%; margin: 0; padding: 0; box-sizing: border-box;";
    
        resultsContainer.innerHTML = `
            <div style="height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 2px; box-sizing: border-box;">
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
    
        // Insert the new content at the top
        eventsAndDetailsDiv.prepend(resultsContainer);
    };
    

    // Event delegation for table clicks (handles dynamic table updates)
    const unitStatusTableContainer = document.getElementById("mainSection__unitStatusTable");

    unitStatusTableContainer.addEventListener("click", (event) => {
        const target = event.target;

        // Ensure the clicked element is a table cell (TD) and not part of the header row
        if (target.tagName === "TD" && !target.closest("thead")) {
            const row = target.parentElement;

            // Extract Ship ID and Ship Name
            const shipIdCell = row.querySelector(".id-column");
            const shipNameCell = row.querySelector(".name-column");

            if (shipIdCell && shipNameCell) {
                // Update global variable and refresh display
                window.selectedUnit = `${shipIdCell.textContent.trim()} - ${shipNameCell.textContent.trim()}`;
                console.log("Selected Unit:", window.selectedUnit);
                updateEventsAndDetails();
            }
        }
    });

    // Listen for global updates and update display
    const handleGlobalUpdates = () => {
        updateEventsAndDetails();
    };

    window.addEventListener("criteriaChanged", handleGlobalUpdates);
    window.addEventListener("startDateChanged", handleGlobalUpdates);

    // Initial Setup
    updateEventsAndDetails();
});
