/**
 * Compound Interest PDF Generator Module
 * 
 * This module handles the generation of PDF reports for the compound interest calculator.
 * It uses jsPDF to create professional PDF documents with calculation results.
 * This replaces the Python ReportLab functionality.
 */

// Create a global compoundPdfGenerator object to expose the module functions
const compoundPdfGenerator = (function() {
    /**
     * Generate a PDF report for compound interest calculations
     * 
     * @param {Object} data - Calculation results and metadata
     */
    function generateCompoundPDF(data) {
        // Create new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: 'Trading Profit Calculator Report',
            subject: 'NFT Trading Profit Calculation',
            author: 'NFT Profit Calculator',
            creator: 'NFT Profit Calculator'
        });
        
        // Define colors for the report
        const primaryColor = [41, 128, 185]; // Blue
        const secondaryColor = [44, 62, 80]; // Dark blue/grey
        const accentColor = [46, 204, 113]; // Green for profit
        
        // Add header with logo and title
        addHeader(doc, 'Trading Profit Calculator Report', primaryColor);
        
        // Add date and time
        const now = new Date();
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 195, 20, { align: 'right' });
        
        // Add input parameters section with improved styling
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        doc.text('Input Parameters', 14, 40);
        
        // Add decorative line under section title
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(14, 42, 60, 42);
        
        // Create input parameters table with improved styling
        const paramHeaders = [['Parameter', 'Value']];
        const paramData = [
            ['Number of Devices', data.numDevices.toString()],
            ['Initial Deposit', `$${parseFloat(data.initialDeposit).toFixed(2)}`],
            ['Worst Case %', `${data.worstCase}%`],
            ['Best Case %', `${data.bestCase}%`],
            ['Days', data.days.toString()]
        ];
        
        // Add parameters table with improved styling
        doc.autoTable({
            startY: 45,
            head: paramHeaders,
            body: paramData,
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: {
                cellPadding: 6,
                fontSize: 10,
                lineColor: [220, 220, 220]
            },
            columnStyles: {
                0: { cellWidth: 80, fontStyle: 'bold' },
                1: { cellWidth: 80, halign: 'center' }
            },
            margin: { left: 14, right: 14 }
        });
        
        // Calculate the total profit for all devices
        const totalProfit = data.metadata.total_profit;
        const initialInvestment = data.initialDeposit * data.numDevices;
        const finalBalance = data.metadata.final_balances.reduce((a, b) => a + b, 0);
        const roi = ((finalBalance - initialInvestment) / initialInvestment * 100).toFixed(2);
        
        // Get current Y position after the table
        let yPos = doc.previousAutoTable.finalY + 22;
        
        // Add summary section with improved styling
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        doc.text('Summary of Results', 14, yPos);
        
        // Add decorative line under section title
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(14, yPos + 2, 74, yPos + 2);
        
        yPos += 5;
        
        // Add key metrics with improved visual presentation
        // Create a visual summary with key metrics
        doc.autoTable({
            startY: yPos,
            body: [
                [
                    {
                        content: 'Total Investment',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `$${initialInvestment.toFixed(2)}`,
                        styles: { halign: 'center' }
                    }
                ],
                [
                    {
                        content: 'Total Profit',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `$${totalProfit.toFixed(2)}`,
                        styles: { 
                            halign: 'center',
                            textColor: accentColor
                        }
                    }
                ],
                [
                    {
                        content: 'Final Balance',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `$${finalBalance.toFixed(2)}`,
                        styles: { halign: 'center' }
                    }
                ],
                [
                    {
                        content: 'Return on Investment',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `${roi}%`,
                        styles: { 
                            halign: 'center',
                            textColor: accentColor
                        }
                    }
                ]
            ],
            theme: 'grid',
            styles: {
                cellPadding: 8,
                fontSize: 11,
                lineColor: [220, 220, 220]
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 80 }
            },
            margin: { left: 14, right: 14 }
        });
        
        // Get current Y position after the summary
        yPos = doc.previousAutoTable.finalY + 22;
        
        // Check if we need a page break before device details
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        }
        
        // Add detailed results for each device
        Object.entries(data.devices).forEach(([deviceKey, deviceData], index) => {
            // Add device title with improved styling
            doc.setFontSize(14);
            doc.setTextColor(...secondaryColor);
            doc.text(`${deviceKey} - Detailed Results`, 14, yPos);
            
            // Add decorative line under section title
            doc.setDrawColor(...secondaryColor);
            doc.setLineWidth(0.5);
            doc.line(14, yPos + 2, 90, yPos + 2);
            
            // Create table headers and data with improved styling
            const headers = [['Day', 'Start Balance', 'Traded Amount', 'Profit', 'Cumulative Profit', 'End Balance']];
            const tableData = deviceData.map(day => [
                day.day.toString(),
                `$${day.start_balance.toFixed(2)}`,
                `$${day.traded.toFixed(2)}`,
                `$${day.profit.toFixed(2)}`,
                `$${day.cumulative_profit.toFixed(2)}`,
                `$${day.new_balance.toFixed(2)}`
            ]);
            
            // Add table with improved styling
            doc.autoTable({
                startY: yPos + 5,
                head: headers,
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: secondaryColor,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'center'
                },
                styles: {
                    cellPadding: 4,
                    fontSize: 8,
                    lineColor: [220, 220, 220],
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 20, halign: 'center' },
                    1: { cellWidth: 32, halign: 'right' },
                    2: { cellWidth: 32, halign: 'right' },
                    3: { cellWidth: 32, halign: 'right' },
                    4: { cellWidth: 38, halign: 'right' },
                    5: { cellWidth: 32, halign: 'right' }
                },
                margin: { left: 14, right: 14 },
                didDrawCell: function(data) {
                    // Highlight profit cells with color
                    if (data.section === 'body' && data.column.index === 3) {
                        doc.setFillColor(...accentColor);
                        doc.setTextColor(255, 255, 255);
                    }
                }
            });
            
            // Update Y position for next section
            yPos = doc.previousAutoTable.finalY + 20;
            
            // Add page break if needed and not the last device
            if (yPos > 250 && index < Object.keys(data.devices).length - 1) {
                doc.addPage();
                yPos = 20;
            }
        });
        
        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
            doc.text('NFT Profit Calculator', 195, 290, { align: 'right' });
        }
        
        // Save the PDF with a more descriptive filename
        const dateStr = now.toISOString().split('T')[0];
        doc.save(`Trading_Profit_Report_${dateStr}.pdf`);
    }
    
    /**
     * Add a header to the PDF document
     * 
     * @param {Object} doc - The jsPDF document object
     * @param {string} title - The title to display in the header
     * @param {Array} color - RGB color array for the header
     */
    function addHeader(doc, title, color) {
        // Add a colored header bar
        doc.setFillColor(...color);
        doc.rect(0, 0, 210, 30, 'F');
        
        // Add title to the header
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text(title, 105, 20, { align: 'center' });
    }

    // Return public API
    return {
        generateCompoundPDF: generateCompoundPDF
    };
})();

// Make the compoundPdfGenerator object globally accessible
window.compoundPdfGenerator = compoundPdfGenerator;
