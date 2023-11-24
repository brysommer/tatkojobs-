import { google } from "googleapis";
import { dataBot } from './values.js';

const spreadsheetId = dataBot.googleSheetId;
const sheetName = dataBot.googleSheetName;

const auth = new google.auth.GoogleAuth({
  keyFile: "googlecredits.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const getClient = async () => {
  return await auth.getClient();
};

const getSheetsInstance = (client) => {
  return google.sheets({ version: "v4", auth: client });
};

const writeGoogle = async (diapason, data) => {
  const range = `${sheetName}!${diapason}`;
  const client = await getClient();
  const sheets = getSheetsInstance(client);
  const request = {
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values: data },
  };
  const response = await sheets.spreadsheets.values.update(request);
  return response.data;
};

const readGoogle = async (diapason) => {
  const range = `${sheetName}!${diapason}`;
  const client = await getClient();
  const sheets = getSheetsInstance(client);
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  if (response.data.values) {
    if (response.data.values.length > 1) return response.data.values.map(row => row[0]);
    return response.data.values[0];
  } 
  return response.data;
};

export { writeGoogle,  readGoogle }
