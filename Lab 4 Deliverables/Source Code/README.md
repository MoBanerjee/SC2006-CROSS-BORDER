Setup instructions-:
```
git clone https://github.com/softwarelab3/2006-SCSD-SimpleOne.git SCSDSimpleOneCrossBorder2006
cd SCSDSimpleOneCrossBorder2006
cd "Lab 4 Deliverables"
cd "Source Code"
```
After executing the above code block, you will need to create a few files to hold the API keys for the app to access.
## You will need to obtain the API keys yourself. The source for each API key has been mentioned in Appendix at the end of this Readme file.
Follow the steps below to create the files-:
1. Create a .env file in the Source Code directory and enter the following in it (replace the empty strings in each line with respective API        keys)-:
   
   MONGO_URI=''
   JWT_SECRET=''
   AWS_ACCESS_KEY_ID=""
   AWS_SECRET_ACCESS_KEY=""
   AWS_REGION=""
   AWS_BUCKET_NAME=""

2. Open the API_KEYS.jsx file in IDE. The path to the file is Source Code/client/src/pages/API_KEYS.jsx. Replace the empty strings with   
   respective API keys.

   const NEWS_API_KEY="";
   const X_RapidAPI_Key='';
   const GOOGLE_MAPS_API_KEY='';

3. Open the firebase.config.js file in IDE. The path to the file is Source Code/client/src/pages/firebase.config.js. Complete the firebase 
   configuration credentials in the section highlighted below.

   const firebaseConfig = { \br
   apiKey: "",
   authDomain: "",
   projectId: "",
   storageBucket: "",
   messagingSenderId: "",
   appId: "",
   measurementId: ""
   };

4. 

   
   
   
