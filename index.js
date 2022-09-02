const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const serverless = require('serverless-http');

const app = express();

// const router = express.Router();

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.render('index');
// });

app.get('/getSheets', async (req, res) => {
  // const { request, name } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1XNLaN_VRdqeCRfjwNj6tRnfLvqCrN2znMW0WQkWSpOo';

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: 'Sheet1!A:M',
  });

  res.send(getRows.data);
});

app.post('/postSheets', async (req, res) => {
  const {
    Truck_No,
    Drivers_Name,
    Drivers_Number,
    Drivers_DOB,
    Drivers_ID,
    Truck_Make,
    Truck_Color,
    VIN,
    Field_ops,
    Field_ops_No,
    Truck_Status,
    Driver_Status,
    Date_of_entry,
  } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1XNLaN_VRdqeCRfjwNj6tRnfLvqCrN2znMW0WQkWSpOo';
  // Write row(s) to spreadsheet
  const postTrucks = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Sheet1!A:B',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [
          Truck_No,
          Drivers_Name,
          Drivers_Number,
          Drivers_DOB,
          Drivers_ID,
          Truck_Make,
          Truck_Color,
          VIN,
          Field_ops,
          Field_ops_No,
          Truck_Status,
          Driver_Status,
          Date_of_entry,
        ],
      ],
    },
  });

  res.send(postTrucks.data);
});

app.listen(1337, (req, res) => console.log('running on 1337'));

module.exports = app;
module.exports.handler = serverless(app);
