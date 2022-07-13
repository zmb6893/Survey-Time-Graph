/** App.js */
import React, { useState } from "react";

// Custom components
import Heatmap from "./views/Heatmap";

// Styling
import "./styles.css";

// Set the dimensions of the graph
const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};

const weight = {
  "Never": 0,
  "Once or Twice": 1,
  "Occasionally": 2,
  "Often": 3,
  "Always": 4
}

export default function App() {  
  var jsonData = {
    'Sunday': {day: 'Sun', dayValue: 0, am: [0,0,0,0,0,0,0,0,0,0,0,0], pm: [0,0,0,0,0,0,0,0,0,0,0,0]},
    'Monday': {day: 'Mon', dayValue: 1, am: [0,0,0,0,0,0,0,0,0,0,0,0], pm: [0,0,0,0,0,0,0,0,0,0,0,0]},
    'Tuesday': {day: 'Tue', dayValue: 2, am: [0,0,0,0,0,0,0,0,0,0,0,0], pm: [0,0,0,0,0,0,0,0,0,0,0,0]},
    'Wednesday': {day: 'Wed', dayValue: 3, am: [0,0,0,0,0,0,0,0,0,0,0,0], pm: [0,0,0,0,0,0,0,0,0,0,0,0]},
    'Thursday': {day: 'Thu', dayValue: 4, am: [0,0,0,0,0,0,0,0,0,0,0,0], pm: [0,0,0,0,0,0,0,0,0,0,0,0]},
    'Friday': {day: 'Fri', dayValue: 5, am: [0,0,0,0,0,0,0,0,0,0,0,0], pm: [0,0,0,0,0,0,0,0,0,0,0,0]},
    'Saturday': {day: 'Sat', dayValue: 6, am: [0,0,0,0,0,0,0,0,0,0,0,0], pm: [0,0,0,0,0,0,0,0,0,0,0,0]},
  };

  var parsedJsonData = new Array(
    jsonData['Sunday'],
    jsonData['Monday'],
    jsonData['Tuesday'],
    jsonData['Wednesday'],
    jsonData['Thursday'],
    jsonData['Friday'],
    jsonData['Saturday'],
  );

  // Hooks
  const [graphColor, setGraphColor] = useState("red");

  const [csvFile, setCsvFile] = useState();

  const [timeData, setTimeData] = useState(parsedJsonData);

  const [theme, setTheme] = useState({
    backgroundColor: 'black',
    border: '1px solid white',
    textColor: 'white'
  });

  

  const fileReader = new FileReader(csvFile);

  const handleOnCSVFileAdded = (e) => {
    setCsvFile(e.target.files[0]);
  }

  const handleOnCSVFileSubmitted = (e) => {
        e.preventDefault(); // prevents the app from reloading all components and other default behavior

        fileReader.onload = function (event) {

          const array = (event.target.result).split("\n");

          /* Store the converted result into an array */
          const csvToJsonResult = [];

          /* Store the CSV column headers into seprate variable */
          const headers = array[0].split(", ");
          const data = headers[0].split('\n');
          const header = data[0].split(',');
          
          let headerArray = new Array();

          for (let entry in header){
            let currentEntry = header[entry].replace(/['"]+/g, '');
            
            headerArray.push(currentEntry.replace(/['"]+/g, '').replace("Check all time slots you are available for. [",'').replace(']',''));
            
          }

          var currentWeight = 0;
          // Loop over the rest of the rows
          for (let i = 1; i < array.length - 1; i++) {
            // Add each of the entries to a json
            let responses = array[i].split(',');
                        
            for (let response in responses){
              
              // Split the response into multiple properties
              let properties = responses[response].split(';');
              
              // Get each individual property of the response
              for (let property in properties){
                // This is either the day or likliehood of attendance
                let field = properties[property].replace(/['"]+/g, '').replace(/[^a-zA-Z ]/g, "")

                // Translate the likliehood of attendance to a weight
                if (header[response].replace(/['"]+/g, '') == header[2].replace(/['"]+/g, '')){ // check for likliehood response
                  currentWeight = weight[field]; // Replace all special characters with empty string
                }
                // Add the weight to the json file 
                else if ((header[response].replace(/['"]+/g, '') != "Timestamp" || header[response].replace(/['"]+/g, '') != "What is your RIT email?") && response > 2 && field){
                  if (response-3 < 12){
                    jsonData[field].am[response-3] += currentWeight;
                  } else if (response-3 > 12){
                    jsonData[field].pm[response-3] += currentWeight;
                  }
                }
              }
            }
          }
          
          setTimeData(parsedJsonData);
        };

        
        const csvString = fileReader.readAsText(csvFile);

  }

  return (
    <div className="App">
      <h1>Time Availability Chart</h1>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div>
          <Heatmap graphColor={graphColor} theme={theme} data={timeData}/>
        </div>
          <div>
            <h2>Instructions:</h2>
            <ol>
              <li>Make a copy of the <a href="https://docs.google.com/forms/d/1Q9GmCV1sBuWhfXHPwB5gfENiLMtLGXoYc9uOl0DU2Sw/edit?usp=sharing" target="_blank" rel="noreferrer noopener" color = "red">Google Form</a> and have members of your group fill it out.</li>
              
              <li>Export the file from google forms as a csv file once all the responses are collected.</li>
              <li>Upload the same csv file to this page.</li>
              <li>Make customizations to the graph.</li>
              <li>View the graph.</li>
            </ol>

            <h2>Upload a CSV File:</h2>
            <form>
              <input type={"file"} accept={".csv"} onChange={handleOnCSVFileAdded}/>
              <h1></h1>
              <button style={{background:"deepskyblue", border:"blue", color:"white", width:100, height:30}} onClick={handleOnCSVFileSubmitted}>Upload</button>
            </form>

            <div>
              <h2>Customizations:</h2>
                <div>
                  <p>Select desired graph color: </p>
                  <select onChange={(e) => {setGraphColor(e.target.value);}}>
                    <option value="red">red</option>
                    <option value="orange">orange</option>
                    <option value="yellow">yellow</option>
                    <option value="lime">green</option>
                    <option value="DeepSkyBlue">blue</option>
                    <option value="magenta">magenta</option>
                    <option value="white">white</option>
                    <option value="black">black</option>
                  </select>
                </div>

                <div>
                  <p>Set the light theme of the graph:</p>
                  <select onChange={(e) => {if(e.target.value === "darkMode"){setTheme({backgroundColor: 'black', border: '1px solid white', textColor: 'white'});} if(e.target.value === "lightMode"){setTheme({backgroundColor: 'white', border: '1px solid red', textColor: 'black'})}}}>
                    <option value="darkMode">dark</option>
                    <option value="lightMode">light</option>
                  </select>
                </div>

                <div>
                  <p>Set the weight of each response (0-100)</p>
                  <input type={"text"} placeholder="Never" style={{width:40}}/>
                  <input type={"text"} placeholder="Once or Twice" style={{width:40}}/>
                  <input type={"text"} placeholder="Often" style={{width:40}}/>
                  <input type={"text"} placeholder="Almost Always" style={{width:40}}/>
                  <input type={"text"} placeholder="Always" style={{width:40}}/>
                </div>
            </div>

          </div>
      </div>
      <p>See more of my projects at <a href="https://zoe-bingham.com" target="_blank" rel="noreferrer noopener">zoe-bingham.com</a></p>      
    </div>
  );
}
