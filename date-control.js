document.addEventListener("DOMContentLoaded", function () {
    const dateRangeElement = document.getElementById("date-range");

    // Define constants for date limits
    const startDateConst = { month: 10, year: 1941 }; // November 1941 (0-indexed month)
    const latestStartDateConst = { month: 0, year: 1945 }; // January 1945

    // Initialize current start date
    let startYear = startDateConst.year;
    let startMonth = startDateConst.month;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to update the date range display and global startDate
    const updateDateRange = () => {
        const startDate = new Date(startYear, startMonth, 1);
        const endDate = new Date(startYear, startMonth + 11, 1);
        const startText = `${monthNames[startDate.getMonth()]}-${startDate.getFullYear() % 100}`;
        const endText = `${monthNames[endDate.getMonth()]}-${endDate.getFullYear() % 100}`;
        dateRangeElement.textContent = `${startText} to ${endText}`;

        // Expose startDate globally
        window.startDate = startText; // Used by other scripts
        console.log("date-control.js: Global startDate set to:", window.startDate);

        // Notify other scripts about the start date update
        window.dispatchEvent(new Event("startDateChanged"));
    };

    // Event listeners for date controls
    document.getElementById("prevYear").addEventListener("click", () => {
        let tempYear = startYear - 1;

        // Check if the new date is before Nov-41
        if (tempYear < startDateConst.year || (tempYear === startDateConst.year && startMonth < startDateConst.month)) {
            // Move to Nov-41 if earlier
            startYear = startDateConst.year;
            startMonth = startDateConst.month;
        } else {
            startYear = tempYear;
        }
        updateDateRange();
    });

    document.getElementById("prevMonth").addEventListener("click", () => {
        let tempMonth = startMonth - 1;
        let tempYear = startYear;

        if (tempMonth < 0) {
            tempMonth = 11;
            tempYear -= 1;
        }

        // Check if the new date is before Nov-41
        if (tempYear < startDateConst.year || (tempYear === startDateConst.year && tempMonth < startDateConst.month)) {
            startYear = startDateConst.year;
            startMonth = startDateConst.month;
        } else {
            startYear = tempYear;
            startMonth = tempMonth;
        }
        updateDateRange();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        let tempMonth = startMonth + 1;
        let tempYear = startYear;

        if (tempMonth > 11) {
            tempMonth = 0;
            tempYear += 1;
        }

        // Check if the new date is after Jan-45
        if (tempYear > latestStartDateConst.year || (tempYear === latestStartDateConst.year && tempMonth > latestStartDateConst.month)) {
            startYear = latestStartDateConst.year;
            startMonth = latestStartDateConst.month;
        } else {
            startYear = tempYear;
            startMonth = tempMonth;
        }
        updateDateRange();
    });

    document.getElementById("nextYear").addEventListener("click", () => {
        let tempYear = startYear + 1;

        // Check if the new date is after Jan-45
        if (tempYear > latestStartDateConst.year || (tempYear === latestStartDateConst.year && startMonth > latestStartDateConst.month)) {
            startYear = latestStartDateConst.year;
            startMonth = latestStartDateConst.month;
        } else {
            startYear = tempYear;
        }
        updateDateRange();
    });

    // Initialize the display with the constant start date
    updateDateRange();
});
