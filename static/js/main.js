document.addEventListener('DOMContentLoaded', () => {
    // Load saved form values from session storage
    loadFormValues();
    
    // Form validation and submission
    const form = document.getElementById('calculatorForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Input validation
    setupInputValidation();
    
    // Export buttons
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
});

/**
 * Load saved form values from session storage
 */
function loadFormValues() {
    const inputs = ['numDevices', 'initialDeposit', 'worstCase', 'bestCase', 'days'];
    inputs.forEach(id => {
        const savedValue = sessionStorage.getItem(id);
        if (savedValue) {
            document.getElementById(id).value = savedValue;
        }
    });
}

/**
 * Save form values to session storage
 */
function saveFormValues() {
    const inputs = ['numDevices', 'initialDeposit', 'worstCase', 'bestCase', 'days'];
    inputs.forEach(id => {
        const value = document.getElementById(id).value;
        sessionStorage.setItem(id, value);
    });
}

/**
 * Set up input validation for worst and best case percentages
 */
function setupInputValidation() {
    const worstCase = document.getElementById('worstCase');
    const bestCase = document.getElementById('bestCase');
    
    [worstCase, bestCase].forEach(input => {
        input.addEventListener('input', () => {
            if (parseFloat(bestCase.value) < parseFloat(worstCase.value)) {
                bestCase.setCustomValidity('Best case must be greater than or equal to worst case');
            } else {
                bestCase.setCustomValidity('');
            }
        });
    });
}

// Store last calculated data for export functionality
let lastCalculatedData = null;

/**
 * Handle form submission and calculate results using the compound calculator module
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    saveFormValues();
    
    // Get form data
    const formData = {
        numDevices: parseInt(document.getElementById('numDevices').value),
        initialDeposit: parseFloat(document.getElementById('initialDeposit').value),
        worstCase: parseFloat(document.getElementById('worstCase').value),
        bestCase: parseFloat(document.getElementById('bestCase').value),
        days: parseInt(document.getElementById('days').value)
    };
    
    try {
        // Calculate results using the compound calculator module
        const data = compoundCalculator.calculateCompoundInterest(formData);
        lastCalculatedData = { ...data, ...formData };  // Store the data for export
        renderResults(data);
    } catch (error) {
        console.error('Calculation failed:', error);
    }
}

/**
 * Render the calculation results in the UI
 * @param {Object} data - Calculation results
 */
function renderResults(data) {
    // Create device tabs
    const deviceTabs = document.getElementById('deviceTabs');
    deviceTabs.innerHTML = '';
    Object.keys(data.devices).forEach((deviceKey, index) => {
        const tab = document.createElement('button');
        tab.className = `device-tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = deviceKey;
        tab.onclick = () => switchDevice(deviceKey, data);
        deviceTabs.appendChild(tab);
    });
    
    // Show first device by default
    const firstDevice = Object.keys(data.devices)[0];
    switchDevice(firstDevice, data);
    
    // Update summary
    updateSummary(data);
}

/**
 * Switch to display a different device's data
 * @param {string} deviceKey - Key of the device to display
 * @param {Object} data - Calculation results
 */
function switchDevice(deviceKey, data) {
    // Update active tab
    document.querySelectorAll('.device-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent === deviceKey);
    });
    
    // Render table
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = '';
    
    data.devices[deviceKey].forEach(day => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${day.day}</td>
            <td>$${day.start_balance.toFixed(2)}</td>
            <td>$${day.traded.toFixed(2)}</td>
            <td class="${day.profit >= 5 ? 'profit-high' : 'profit-low'}">$${day.profit.toFixed(2)}</td>
            <td>$${day.cumulative_profit.toFixed(2)}</td>
            <td>$${day.new_balance.toFixed(2)}</td>
        `;
    });
}

/**
 * Update the summary section with calculation results
 * @param {Object} data - Calculation results
 */
function updateSummary(data) {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value);
    const totalProfit = data.metadata.total_profit;
    const finalBalance = data.metadata.final_balances.reduce((a, b) => a + b, 0);
    const roi = ((finalBalance - (initialDeposit * data.metadata.final_balances.length)) / 
                (initialDeposit * data.metadata.final_balances.length) * 100);
    
    document.getElementById('finalBalance').textContent = `$${finalBalance.toFixed(2)}`;
    document.getElementById('totalProfit').textContent = `$${totalProfit.toFixed(2)}`;
    document.getElementById('roi').textContent = `${roi.toFixed(2)}%`;
}

/**
 * Export table data to CSV file
 */
function exportToCSV() {
    const table = document.getElementById('resultsTable');
    let csv = [];
    
    // Get headers
    const headers = [];
    table.querySelectorAll('th').forEach(th => headers.push(th.textContent));
    csv.push(headers.join(','));
    
    // Get data
    table.querySelectorAll('tbody tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push(td.textContent.replace('$', ''));
        });
        csv.push(row.join(','));
    });
    
    // Create and download CSV file
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nft_profit_calculation.csv';
    link.click();
}

/**
 * Export calculation results to PDF using the compound PDF generator module
 */
function exportToPDF() {
    if (!lastCalculatedData) {
        alert('Please calculate results first before exporting to PDF');
        return;
    }

    try {
        // Generate PDF using the compound PDF generator module
        window.compoundPdfGenerator.generateCompoundPDF(lastCalculatedData);
    } catch (error) {
        console.error('PDF export failed:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}
