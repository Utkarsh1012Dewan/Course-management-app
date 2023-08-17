// Create a course selling website
// Description
// Admins should be able to sign up
// Admins should be able to create courses
// Course has a title, description, price, and image link
// Course should be able to be published
// Admins should be able to edit courses
// Users should be able to sign up
// Users should be able to purchase courses
// Users should be able to view purchased courses
// Users should be able to view all courses
// Routes


// ADMIN ROUTES:

// POST /admin/signup Description: Creates a new admin account. Input: { username: 'admin', password: 'pass' } Output: { message: 'Admin created successfully' }

// POST /admin/login Description: Authenticates an admin. It requires the admin to send username and password in the headers. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { message: 'Logged in successfully' }

// POST /admin/courses Description: Creates a new course. Input: Headers: { 'username': 'admin', 'password': 'pass' } Input: Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true } Output: { message: 'Course created successfully', courseId: 1 }

// PUT /admin/courses/:courseId Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited. Input: Headers: { 'username': 'admin', 'password': 'pass' } Input: Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink: 'https://updatedlinktoimage.com', published: false } Output: { message: 'Course updated successfully' }

// GET /admin/courses Description: Returns all the courses. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] } User Routes:


// USER ROUTES

// POST /users/signup Description: Creates a new user account. Input: { username: 'user', password: 'pass' } Output: { message: 'User created successfully' }

// POST /users/login Description: Authenticates a user. It requires the user to send username and password in the headers. Input: Headers: { 'username': 'user', 'password': 'pass' } Output: { message: 'Logged in successfully' }

// GET /users/courses Description: Lists all the courses. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

// POST /users/courses/:courseId Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { message: 'Course purchased successfully' }

// GET /users/purchasedCourses Description: Lists all the courses purchased by the user. Input: Headers: { 'username': 'admin', 'password': 'pass' } Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(user,pass){
  for (let i = 0; i< ADMINS.length;i++){
    if (ADMINS[i].username == user){
      return -1
    }
    else{
      return true
    }
  }
}

const userAuthentication = (req,res,next) => {
  const {username,password} = req.headers
  const user = USERS.find(u => u.username === username && u.password === password)

  if(!user){
    req.user = user
    next();
  }
  else{
    res.status(403).json({message:'User authentication failed'})
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let username = req.body.username
  let password = req.body.password

  let admin =  adminAuthentication(username,password)

  if(admin){
    res.status(404).json({message:"admin already exists"})
  }
  else{
    ADMINS.push({
      'username':username,
      'password':password
    })
    res.json({message:'Admin successfully created'})
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username,password} = req.headers

  let admin = adminFind(username,password)

  if(!admin){
    res.status(404).send('Authentication failed')
  }
  else{
    res.json({message:'logged in successfully'})
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const course = req.body
  let count = 0
  const {username,password} = req.headers

  let admin = adminFind(username,password)

  if(!admin){
    res.status(404).jason({message:'Admin authentication failed'})
  }
  else{
    course.id = count
    COURSES.push(course)
    res.json({message:'Course added successfully'})
    count +=1
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const { username, password } = req.headers;
  let admin = adminAuthentication(username, password);

  if (!admin) {
    res.status(404).json({ message: "admin authentication failed" });
  } else {
    const id = req.params.coursId;
    let course = COURSES.find(c => c.id = courseId);

    if (!course) {
      res.status(404).json({ message: 'Course does not exist' });
    }
    else{
      Object.assign(course,req.body)
      res.json({message:'Course updated successfully'})
    }
  }
});


app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const {username,password} = req.headers

  let admin = adminAuthentication(username,password)

  if(!admin){
    res.status(404).json({message:'Admin authentication failed'})
  }
  else{
    res.json({courses:COURSES})
  }
});

// User routes
app.post('/users/signup', userAuthentication, (req, res) => {

  // logic to sign up user
  const user ={
    username: req.body.username,
    password: req.body.password,
    purchasedList: []
  }
  USERS.push(user)
  req.json({message:'User created successfully'})

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  res.json({message:'Logged in successfully'})
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  let getCourses = []
  for (let i=0;i<COURSES.length;i++){
    if(COURSES[i].published){
      getCourses.push(COURSES[i])
    }
  }
  res.json({courses:getCourses})
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  const id = Number(req.params.courseID)
  const course = COURSES.find(c => c.id === courseID && c.published)

  if(course){
    req.user.purchasedList.push(course)
    res.json({message:'Course purchased successfully'})
  }
  else{
    req.status(404).json({message:'Requested course does not exist'})
  }

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});