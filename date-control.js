document.addEventListener("DOMContentLoaded", function () {
    const dateRangeElement = document.getElementById("date-range");

    const startDateConst = { month: 10, year: 1941 }; // November 1941
    const latestStartDateConst = { month: 0, year: 1945 }; // January 1945

    let startYear = startDateConst.year;
    let startMonth = startDateConst.month;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const updateDateRange = () => {
        const startDate = new Date(startYear, startMonth, 1);
        const endDate = new Date(startYear, startMonth + 11, 1);
        const startText = `${monthNames[startDate.getMonth()]}-${startDate.getFullYear() % 100}`;
        const endText = `${monthNames[endDate.getMonth()]}-${endDate.getFullYear() % 100}`;
        dateRangeElement.textContent = `${startText} to ${endText}`;

        window.startDate = startText;
        console.log("date-control.js: Global startDate set to:", window.startDate);

        window.dispatchEvent(new Event("startDateChanged"));
    };

    document.getElementById("prevMonth").addEventListener("click", () => {
        let tempMonth = startMonth - 1;
        let tempYear = startYear;

        if (tempMonth < 0) {
            tempMonth = 11;
            tempYear -= 1;
        }

        if (tempYear < startDateConst.year || (tempYear === startDateConst.year && tempMonth < startDateConst.month)) {
            console.warn("Cannot go earlier than Nov-41.");
            startYear = startDateConst.year;
            startMonth = startDateConst.month;
        } else {
            startYear = tempYear;
            startMonth = tempMonth;
        }
        updateDateRange();
    });

    document.getElementById("prevYear").addEventListener("click", () => {
        let tempYear = startYear - 1;

        if (tempYear < startDateConst.year || (tempYear === startDateConst.year && startMonth < startDateConst.month)) {
            console.warn("Cannot go earlier than Nov-41.");
            startYear = startDateConst.year;
            startMonth = startDateConst.month;
        } else {
            startYear = tempYear;
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

        if (tempYear > latestStartDateConst.year || (tempYear === latestStartDateConst.year && tempMonth > latestStartDateConst.month)) {
            console.warn("Cannot go later than Jan-45.");
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

        if (tempYear > latestStartDateConst.year || (tempYear === latestStartDateConst.year && startMonth > latestStartDateConst.month)) {
            console.warn("Cannot go later than Jan-45.");
            startYear = latestStartDateConst.year;
            startMonth = latestStartDateConst.month;
        } else {
            startYear = tempYear;
        }
        updateDateRange();
    });

    updateDateRange();
});
