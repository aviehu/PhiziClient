# <center> Phizi Maintenance Guide </center>

## Table of Contents
1. [Introduction](#introduction)
2. [Client Side](#client-side)
    * [Directory](#client-directory)
    * [Pages](#pages)
    * [Skeleton](#skeleton)
    * [deployment](#deployment)
3. [Server Side](#server-side)
   * [Directory](#server-directory)
   * [Routes](#routes)
   * [Data Types](#data-types)

## Introduction
Our system has 2 main parts, Client and Server. the Client is created with create-react-app
and uses react js as framework. the server is based on node.js using the express.js npm library. 
The Client uses the Blaze pose - MediaPipe Model to predict the users skeleton and handles all the calculations.
The Server acts as a simple API server to support the Client side and uses a mongodb instance hosted in Atlas as database.

## Client Side

make sure you have node.js installed.

then run `npm install` to install all the app dependencies 

after that fill in the necessary env vars in the .env file:
```js
REACT_APP_SERVER_URL // the base url of the api server for this client
REACT_APP_SCREENSHOT_QUALITY // what should be the quality of the screenshot sent to the blaze pose model
REACT_APP_SCORE_THRESHOLD // the score thershold to which we filter the landmarks
REACT_APP_SAMPLED_VIDEO_WIDTH // the width of the video displayed to the user
```

once all is set up run `npm start` and the app will be opened on the browser

### Client Directory
The client side is a create-react-app project. the main files are split to 2 main folders:
* `component` folder - holds all of our custom react components used in various pages.
* `pages` folder - holds all the pages for each route in the app.

Other folders include:
* `context` folder - holds all the created context used in the app. currently we only use the `user` context.
* `hooks` folder - holds all of our custom hooks used in the app.
* `poseMatching` folder - includes the needed files the match the user pose.
* `test` folder - includes the various tests that we run on the client side
* `util` folder - includes the various files for non react functions. for example the functions involving the drawing 
on the canvas or the client side api

### Pages

Using react router we assign each page a route in the `App.js` file.

#### adding a page
To add a new page - add a react component under the pages folder, import that component in the app.js file,
add ```<Route path="/[yourPathHere]" Component={[ImportedComponentHere]}/>``` inside the ```<Routes>``` <br/>
paths which have `:[someParam]` in the path allows the page to uses that param in the component file using useRouter().
once done add the page description and other necessary info down here.

#### `/` - WelcomePage
A page welcoming the user.

#### `"/login"` - LoginPage
The login page where a user can log in as an admin, therapist or regular user.

#### `/register` - RegisterPage
This page is only available to Admins or therapists, the page is used to add another admin / therapists to the system
while also allowing admins or therapists to register new users.

#### `/app` - AppPage
When the page loads the user's available sessions will be loaded from the server to the page and load the Blaze pose model to the page.
the page will then display the users video taken from the user's video camera, and the available sessions.
when the user presses the start game button we start the main loop - `draw()`.
because react state can't handle such quick changes to the state (sampling as quick as we can) it is important not to
store the user's skeleton in the state, instead we, for each frame, directly draw the skeleton on the canvas that is on top 
of the video, we also check if there is a match between the user's skeleton and the target position.
when there is a match we increase the index for the current position in the session until the user finishes the session.
once the user finish, we send the server the user score.

#### `/poses` - AddPosePage
This page allows te user to add a new pose:
it has two modes:
* take a picture - uses the `PoseFromWebcam` component that is similar to the App page, allows the therapist / admin to take
a picture of themselves.
* upload picture - allows the admin / therapist to upload an existing picture, after it is loaded it is sent to the 
Blaze pose model where a skeleton is extracted.

#### `/users` - UsersPage
This page is only available to admins / therapist and allows the admin / therapist to view all the users registered by them
and edit a user's goals. the page sends the server a request for the users using the user's info and displays the result
in a table.

#### `/scores` - ScoresPage
This page displays the user progress. when changing any of the filter the page will display, using charts from the 
`recharts` library.

#### `/users/:userEmail` - EditUserProfile
This page load the user's info, based on the userEmail that we receive through the url using the react router.
it allows the user to edit the user, that has been registered by him, info. 

### Skeleton
The landmark model in MediaPipe Pose predicts the location of 33 pose landmarks

![pose_tracking_full_body_landmarks.png](https://mediapipe.dev/images/mobile/pose_tracking_full_body_landmarks.png) |

when estimating a pose we receive the following JSON from the model:
```js
[
   {
      "keypoints": [
         {
            "x": 142.4337923526764,
            "y": 81.65432214736938,
            "z": -0.8611863255500793,
            "score": 0.9999587535858154,
            "name": "nose"
         },
//       ... 31 more, 1 for each landmarks
      ],
      "keypoints3D": [
         {
            "x": 0.015501588582992554,
            "y": -0.5659096240997314,
            "z": -0.3059847056865692,
            "score": 0.9999587535858154,
            "name": "nose"
         },
//       ... 31 more, 1 for each landmarks
      ]
   }
]
```

#### keypoints object
the keypoints array contains exactly 32 objects each having the 5 attributes:
* x - The estimated x position of the landmark in the picture given to the model.
* y - The estimated y position of the landmark in the picture given to the model.
* z - The estimated z position of the landmark in the picture given to the model. we don't use this
* score - the confidence the model has in the landmark - [0, 1]
* name - the name of the landmark

when you want to use this value in the code, don't access directly but instead call get2DPositions.
this function will also filter the landmarks that are below the score threshold.

#### keypoints3D object
the keypoints3D array contains exactly 32 objects each having the 5 attributes:
* x - The estimated x position of the landmark as an offset from the center of the user's hip.
* y - The estimated y position of the landmark as an offset from the center of the user's hip.
* z - The estimated z position of the landmark as an offset from the center of the user's hip
* score - the confidence the model has in the landmark - [0, 1]
* name - the name of the landmark

when you want to use this value in the code, don't access directly but instead call get3DPositions.
this function will also filter the landmarks that are below the score threshold.


### Deployment

Because we used create-react-app building the app's image and deploying is very easy 

building an image: `npm run build`

currently the app is hosted in Cloud Flare and when the main branch is updated 
a new image is created at Cloud Flare and served in the same URL.


## Server Side

The server is an express.js server with a connection to a mongoDB instance using the 
library `mongoose`

make sure you have node.js installed.

then run `npm install` to install all the app dependencies

after that fill in the necessary env vars in the .env file:
```js
port // the port the server listens on
MONGODB_URI // the mongoDB connection string
```

once all is set up run `npm start` and the server will start listening


### Server Directory

* `controllers` - contains the controller for each type of information that is being read or 
saved. the controllers contain the function that are passed to the router.
* `models` - contains the mongoose Schema of each data type, a mongoose schema is the structure of the table.
* `routes` - contains the routes for each data type request in the router
* `test` - includes the various tests that we run on the server side

### Routes

#### Pose Router

| URL                         | Method | URL Params | Body                        | Success Response                    | Error Response |
|-----------------------------|--------|------------|-----------------------------|-------------------------------------|----------------|
| /api/poses/addPose          | POST   | ~          | [Pose Object](#pose-object) | 201                                 | 400            |
| /api/poses/deletePose/:name | DELETE | name       | ~                           | 200                                 | 404            |
| /api/poses/getAllposes      | GET    | ~          | ~                           | 200 - [Pose Object](#pose-object)[] | 400            |
| /api/poses/getPosesByGoals  | POST   | ~          | { goals: string[] }         | 200 - [Pose Object](#pose-object)[] | 400            |

#### Score Router

| URL                                   | Method | URL Params | Body                          | Success Response                      | Error Response |
|---------------------------------------|--------|------------|-------------------------------|---------------------------------------|----------------|
| /api/scores/addPose                   | POST   | ~          | [Score Object](#score-object) | 201                                   | 400            |
| /api/scores/getSessionScores/:session | GET    | session    | ~                             | 200 - [Score Object](#score-object)[] | 400            |
| /api/scores/getUserScores/:user       | GET    | user       | ~                             | 200 - [Score Object](#score-object)[] | 400            |

#### User Router

| URL                       | Method | URL Params | Body                              | Success Response                    | Error Response |
|---------------------------|--------|------------|-----------------------------------|-------------------------------------|----------------|
| /api/users/register       | POST   | ~          | [User Object](#user-object)       | 201                                 | 400            |
| /api/users/login          | POST   |            | {email: string, password: string} | 200 - [User Object](#user-object)   | 400            |
| /api/users/getUser/:email | GET    | email      | ~                                 | 200 - [User Object](#user-object)   | 400            |
| /api/users/getAllUsers    | GET    | ~          | ~                                 | 200 - [User Object](#user-object)[] | 400            |
| /api/users/updateUser     | POST   | ~          | [User Object](#user-object)       | 200                                 | 400            |

#### User Router

| URL                               | Method | URL Params | Body                              | Success Response                                                                                 | Error Response |
|-----------------------------------|--------|------------|-----------------------------------|--------------------------------------------------------------------------------------------------|----------------|
| /api/sessions/getSession/:name    | GET    | name       | ~                                 | 201 - [Session Object](#session-object)                                                          | 400            |
| /api/sessions/addSession          | POST   | ~          | [Session Object](#session-object) | 200 - [Session Object](#session-object)                                                          | 400            |
| /api/sessions/deleteSession/:id   | DELETE | id         | ~                                 | 200                                                                                              | 400            |
| /api/sessions/updateSession/:name | POST   | name       | [Session Object](#session-object) | 200                                                                                              | 400            |
| /api/sessions/getAllSessions      | GET    | ~          | ~                                 | 200 - [Session Object](#session-object)[]                                                        | 400            |
| /api/sessions/getSessionForUser   | POST   | ~          | ~                                 | 200 - {session: [Session Object](#session-object), sessionPoses: [Pose Object](#pose-object)[]}  | 400            |

### Data Types

##### Pose Object
```js
{
   goals // an array of strings for goals matching this pose
   keypoints // an array of Part Objects
   keypoints3D // an array of Part Objects
}
```

##### Part Object
```js
{
   part // the name of the landmark
   x // a number - The estimated x position of the landmark as an offset from the center of the user's hip.
   y // a number - The estimated y position of the landmark as an offset from the center of the user's hip.
   z // a number - The estimated z position of the landmark as an offset from the center of the user's hip
}
```

##### Score Object
```js
    user // string - the user name 
    session // string - the session name
    duration // number - time in seconds to complete
    date // Date - the date the session occurd 
```

##### User Object
```js
    name // string - user's name
    email // string - user's email
    password // string - user's password
    age // number - user's age
    weight // number - user's weight
    height // number - user's height
    bmi // number - user's bmi
    goals // string[] - user's goals
    role // string - user's role
```

##### Session Object
```js
    name // string - session name
    description // string - session description
    difficulty // number - session difficulty - 1-10
    poses // string[] - poses names
    goals // string[] - session's goals
```