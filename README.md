

# Stationary/Library Management System (MERN Stack)

![ezgif com-video-to-gif](https://github.com/Hariharanreddy/Item-manager-COURT-PROJECT/assets/82924830/67317ddf-1155-4e45-9b5b-0cf14836f40d)

## Features

Key features that has been implemented in this project are:

- **Doesn't need an internet connection to work:** The Library/Stationary Management System is designed to function offline, allowing users to access and utilize the system even without an active internet connection. This ensures uninterrupted access to library and stationary resources and operations.

- **Scheduled Backup and removal of old backup files:** The system incorporates an automated backup feature, allowing scheduled backups of the library and stationary databases. It also includes a mechanism to remove old backup files to optimize storage space and ensure efficient data management.

- **Pagination:** To handle large volumes of data, the system implements pagination, dividing the library and stationary records into manageable chunks. This enables users to navigate through the data efficiently, enhancing performance and user experience.

- **Export To CSV depending upon the filters applied:** The system provides an export functionality that allows users to generate CSV (Comma Separated Values) files based on the applied filters. This enables users to extract specific data subsets from the library and stationary records for further analysis or reporting purposes.

- **Form Validation:** The system incorporates robust form validation mechanisms to ensure the accuracy and integrity of user-submitted data. This helps prevent errors and inconsistencies, improving the reliability of the system.

- **Filters - date, stock, name, department, etc.:** The system offers a range of filters to facilitate efficient searching and sorting of library and stationary resources. Users can apply filters based on criteria such as date, stock availability, name, department, and more. This allows users to quickly locate specific resources based on their requirements.

- **Proper server-side response pop-ups:** The system provides informative and user-friendly response pop-ups from the server. These pop-ups convey relevant messages, such as successful data updates, errors, or notifications, ensuring clear communication between the system and the users.

- **Easy UI:** The user interface of the Library/Stationary Management System is designed with simplicity and ease of use in mind. The system employs intuitive navigation, clear labeling, and well-organized layouts to ensure a user-friendly experience. This enables users to perform tasks efficiently and minimizes the learning curve associated with the system.

## Installation

### Prerequisites

Before proceeding with the installation, please ensure that you have the following prerequisites set up on your system:

- Node.js (version 16 or above)
- MongoDB

### Setup Instructions

Follow these steps to install and run the Library Management System locally:

1. **Clone the repository to your local machine:**

    ```shell
    https://github.com/Hariharanreddy/Item-manager-COURT-PROJECT.git
    ```

2. **Change into the project directory:**

    ```shell
    cd Item-Manager
    ```

3. **Install the dependencies for both the server and the client:**

    ```shell
    cd ./server
    npm install

    cd ../client
    npm install
    ```

4. **Set up environment variables:**

    Create a `.env` file in the `server` directory and specify the following variables:

    ```
    PORT=8000
    SECRET_KEY=hariharanReddyqwertyuiopasdfghjk
    DATABASE=Item-Manager-1
    SENDER_EMAIL=animatrix536@gmail.com
    SENDER_PASSWORD=vffzxtibzapdozpn
    ```

5. **Run the server and client simultaneously:**

    ```shell
    cd server
    npm start
    ```

    ```shell
    cd client
    npm run dev
    ```

6. **Access the application in your browser:**

    Open your web browser and visit `http://localhost:5173` to use the Library Management System.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

