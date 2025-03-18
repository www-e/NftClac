/**
 * Fixed Interest Calculator JavaScript
 * 
 * This file handles the functionality for the fixed interest calculator page.
 * It manages form submission, calculations, and rendering of results.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load saved form values from session storage
    loadFormValues();
    
    // Form validation and submission
    const form = document.getElementById('fixedCalculatorForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Add event listeners for input fields to update calculation display in real-time
    setupLiveCalculation();
    
    // Export buttons
    document.getElementById('exportFixedCsvBtn').addEventListener('click', exportToCSV);
    document.getElementById('exportFixedPdfBtn').addEventListener('click', exportToPDF);
});

/**
 * Load saved form values from session storage
 */
function loadFormValues() {
    const inputs = ['principal', 'dailyRate', 'fixedDays'];
    inputs.forEach(id => {
        const savedValue = sessionStorage.getItem(`fixed_${id}`);
        if (savedValue) {
            document.getElementById(id).value = savedValue;
        }
    });
    
    // Update calculation display with loaded values
    updateCalculationDisplay();
}

/**
 * Save form values to session storage
 */
function saveFormValues() {
    const inputs = ['principal', 'dailyRate', 'fixedDays'];
    inputs.forEach(id => {
        const value = document.getElementById(id).value;
        sessionStorage.setItem(`fixed_${id}`, value);
    });
}

/**
 * Set up live calculation display that updates as user changes input values
 */
function setupLiveCalculation() {
    const inputs = ['principal', 'dailyRate', 'fixedDays'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateCalculationDisplay);
    });
}

/**
 * Update the calculation display boxes with current input values
 */
function updateCalculationDisplay() {
    // Get current input values
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const dailyRate = parseFloat(document.getElementById('dailyRate').value) || 0;
    const days = parseInt(document.getElementById('fixedDays').value) || 0;
    
    // Calculate values
    const dailyInterest = principal * (dailyRate / 100);
    const totalInterest = dailyInterest * days;
    const totalPayout = principal + totalInterest;
    
    // Update display elements - Principal calculation
    document.getElementById('principalDisplay').textContent = principal.toFixed(2);
    document.getElementById('rateDisplay').textContent = `${dailyRate}%`;
    document.getElementById('dailyInterestResult').textContent = `$${dailyInterest.toFixed(2)}`;
    
    // Update display elements - Total interest calculation
    document.getElementById('dailyInterestDisplay').textContent = `$${dailyInterest.toFixed(2)}`;
    document.getElementById('daysDisplay').textContent = `${days} days`;
    document.getElementById('totalInterestResult').textContent = `$${totalInterest.toFixed(2)}`;
    
    // Update display elements - Total payout calculation
    document.getElementById('principalPayoutDisplay').textContent = `$${principal.toFixed(2)}`;
    document.getElementById('interestPayoutDisplay').textContent = `$${totalInterest.toFixed(2)}`;
    document.getElementById('totalPayoutResult').textContent = `$${totalPayout.toFixed(2)}`;
}

// Store last calculated data for export functionality
let lastCalculatedData = null;

/**
 * Handle form submission and calculate results
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    saveFormValues();
    
    // Get form data
    const formData = {
        principal: parseFloat(document.getElementById('principal').value),
        dailyRate: parseFloat(document.getElementById('dailyRate').value),
        days: parseInt(document.getElementById('fixedDays').value)
    };
    
    try {
        // Calculate results using the fixed calculator module
        const data = fixedCalculator.calculateFixedInterest(formData);
        lastCalculatedData = data;  // Store the data for export
        renderResults(data);
    } catch (error) {
        console.error('Fixed interest calculation failed:', error);
    }
}

/**
 * Render the calculation results in the table
 * @param {Object} data - Calculation results
 */
function renderResults(data) {
    // Render table
    const tbody = document.querySelector('#fixedResultsTable tbody');
    tbody.innerHTML = '';
    
    data.daily_data.forEach(day => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${day.day}</td>
            <td>$${day.principal.toFixed(2)}</td>
            <td>$${day.daily_interest.toFixed(2)}</td>
            <td>$${day.cumulative_interest.toFixed(2)}</td>
            <td>$${day.current_value.toFixed(2)}</td>
        `;
    });
    
    // Update calculation display with calculated values
    document.getElementById('dailyInterestResult').textContent = `$${data.metadata.daily_interest.toFixed(2)}`;
    document.getElementById('totalInterestResult').textContent = `$${data.metadata.total_interest.toFixed(2)}`;
    document.getElementById('totalPayoutResult').textContent = `$${data.metadata.total_payout.toFixed(2)}`;
}

/**
 * Export table data to CSV file
 */
function exportToCSV() {
    const table = document.getElementById('fixedResultsTable');
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
    link.download = 'fixed_interest_calculation.csv';
    link.click();
}

/**
 * Export calculation results to PDF
 */
function exportToPDF() {
    if (!lastCalculatedData) {
        alert('Please calculate results first before exporting to PDF');
        return;
    }

    try {
        // Generate PDF using the fixed PDF generator module
        // The fixedPdfGenerator is now a global object
        window.fixedPdfGenerator.generateFixedPDF(lastCalculatedData);
    } catch (error) {
        console.error('PDF export failed:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}
