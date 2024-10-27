# Tabbed Interface with Custom Caching and State Management

## Project Overview

This project is a tabbed interface application that displays different data based on the selected tab. It is built with **React** and uses a **custom data provider** to handle **caching** and **state management**, in line with the requirements of a job assignment.

The custom data provider solution is designed to cache fetched data, manage state, and implement cache expiration without relying on external libraries like React Query.

## Features

- **Custom Caching**: Data fetched for each tab is stored in a cache to avoid redundant network requests and improve performance.
- **State Management with Custom Data Provider**: Global state and cache management are handled through a custom provider, making data accessible across components without using React Context.
- **Dynamic Data Loading**: Data is fetched only when a tab is clicked, minimizing initial load times and enhancing user experience.
- **JSONPlaceholder Dummy API**: Due to CORS issues with the provided API, the JSONPlaceholder API was used as a replacement to fetch mock data.

## Project Structure

- **`DataProvider`**: A custom data provider that manages global state and caching. It stores fetched data in a cache using `useRef` and provides a structured way to manage state without relying on React Context.
- **`useFetchWithCache`**: A custom hook that handles data fetching, caching, and cache expiration logic for each tab. It also implements retry logic to handle potential network issues.
- **`TabComponent`**: A component that renders the tabbed interface, fetching data for each tab using `useFetchWithCache` to access cached or newly fetched data.
- **`App`**: The main component that uses `DataProvider` to wrap the entire application, making the custom caching and state management available globally.

## Why Use a Custom Caching Solution Instead of React Query?

For this project, **custom caching and state management** were implemented instead of using React Query for several reasons:

1. **Assignment Requirements**: The task specifically required implementing caching and state management manually. Using a custom data provider instead of an external library demonstrates a solid understanding of core React and JavaScript principles.

2. **Direct Control Over Caching Logic**: Implementing caching directly allows more control over how data is stored, when it expires, and how retries are handled. This flexibility can be advantageous in understanding and handling data caching.

3. **Showcasing Core Skills**: While React Query is excellent for complex projects, creating a custom solution from scratch showcases proficiency in managing caching and state without dependencies. This implementation highlights foundational skills like caching strategies, custom hooks, and asynchronous data handling.

4. **Project Simplicity**: The project is small enough that a custom provider is a manageable solution. It keeps dependencies low while fulfilling the assignment requirements without adding unnecessary complexity.

Using a custom caching solution ensures that the project aligns with the assignment's requirements while demonstrating a thorough understanding of caching and state management.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
