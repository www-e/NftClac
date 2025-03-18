/**
 * Fixed Interest PDF Generator Module
 * 
 * This module handles the generation of PDF reports for the fixed interest calculator.
 * It uses jsPDF to create professional PDF documents with calculation results.
 * This replaces the Python ReportLab functionality.
 */

// Create a global fixedPdfGenerator object to expose the module functions
const fixedPdfGenerator = (function() {
    /**
     * Generate a PDF report for fixed interest calculations
     * 
     * @param {Object} data - Calculation results and metadata
     */
    function generateFixedPDF(data) {
        // Create new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: 'Fixed Interest Calculator Report',
            subject: 'Fixed Interest Calculation',
            author: 'NFT Profit Calculator',
            creator: 'NFT Profit Calculator'
        });
        
        // Define colors for the report
        const primaryColor = [52, 152, 219]; // Different blue shade for fixed calculator
        const secondaryColor = [44, 62, 80]; // Dark blue/grey
        const accentColor = [39, 174, 96]; // Different green shade for interest
        
        // Add header with logo and title
        addHeader(doc, 'Fixed Interest Calculator Report', primaryColor);
        
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
            ['Principal Amount', `$${data.metadata.principal.toFixed(2)}`],
            ['Daily Interest Rate', `${data.metadata.daily_rate}%`],
            ['Number of Days', data.metadata.days.toString()]
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
        
        // Get current Y position after the table
        let yPos = doc.previousAutoTable.finalY + 22;
        
        // Add calculation summary section with improved styling
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        doc.text('Summary of Results', 14, yPos);
        
        // Add decorative line under section title
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(14, yPos + 2, 74, yPos + 2);
        
        yPos += 5;
        
        // Create visual summary with key metrics and improved styling
        doc.autoTable({
            startY: yPos,
            body: [
                [
                    {
                        content: 'Principal Amount',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `$${data.metadata.principal.toFixed(2)}`,
                        styles: { halign: 'center' }
                    }
                ],
                [
                    {
                        content: 'Daily Interest',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `$${data.metadata.daily_interest.toFixed(2)}`,
                        styles: { 
                            halign: 'center',
                            textColor: accentColor
                        }
                    }
                ],
                [
                    {
                        content: 'Total Interest',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `$${data.metadata.total_interest.toFixed(2)}`,
                        styles: { 
                            halign: 'center',
                            textColor: accentColor
                        }
                    }
                ],
                [
                    {
                        content: 'Total Payout',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `$${data.metadata.total_payout.toFixed(2)}`,
                        styles: { halign: 'center' }
                    }
                ],
                [
                    {
                        content: 'Return on Investment',
                        styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
                    },
                    {
                        content: `${(data.metadata.total_interest / data.metadata.principal * 100).toFixed(2)}%`,
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
        
        // Update Y position for next section
        yPos = doc.previousAutoTable.finalY + 22;
        
        // Add page break if needed
        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        }
        
        // Add daily breakdown section with improved styling
        doc.setFontSize(16);
        doc.setTextColor(...secondaryColor);
        doc.text('Daily Breakdown', 14, yPos);
        
        // Add decorative line under section title
        doc.setDrawColor(...secondaryColor);
        doc.setLineWidth(0.5);
        doc.line(14, yPos + 2, 70, yPos + 2);
        
        // Create table headers and data with improved styling
        const headers = [['Day', 'Principal', 'Daily Interest', 'Cumulative Interest', 'Current Value']];
        const tableData = data.daily_data.map(day => [
            day.day.toString(),
            `$${day.principal.toFixed(2)}`,
            `$${day.daily_interest.toFixed(2)}`,
            `$${day.cumulative_interest.toFixed(2)}`,
            `$${day.current_value.toFixed(2)}`
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
                1: { cellWidth: 35, halign: 'right' },
                2: { cellWidth: 35, halign: 'right' },
                3: { cellWidth: 45, halign: 'right' },
                4: { cellWidth: 35, halign: 'right' }
            },
            margin: { left: 14, right: 14 },
            didDrawCell: function(data) {
                // Highlight interest cells with color
                if (data.section === 'body' && data.column.index === 2) {
                    doc.setFillColor(...accentColor);
                    doc.setTextColor(255, 255, 255);
                }
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
        doc.save(`Fixed_Interest_Report_${dateStr}.pdf`);
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
        generateFixedPDF: generateFixedPDF
    };
})();

// Make the fixedPdfGenerator object globally accessible
window.fixedPdfGenerator = fixedPdfGenerator;
