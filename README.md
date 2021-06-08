
# GymJot (Server-side/ Backend)

A *powerlifting-focused* web-app designed for tracking weight statistics and creating custom weightlifting programs.

- This repository houses the server-side of my web application *GymJot*. As such, most of the details mentioned here are largely back-end related. If you want to learn more about my front-end, please visit [GymJot's client-side repository](https://github.com/Haz-git/GymJot-Client)!

### About The Project

*GymJot* was developed to improve the workflow of one of my most favorite hobbies-- powerlifting. Normally, I'd create my powerlifting training
regiments on something like *Excel* or *Google Drive*, and then take a picture of the spreadsheet to carry to the gym. Then, all my weightlifting statistics
are simply stored in the *Notes* app on my iphone. Taking multiple pictures of my main exercises for the week and fervently searching through a long list of weight records was clunky and unappealing.

I decided to leverage my development skills to create my own progressive web-app (PWA) to solve my issue. With *GymJot*, I can store all my stats + create and run my custom workout routines on the same app!

#### Built With
- Node JS
- Express
- Mongoose
- Mongo DB

*For more tools used, see **acknowledgements***.





## Demo

*Although desktop browser support is available, installing GymJot on your mobile device as a PWA on IOS or Android is highly recommended as GymJot was intended for use on Mobile!*

1. Go to [GymJot's website](https://gymjot.netlify.app/) on your phone or desktop browser.
2. If you are on mobile, be sure to install the app as a PWA to maximize experience.
3. Navigate to 'Join Us' to create a new account.
4. 'Log in' to start exploring the app! *For new users, the tutorial is highly recommended*.

  
## Features

*This is a private API built for organizing and exercizing the storage and dispatch of user data to and from the client-side of **GymJot**. This API communicates to a Document Object Model database hosted on Mongo DB Atlas.*

*For a comprehensive features list, please visit the client-side repository.*
## Authors

- [@Haz-git](https://github.com/Haz-git)
- [Personal Website / Contact Me](https://zharry.me/)

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  
## Acknowledgements
*The following are some additional packages/technologies used in the creation of this app:*

- bcryptjs
- body-parser
- cors
- dayjs
- debug
- dotenv
- express-mongo-sanitize
- express-rate-limit
- helmet
- hpp
- jsonwebtoken
- lodash.has
- nodemon
- passport
- passport-jwt
- uuid
- validator
- xss-clean

  
