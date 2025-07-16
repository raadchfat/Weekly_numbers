# Omaha Drain KPI Dashboard

A React-based web dashboard that processes Excel files and displays weekly KPIs for Omaha Drain service technicians. The dashboard provides real-time data processing, interactive visualizations, and comprehensive performance metrics.

## Features

- **Excel File Processing**: Upload and process Opportunities Report and Line Items Sold Report
- **Real-time KPI Calculations**: Automatic calculation of all required metrics
- **Interactive Filters**: Filter by technician and week
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Data Visualization**: Charts for revenue trends and job status distribution
- **Export Functionality**: Download KPI data as JSON
- **Error Handling**: Comprehensive validation and error messages

## Required KPIs

1. **Average Ticket Value** = Total Revenue / Won Jobs Count
2. **Job Close Rate** = Won Jobs / Total Jobs (excluding Invalid) × 100
3. **Weekly Revenue** = Sum of revenue from Won jobs
4. **Membership Win Rate** = Memberships Sold / Membership Opportunities × 100
5. **Hydro Jetting Jobs Sold** = Count jobs with line items containing "jetting" or "hydro"
6. **Descaling Jobs Sold** = Count jobs with line items containing "descal"
7. **Water Heater Jobs Sold** = Count jobs with categories/items containing "water heater"

## Data Structure

### Opportunities Report Columns
- Date
- Job (ID)
- Customer
- Opportunity Owner (technician)
- Status
- Revenue
- Membership Opportunity
- Membership Sold

### Line Items Sold Report Columns
- Job (ID)
- Opp. Owner (technician)
- Category
- Line Item
- Price
- Invoice Date

## Tech Stack

- **React 18** with hooks (useState, useEffect, useMemo)
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **SheetJS (xlsx)** for Excel file processing
- **Lodash** for data manipulation
- **Lucide React** for icons

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raadchfat/Weekly_numbers.git
   cd omaha-drain-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Upload Excel Files
- Drag and drop your Opportunities Report and Line Items Sold Report Excel files
- Or click "browse files" to select them manually
- The system will automatically identify which file is which based on filename

### 2. View Dashboard
- Once files are processed, the dashboard will display automatically
- Use the technician filter to view data for specific technicians or "All Technicians"
- Use the week filter to view data for specific weeks

### 3. Analyze KPIs
- View all 7 KPIs in the card grid
- Each KPI shows the calculated value and supporting context
- Hover over charts for detailed information

### 4. Export Data
- Click the "Export" button to download current KPI data as JSON
- The export includes all metrics, filters, and timestamp

## File Requirements

### Excel File Format
- Files must be in `.xlsx` or `.xls` format
- First row should contain column headers
- Data should start from the second row

### Required Columns
The system is flexible with column naming but expects these data points:

**Opportunities Report:**
- Date (any date format)
- Job ID (can be "Job (ID)", "Job ID", or "Job")
- Customer name
- Technician/Opportunity Owner
- Status (Won, Lost, Pending, etc.)
- Revenue (numeric)
- Membership Opportunity (boolean/string)
- Membership Sold (boolean/string)

**Line Items Report:**
- Job ID (must match Opportunities Report)
- Technician/Opportunity Owner
- Category
- Line Item
- Price (numeric)

## Data Processing Logic

### File Merging
- Data is merged using Job ID as the primary key
- Line items are attached to opportunities as a nested array
- Missing data is handled gracefully with default values

### KPI Calculations
- All calculations are performed in real-time
- Week numbers are calculated using ISO week numbering
- Invalid jobs are automatically excluded from calculations
- Service-specific jobs are identified by searching category and line item names

### Filtering
- Technician filter: "All Technicians" or specific technician
- Week filter: Available weeks are automatically detected from data
- All filters update calculations and charts in real-time

## Component Structure

```
src/
├── App.jsx                    # Main application component
├── components/
│   ├── FileUpload.jsx         # File upload interface
│   ├── Dashboard.jsx          # Main dashboard layout
│   ├── KPICard.jsx           # Individual KPI display
│   ├── TechnicianFilter.jsx   # Technician selection
│   ├── WeekFilter.jsx        # Week selection
│   └── Charts/
│       ├── RevenueChart.jsx   # Revenue trend chart
│       └── JobStatusChart.jsx # Job status pie chart
├── hooks/
│   ├── useDataProcessor.js    # File processing logic
│   └── useKPICalculator.js    # KPI calculation logic
└── utils/
    ├── dateUtils.js          # Date and week utilities
    ├── excelParser.js        # Excel file parsing
    └── kpiCalculations.js    # KPI calculation functions
```

## Error Handling

The application includes comprehensive error handling for:

- **File Format Errors**: Invalid Excel files or missing required columns
- **Data Validation**: Missing or malformed data
- **Processing Errors**: Issues during file parsing or data merging
- **User Feedback**: Clear error messages and loading states

## Performance Features

- **Memoized Calculations**: KPI calculations are cached and only recalculated when necessary
- **Efficient Data Processing**: Large Excel files are processed efficiently
- **Responsive Charts**: Charts automatically resize for different screen sizes
- **Optimized Rendering**: Components only re-render when their data changes

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Building for Production

```bash
npm run build
```

The build folder will contain the production-ready application.

## Troubleshooting

### Common Issues

1. **Files not uploading**: Ensure files are in .xlsx or .xls format
2. **No data showing**: Check that Excel files have the required columns
3. **Calculations seem wrong**: Verify that Job IDs match between files
4. **Charts not displaying**: Ensure data contains valid dates and numeric values

### Debug Mode

Open browser developer tools and check the console for detailed error messages and data processing information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on the GitHub repository or contact the development team.
