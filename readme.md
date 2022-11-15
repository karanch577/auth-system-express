## This is a Auth-System build using express and MongoDB

## Topics covered in this project
- Store the encrypted password in Database using `bcryptjs` and again verify the password with the encrypted password.
- used `jsonwebtoken` to create jwt token
- The token is then store in the browser's cookie using the `cookie-parser` middleware
- custom middleware is also used for authentication
- The ODM `mongoose` is used.

## Routes available
- `/`
- `/signup`
- `/signin`
- `/signout`
- `/dashboard`