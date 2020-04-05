const monitor = require('active-window');
const fs = require('fs');
const path = require('path');

// refresh interval for saving to the json file
const TIMER = 5;

const date = new Date();

// get today's date
const today = date.getFullYear() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getDate();

// holds the records of the app and their timer
let tracker = {};

tracker.date = today;

// name of the json file to store the record into
const file = `record_${today}.json`

// the file path of the json file, (insice records folder)
filePath = __dirname + '/records/' + file



// check if the file exists,
fs.access(filePath, fs.constants.F_OK, (err) => {
    // if it does not exist (i.e. err)
    console.log(`${filePath} ${err ? 'does not exist' : 'exists'}`);
    if (err) {
        // create a new file in the filePath directory with empty JSON object
        fs.writeFile(filePath, JSON.stringify({}), (err) => {
            // throws an error, you could also catch it here
            if (error) throw error;
        });
    } else {

        // if file already exists, append data to it
        // read the file
        fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
            // if error in reading file, log it
            if (err) {
                console.log(err);
            } else {
                // if data exists, set the tracker object to the read data
                if (data)
                    tracker = JSON.parse(data);
            }
        });
    }
})




callback = function (window) {
    try {
        // if the currently open program already exists in the json file,
        // simple increment the existing timer
        if (window.app in tracker) {
            tracker[window.app].timeSpent += TIMER;
        } else {
            // if this is a new program,
            // create a new record for the program
            tracker[window.app] = {
                app: window.app,
                title: window.title,
                timeSpent: 1
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }


    // write the information to the file, every 5 seconds
    // Todo find better way of writing to file,
    fs.writeFile(filePath, JSON.stringify(tracker), 'utf8', function (err, data) {
        if (err)
            console.log(err)
    });
}


// Run infinite times (-1) and call each TIMER second 
monitor.getActiveWindow(callback, -1, TIMER);