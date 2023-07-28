# Bidding Website - Django REST Framework & React

**Note: This project is intended for educational and demonstration purposes only and is not meant for production use. It showcases the integration of Django REST Framework and React to build a bidding website. Please exercise caution and avoid using this project for live deployments.**

This is a full-stack web application for a bidding website that utilizes Django REST Framework for the backend, React for the frontend, and MySQL as the database. The website allows users to bid on various items, send messages to each other, and provides an intuitive and user-friendly interface for managing bids.

## Developed By

- [Aggelos561](https://github.com/Aggelos561) - GitHub Profile
- [NickPolyzois](https://github.com/NickPolyzois) - GitHub Profile

## Features

- User Authentication: Users can sign up, log in, and log out using JWT token-based authentication. New registered users need to be activated by an admin before they can sign in.
- Bidding System: Users can place bids on available items and view their bids. The bidding process includes real-time updates without using WebSockets.
- Messaging: Users can send and receive messages to communicate with each other.
- Item Management: Admin users can add, update, and delete items available for bidding.
- User Profile: Each user has a profile that includes personal information, bid history, and message history.
- Admin Page in React: The website includes an admin page built with React, allowing admin users to update user information and check current auctions through an intuitive interface.
- Matrix Factorization Recommendation System: The backend utilizes a matrix factorization recommendation system to provide personalized item recommendations to users based on their bidding history.
- Bootstrap: The frontend is styled using Bootstrap for a responsive and visually appealing design.

## Installation and Setup

### Backend

1. Install Python and MySQL on your system.

2. Create and activate a virtual environment.

3. Navigate to the backend directory `./BiddingWebsite/`.

4. Install the required Python packages:

   ```
   pip install -r requirements.txt
   ```

5. Set up the MySQL database:
   - Update the database credentials in `./BiddingWebsite/settings.py`.
   - Create a new MySQL database schema named `biddingdb`.
   - Run migrations to create the necessary tables:

   ```
   python manage.py makemigrations Backend
   python manage.py migrate
   ```

6. Create a superuser to access the Django admin:

   ```
   python manage.py createsuperuser
   ```

7. Generate SSL certificates for HTTPS (self-signed certificate):

   ```
   brew install mkcert # If not already installed
   cd ./SSL
   mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1
   ```

8. Start the Django development server with SSL:

   ```
   python manage.py runserver_plus --cert-file ./SSL/cert.pem --key-file ./SSL/key.pem
   ```

### Frontend

1. Navigate to the frontend directory `./Frontend/bidding-app/`.

2. Install the required npm packages:

   ```
   npm install
   ```

3. Start the React development server:

   ```
   npm start
   ```

The frontend will be accessible at `https://localhost:3000/`, and the backend API will be available at `https://localhost:8000/`.

## Admin Panel

- Access the Django admin panel at `https://localhost:8000/admin/`.
- Log in with the superuser credentials created earlier.
- Use the admin panel to manage items, users, messages, and other backend functionalities. Admins can activate new registered users from the admin panel.

## Usage

1. Visit the frontend URL (`https://localhost:3000/`) in your web browser.

2. Sign up as a new user. The admin will need to activate your account before you can log in.

3. Once your account is activated, log in and explore the website.

4. Browse available items and place bids on them.

5. Send and receive messages with other users.

6. Admin users can add new items and manage existing ones through the Django admin panel.

7. Access the admin page in React (`https://localhost:3000/login`) by logging in using admin's credentials.

## Cron Jobs

The backend Django application includes cron jobs to perform various tasks automatically:

- **Recommendation System**: A cron job runs daily to update personalized item recommendations for users using the matrix factorization recommendation system.
- **Disable Auctions**: Another cron job runs every minute to disable auctions that have expired.
- **Enable Auctions**: A cron job runs every minute to enable auctions that are active and not yet expired.
- **Delete Auctions**: A cron job runs every three days to delete old and expired auctions from the database.

## Security Considerations

- The application uses JWT token-based authentication for secure user login and authentication.
- Both the frontend and backend use SSL with self-signed certificates for secure communication.

## Technologies Used

- Django ORM Model: The backend uses the Django ORM model for database operations.
- JWT Token: JWT token-based authentication is used for secure user login.
- Django REST Framework: The backend is built using Django REST Framework to create RESTful APIs.
- React: The frontend is built using React for a dynamic user interface.
- Bootstrap: The frontend is styled using Bootstrap for a responsive design.
