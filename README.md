# odin-book

Frontend component of a social media site created as a final project piece as part of the Odin Project curriculum: https://www.theodinproject.com/lessons/nodejs-odin-book

Try it here: https://melanie-j-baker.github.io/odin-book/

To see backend component code (Express): https://github.com/Melanie-J-Baker/odin-book-api. To use backend Express API: https://odin-book-express-api.glitch.me

A social media app (with most of the core functionality of Facebook/Instagram) was created using Express, MongoDB/Mongoose, React, passport-jwt, bcrypt and cloudinary (to handle image uploads). Core features of the chosen social media platform (Facebook/Instagram) such as users, profiles, posts, following, and “liking” are implemented. Authenticated using passportJS. Faker module from npm was used to populate the database with some default data like users, posts and comments (see populatedb.js).

The following requirements are a very global list of features the app was required to have:

- Users must sign in to see anything except the sign-in page.
- Users should be able to sign in using your chosen authentication method.
- Users can send friend requests to other users.
- Users can create posts (begin with text only).
- Users can like posts.
- Users can comment on posts.
- Posts should always display the post content, author, comments, and likes.
- There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
- Users can create a profile with a profile picture.
- A user’s profile page should contain their profile information, profile photo, and posts.
- There should be an index page for users, which shows all users and buttons for sending friend requests to users the user is not already following or have a pending request.

Extra credit:

- Make posts also allow images (Cloudinary was used for hosting user-uploaded images. The URLs Cloudinary provides are stored in database instead of the raw image binary data).
- Allow users to update their profile photo.
- Create a guest sign-in functionality that allows visitors to bypass the login screen without creating an account or supplying credentials

react-idle-timer was used to log out user after 30 minutes of inactivity.

![image](https://github.com/user-attachments/assets/056c2b13-75c9-4ed1-9272-aa03c48deb1c)
![image](https://github.com/user-attachments/assets/8a89d6e6-c915-4e8b-ab00-bd3f9a7172cc)
![image](https://github.com/user-attachments/assets/a3ad0150-9673-4c7a-9493-a96678b32eca)
![image](https://github.com/user-attachments/assets/1a68993f-1693-4f99-a942-dac20b38e830)
![image](https://github.com/user-attachments/assets/9e57da76-dce6-4c88-b19c-2342b242fa01)
![image](https://github.com/user-attachments/assets/da7dfadc-0797-4620-848c-474b6f46dc91)
![image](https://github.com/user-attachments/assets/2acfaf15-0287-4319-a4e1-73ec5dfb5001)
![image](https://github.com/user-attachments/assets/760f2dce-5b31-4cc8-8d50-3c69f35ace41)
![image](https://github.com/user-attachments/assets/3f28f4f5-26c8-44fa-bd0a-80155f4abe08)
![image](https://github.com/user-attachments/assets/bf91e075-e384-46f4-a465-4e5367c55bb8)
