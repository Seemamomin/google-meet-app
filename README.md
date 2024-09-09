step 1: Clone the repository

git clone https://github.com/Seemamomin/google-meet-app.git

step 2: Install Dependencies

    -cd google-meet-integration

    Navigate to the backend folder and install dependencies:
        -cd backend
        -npm install

    Navigate to the frontend folder and install dependencies:
        -cd frontend
        -npm install

step 3: Set Up Environment Variables

    Create a .env file in the backend directory and configure the following environment variables with your Google OAuth credentials:

    CLIENT_ID=your-google-client-id
    CLIENT_SECRET=your-google-client-secret

step 4: Authentication Setup

    To set up OAuth authentication for the Google Calendar API:

    Enable the Calendar API in your Google Cloud project.
    Create OAuth 2.0 credentials (Client ID and Secret).
    Set the REDIRECT_URI in your OAuth credentials to http://localhost:5000/oauth2callback


step 5: Running the Application

    Start the React app:
    -cd frontend
    -npm start
    -This will start the React application on http://localhost:3000.

step 6: Start the backend server

    -cd backend
    -npm start
    -This will start the Express server on http://localhost:5000.

step 7: How to Use

    Navigate to http://localhost:3000 in your browser.
    Enter the type of meeting, start time, and end time in the form.
    Click on "Create Google Meet Session".
    A Google Meet link will be generated, and you can join the session by clicking on the link.


Working demonstration Video link :- 

https://www.loom.com/share/f4d8aed501284b1e821e443e0fd23d6c?sid=fad462b7-06de-4529-ba5f-7ccc68518ef8
