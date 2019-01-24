const Course = require('./models/course');
const express = require('express');
const Joi = require('joi');

let indexHtml = '';
let courses = [
    new Course(1, 'Chinese'),
    new Course(2, 'English'),
    new Course(3, 'French literature'),
];


const app = new express();
app.use(express.json()); //Using middleware with which the app can accept json post

function loadIndexHtml() {
    var fs = require('fs');
    indexHtml = fs.readFileSync('./static/index.html', 'utf8')
};

// Home page
app.get('/', (req, res) => {
    res.send(indexHtml);
});

// Get list
app.get('/api/courses', (req, res) => {
    console.dir(courses)
    res.send(courses);
});

// Get, fetch specific resource
app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The source with the vien ID was not found.')
    } else {
        res.send(course);
    }
});

// Post, adding new resource
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    //console.log(result);
    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        const course = new Course(courses.length + 1, req.body.name);
        courses.push(course);
        res.send(course);
    }
});

// Put, update specific resource
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        course.name = req.body.name;
        res.send(course);
    }
});

// Delete, remove specific resource
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The source with the vien ID was not found.')
    } else {
        const index = courses.indexOf(course);
        courses.splice(index, 1);
        res.send(courses);
    }
})

// Validating course using package Joi
function validateCourse(course) {
    const schema = { name: Joi.string().min(3).required() };
    return Joi.validate(course, schema);
}

loadIndexHtml();
const port = process.env.PORT || 8080;
app.listen(port,
    () => {
        console.log('Listening on port ' + port + '...')
    });