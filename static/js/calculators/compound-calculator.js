/**
 * Compound Interest Calculator Module
 * 
 * This module provides functions for calculating compound interest based on variable trading percentages.
 * It replaces the Python backend functionality with pure JavaScript.
 */

// Create a global compoundCalculator object to expose the module functions
const compoundCalculator = (function() {
    // Constants
    const DAILY_PROFIT_RATE = 0.018;
    const TRADE_CAP = 10000;

    /**
     * Calculate daily profit for compound interest calculator
     * 
     * @param {number} currentBalance - Current balance
     * @param {number} tradePercent - Trade percentage
     * @returns {Object} Object containing new balance and profit
     */
    function calculateDay(currentBalance, tradePercent) {
        // Calculate tradable amount based on current balance and trade percentage
        const tradable = currentBalance * (tradePercent / 100);
        
        // Apply trade cap limit if necessary
        const actualTrade = Math.min(tradable, TRADE_CAP);
        
        // Calculate profit based on the traded amount and daily profit rate
        const profit = actualTrade * DAILY_PROFIT_RATE;
        
        // Calculate new balance
        const newBalance = (currentBalance - actualTrade) + (actualTrade * (1 + DAILY_PROFIT_RATE));
        
        // Return rounded values
        return {
            newBalance: Math.round(newBalance * 100) / 100,
            profit: Math.round(profit * 100) / 100
        };
    }

    /**
     * Calculate compound interest based on input parameters
     * 
     * @param {Object} params - Input parameters
     * @param {number} params.numDevices - Number of devices
     * @param {number} params.initialDeposit - Initial deposit per device
     * @param {number} params.worstCase - Worst case trade percentage
     * @param {number} params.bestCase - Best case trade percentage
     * @param {number} params.days - Number of days to simulate
     * @returns {Object} Results object with devices and metadata
     */
    function calculateCompoundInterest(params) {
        const { numDevices, initialDeposit, worstCase, bestCase, days } = params;
        
        // Initialize results object
        const results = {
            devices: {},
            metadata: {
                total_profit: 0,
                final_balances: []
            }
        };
        
        // Calculate for each device
        for (let device = 1; device <= numDevices; device++) {
            const deviceKey = `Device ${device}`;
            let currentBalance = initialDeposit;
            const deviceData = [];
            let cumulativeProfit = 0;
            
            // Calculate for each day
            for (let day = 1; day <= days; day++) {
                // Randomize trade percentage between worst and best case
                const tradePercent = Math.round((Math.random() * (bestCase - worstCase) + worstCase) * 100) / 100;
                const startBalance = currentBalance;
                
                // Calculate daily results
                const { newBalance, profit } = calculateDay(currentBalance, tradePercent);
                cumulativeProfit += profit;
                
                // Create daily data object
                const dailyData = {
                    day: day,
                    start_balance: Math.round(startBalance * 100) / 100,
                    traded: Math.round(Math.min(startBalance * tradePercent / 100, TRADE_CAP) * 100) / 100,
                    profit: profit,
                    cumulative_profit: Math.round(cumulativeProfit * 100) / 100,
                    new_balance: newBalance
                };
                
                deviceData.push(dailyData);
                currentBalance = newBalance;
            }
            
            // Add device data to results
            results.devices[deviceKey] = deviceData;
            results.metadata.final_balances.push(Math.round(currentBalance * 100) / 100);
        }
        
        // Calculate total profit
        results.metadata.total_profit = Math.round(
            Object.values(results.devices)
                .reduce((sum, deviceData) => sum + deviceData[deviceData.length - 1].cumulative_profit, 0) 
            * 100) / 100;
        
        return results;
    }

    // Return public API
    return {
        calculateCompoundInterest: calculateCompoundInterest
    };
})();

// Make the compoundCalculator object globally accessible
window.compoundCalculator = compoundCalculator;
