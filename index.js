const http = require('http');
const fs = require("fs");
const express = require("express");  // Corrected require statement
const app = express();

// Middleware to parse JSON requests
        app.use(express.json());

// Read data from file
        function readDataFromFile(callback) {
        fs.readFile("data.json", "utf-8", (err, data) => {
        if (err) {
        console.error("Error reading file:", err);
        callback([]);
        return;
        }
        callback(JSON.parse(data));
        });
        }

// Write data to file
        function writeDataToFile(data, callback) {
        fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
        console.error("Error writing to file:", err);
        return;
        }
        callback();
        });
        } 

// Get all posts
        app.get('/posts', (req, res) => {
        readDataFromFile((data) => {
     // res.send({ data: data });
        res.json(data);
        }) ;

        });

// create new post 
        app.post('/posts', (req, res)=>{
        readDataFromFile((dataThatReadFromFile)=>{
        dataThatReadFromFile.push(req.body);
        writeDataToFile(dataThatReadFromFile, ()=>{
        res.send({message: "Data saved successfully."})
        })
        })
          console.log(req.body); 
         })

 // Update a post
        app.put('/posts/:id', (req, res) => {
        const id = parseInt(req.params.id);

        readDataFromFile((data) => {
        const index = data.findIndex((item) => item.id === id);

        if (index !== -1) {
        const updatedPost = {
        ...data[index],  //save old data
        title: req.body.title || data[index].title,
        description: req.body.description || data[index].description,
        author: req.body.author || data[index].author,
        date: req.body.date || data[index].date
         };

         data[index] = updatedPost;

         writeDataToFile(data, () => {
         res.json({ message: "Post updated successfully", post: updatedPost });
         });
         } else {
         res.status(404).json({ message: 'Post not found' });
         }
         });
        });


// Delete post
        app.delete('/posts/:id', (req, res) => {
        const id = parseInt(req.params.id);

        readDataFromFile((data) => {
        const index = data.findIndex((item) => item.id === id);

        if (index !== -1) {
        const filteredData = data.filter((item) => item.id !== id);

        writeDataToFile(filteredData, () => {
        res.json({ message: "Post deleted successfully" });
            });
         } else {
        res.status(404).json({ message: 'Post not found' });
        }
        });
        });


// Start the server
       app.listen(3000, () => {
       console.log("Server running on port 3000");
       });

