/**
 * Fixed Interest Calculator Module
 * 
 * This module provides functions for calculating fixed daily interest on a principal amount.
 * Unlike the compound interest calculator, this applies a fixed percentage to the principal
 * each day, without reinvesting the profits.
 */

// Create a global fixedCalculator object to expose the module functions
const fixedCalculator = (function() {
    /**
     * Calculate fixed interest based on principal amount and daily interest rate
     * 
     * @param {Object} params - Input parameters
     * @param {number} params.principal - The initial investment amount
     * @param {number} params.dailyRate - Daily interest rate as a percentage (e.g., 3.5 for 3.5%)
     * @param {number} params.days - Number of days to calculate interest for
     * @returns {Object} Results object with daily data and metadata
     */
    function calculateFixedInterest(params) {
        const { principal, dailyRate, days } = params;
        
        // Convert percentage to decimal
        const dailyRateDecimal = dailyRate / 100;
        
        // Calculate daily interest amount
        const dailyInterest = principal * dailyRateDecimal;
        
        // Calculate total interest over the specified days
        const totalInterest = dailyInterest * days;
        
        // Calculate total payout (principal + total interest)
        const totalPayout = principal + totalInterest;
        
        // Create daily breakdown
        const dailyData = [];
        let cumulativeInterest = 0;
        
        for (let day = 1; day <= days; day++) {
            cumulativeInterest += dailyInterest;
            dailyData.push({
                day: day,
                principal: principal,
                daily_interest: dailyInterest,
                cumulative_interest: cumulativeInterest,
                current_value: principal + cumulativeInterest
            });
        }
        
        // Create results object
        const results = {
            daily_data: dailyData,
            metadata: {
                principal: principal,
                daily_rate: dailyRate,
                daily_interest: dailyInterest,
                days: days,
                total_interest: totalInterest,
                total_payout: totalPayout
            }
        };
        
        return results;
    }

    // Return public API
    return {
        calculateFixedInterest: calculateFixedInterest
    };
})();

// Make the fixedCalculator object globally accessible
window.fixedCalculator = fixedCalculator;
