# Project Template for React Applications

This template is designed to help our company quickly set up React projects without having to install everything from scratch each time. It provides a consistent file structure and includes all necessary components to get started.

## File Structure

- **components/**: Contains reusable visual elements like the Navbar, Footer, and Dashboard components etc.
- **pages/**: Contains full-page components like the Dashboard and Chat pages. These are dumb components, meaning they are primarily used for displaying content and should not contain any logic. Logic should be handled by the components.
- **services/**: Includes functions for API calls, primarily using Axios, such as authentication and data fetching.
- **store_context/**: Manages global states like theme and authentication using React's context API. For dynamic state changes, we use Zustand (note: Zustand is not included in basic projects).
- **App.jsx**: This is where the application routes are defined.
- **main.jsx**: The entry point of the application.

## Getting Started

To set up the project, follow these simple steps:

1. Open your terminal and navigate to the project directory.
2. Run `npm install` to install all necessary dependencies.
3. Once the installation is complete, start the project with `npm run dev`.

Feel free to add new dependencies as needed for your project. This template is here to make your development process smoother and more efficient. Enjoy coding!

