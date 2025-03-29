# Money Server

This is the backend server for the Money application. Follow the steps below to set up and run the server.

## Prerequisites

Make sure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

    Replace `<repository_url>` with the actual URL of your repository and `<repository_directory>` with the name of the directory you cloned into.

2.  **Add Environment Variables:**

    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```plaintext
    DATABASE_URL="postgresql://neondb_owner:npg_qiL3cZuYUG2d@ep-shrill-art-a5ibw0r4-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
    JWT_SECRET="your_secret_key"
    PORT=8080
    ```

    -   Replace `"your_secret_key"` with a strong, secure secret key.
    -   Ensure your `DATABASE_URL` is correct.

3.  **Run Prisma Migrations:**

    ```bash
    npx prisma migrate dev
    ```

    This command applies the database migrations to your development database.

4.  **Install Dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Or, using yarn:

    ```bash
    yarn install
    ```

5.  **Run the Development Server:**

    Using npm:

    ```bash
    npm run dev
    ```

    This command starts the development server, typically with hot reloading, so changes are reflected immediately.