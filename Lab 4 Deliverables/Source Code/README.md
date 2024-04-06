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
1. Create a .env file in the Source Code directory and enter the following in it (replace the empty strings in each line with respective API        keys)-: <br>
   
   MONGO_URI='' <br>
   JWT_SECRET='' <br>
   AWS_ACCESS_KEY_ID="" <br>
   AWS_SECRET_ACCESS_KEY="" <br>
   AWS_REGION="" <br>
   AWS_BUCKET_NAME="" <br>

2. Open the API_KEYS.jsx file in IDE. The path to the file is Source Code/client/src/pages/API_KEYS.jsx. Replace the empty strings with   
   respective API keys.

   const NEWS_API_KEY=""; <br>
   const X_RapidAPI_Key=''; <br>
   const GOOGLE_MAPS_API_KEY=''; <br>

3. Open the firebase.config.js file in IDE. The path to the file is Source Code/client/src/pages/firebase.config.js. Complete the firebase 
   configuration credentials in the section highlighted below.

   const firebaseConfig = { <br>
   apiKey: "",<br>
   authDomain: "",<br>
   projectId: "",<br>
   storageBucket: "",<br>
   messagingSenderId: "",<br>
   appId: "",<br>
   measurementId: ""<br>
   };<br>

4. Open the GEMINI_API_KEY.py file in IDE. The path to the file is Source Code/client/src/pages/Bot/geminichat/GEMINI_API_KEY.py. Replace the    
   empty string with Gemini API key.

   Gemini_API_KEY=""

After obtaining all the API keys, continue executing the code segments below-:

Create 3 terminals using Split Terminal command ( we will refer to them henceforth as T1, T2 and T3)

In T1, run this code-:
```
sudo npm install
```
In T2, run this code-:
```
cd client
sudo npm install
```
In T3, run this code-:
```
cd client/src/pages/Bot/geminichat
pip install -r requirements.txt
streamlit run 1_Gemini_Pro.py
```
This will immediately launch the Gemini chatbot in your browser. You can close the tab and return to the terminal

Run this below code segment for setting up Redis server in PC terminal (not IDE terminal)
```
brew update
brew install redis
brew services start redis
redis-cli ping
```
After running "redis-cli ping" command you will get a PONG response which confirms that the Redis server has successfully started.

Back to T1, run this code-:
```
sudo node app.js
```
This command may give some errors of some node modules not getting located. In such a scenario, simply delete the node_modules directory in the Source Code directory and rerun this command-:

```
sudo npm install
sudo node app.js
```
The command can be considered to be successful once you get this response in T1-:

Server is listening on port 3000

(You can ignore any other warnings in T1 that may come along with this response)

Then in T2, run this code-:
```
sudo npm run dev
```
The command can be considered to be successful once you get this response in T2-:

> react-app@0.0.0 dev
> vite


  VITE v5.2.4  ready in 339 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
   
(You can ignore any other warnings in T2 that may come along with this response)

### Next, copy this URL "http://localhost:5173/" in your browser address bar and the App (hosted on localhost) will be successfully running with the Landing page visible
