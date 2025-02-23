# React Dashboard App

## Overview
This project is a React-based dashboard that displays various body vitals, including heart rate, temperature, blood oxygen levels, ECG data, and step count. The application fetches data from an API and updates the displayed information every 5 minutes.

## Features
- Graphs for:
  - Heart Rate
  - Temperature
  - Blood Oxygen Levels
  - ECG Data
- Step Counter
- Data requests for the last hour on page load
- Automatic updates every 5 minutes

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd react-dashboard-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm start
```
The application will be available at `http://10.100.91.208:3000`.

### Building for Production
To create a production build, run:
```
npm run build
```
This will generate a `build` folder with optimized files for deployment.

## Usage
Once the application is running, you will see the dashboard displaying the various body vitals. The data will refresh automatically every 5 minutes to provide the latest information.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.