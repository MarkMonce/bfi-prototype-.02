document.addEventListener('DOMContentLoaded', () => {
    let jsonData = [];

    const fileInput = document.getElementById('fileInput');
    const loadFileButton = document.getElementById('loadFile');
    const addRecordButton = document.getElementById('addRecord');
    const saveFileButton = document.getElementById('saveFile');
    const jsonViewer = document.getElementById('jsonViewer');
    const jsonTable = document.getElementById('jsonTable').querySelector('tbody');

    function updateViewer() {
        jsonViewer.value = JSON.stringify(jsonData, null, 4);
    }

    function populateTable() {
        jsonTable.innerHTML = ''; // Clear table
        jsonData.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${record.month}" data-index="${index}" data-key="month"></td>
                <td><input type="date" value="${record["exact date"]}" data-index="${index}" data-key="exact date"></td>
                <td><input type="text" value="${record.details}" data-index="${index}" data-key="details"></td>
                <td>
                    <button class="deleteRecord" data-index="${index}">Delete</button>
                </td>
            `;
            jsonTable.appendChild(row);
        });
    }

    function handleInputChange(event) {
        const index = event.target.dataset.index;
        const key = event.target.dataset.key;
        jsonData[index][key] = event.target.value;
        updateViewer();
    }

    function handleDelete(event) {
        const index = event.target.dataset.index;
        jsonData.splice(index, 1);
        populateTable();
        updateViewer();
    }

    function addRecord() {
        jsonData.push({ month: '', "exact date": '', details: '' });
        populateTable();
        updateViewer();
    }

    function saveToFile() {
        const blob = new Blob([JSON.stringify(jsonData, null, 4)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'updated_events.json';
        a.click();
    }

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    jsonData = JSON.parse(reader.result);
                    populateTable();
                    updateViewer();
                } catch (error) {
                    alert('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        }
    });

    jsonTable.addEventListener('input', handleInputChange);
    jsonTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteRecord')) {
            handleDelete(event);
        }
    });

    addRecordButton.addEventListener('click', addRecord);
    saveFileButton.addEventListener('click', saveToFile);
});
