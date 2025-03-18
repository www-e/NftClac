# NFT Profit Calculator

## Project Overview
This application is a financial calculator designed to help users simulate and visualize profits from NFT trading strategies. It offers two different calculation methods:

1. **Compound Interest Calculator (Default)** - Calculates profits based on a variable trading percentage with compound interest, where profits are reinvested.
2. **Fixed Interest Calculator** - Calculates profits based on a fixed daily interest rate applied to the principal amount.

## Features
- Multiple device simulation for compound interest calculations
- Fixed interest calculations with daily breakdown
- Interactive data visualization with tables
- Export functionality (CSV and PDF)
- Dark theme UI for better readability

## Calculation Methods

### Compound Interest Calculator
- **Initial Deposit**: Starting amount for each device
- **Number of Devices**: Simulate multiple devices running simultaneously
- **Worst/Best Case Trade %**: Range for randomized daily trading percentage
- **Days**: Number of days to simulate
- **Daily Profit Rate**: Fixed at 1.8% (0.018)
- **Trade Cap**: Maximum amount that can be traded per day ($10,000)

The compound interest calculation works as follows:
1. Calculate tradable amount based on current balance and trade percentage
2. Apply trade cap limit if necessary
3. Calculate profit based on the traded amount and daily profit rate
4. Add profit back to balance for next day's calculation

### Fixed Interest Calculator
- **Principal Amount**: The initial investment amount
- **Daily Interest Rate**: Percentage of daily simple interest
- **Days**: Number of days to calculate interest for

The fixed interest calculation works as follows:
1. Calculate daily interest amount (Principal × Daily Interest Rate)
2. Calculate total interest (Daily Interest × Number of Days)
3. Calculate total payout (Principal + Total Interest)

## Technical Implementation
- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **PDF Generation**: ReportLab
- **Data Format**: JSON for data exchange between frontend and backend

## Usage
1. Select the desired calculator type using the tabs at the top
2. Enter the required parameters
3. Click "Calculate" to view results
4. Use the export buttons to download results in CSV or PDF format
