# Cross Border

<img width="1000" alt="Screenshot 2024-04-07 at 2 42 28 AM" src="https://github.com/softwarelab3/2006-SCSD-SimpleOne/assets/115227638/abfbc891-dfb9-4263-acb6-a720c912213c">

## Overview

Cross Border is a web application developed by Team SimpleOne, aimed at improving the living and working experience of migrant workers in Singapore. By providing access to essential services and information, Cross Border serves as a user-centric platform that navigates users through daily life in Singapore, offering features like a currency exchange calculator, navigation routes, directory of nearby amenities, personalized news feed, and an AI chatbot for assistance.

## Features

User Registration and Profile Management: Allows users to create an account, manage their profile information, and personalize services. <br>

Currency Converter: Provides currency exchange information between SGD and the currency of the user's home country.<br>

Navigation and Amenities Finder: Offers detailed route information via public transport and locates nearby amenities like MRT stations, bus stops, eateries, shops, and hospitals.<br>

News Viewer: Delivers a personalized news feed to keep users informed about the latest happenings in Singapore or their home country.<br>

AI Chatbot: Answers user queries, providing an interactive and helpful resource for information.<br>

## Tech Stack Used

<img width="547" alt="Screenshot 2024-04-07 at 2 36 05 AM" src="https://github.com/softwarelab3/2006-SCSD-SimpleOne/assets/115227638/2a40b05c-b46c-469e-86a6-a377209c653b">

### Front-end was mainly made using React (version 18.2.0) and Back-end was mainly made using Node.js (version 21.4.0)

## Directory Structure
```plaintext
Lab 4 Deliverables/Source Code/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── contexts/
│       ├── pages/
│       ├── styles/
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── responsive.css
│       └── tailwind.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── controllers/
├── db/
├── middleware/
├── models/
├── routes/
├── app.js
├── package-lock.json
├── package.json
└── README.md
```

## Setup instructions

Copy this code block to your IDE terminal

```
git clone https://github.com/softwarelab3/2006-SCSD-SimpleOne.git SCSDSimpleOneCrossBorder2006
cd SCSDSimpleOneCrossBorder2006
```
After executing the above code block, you will need to create a few files to hold the API keys for the app to access.
## You will need to obtain the API keys yourself. The source for each API key has been mentioned in Appendix at the end of this Readme file.
Follow the steps below to create the files-:
1. Create a .env file in the "SCSDSimpleOneCrossBorder2006/Lab 4 Deliverables/Source Code" directory. Enter the following in it (replace the empty strings in each line with respective API keys)-: <br>
   
   MONGO_URI='' <br>
   JWT_SECRET='' <br>
   AWS_ACCESS_KEY_ID="" <br>
   AWS_SECRET_ACCESS_KEY="" <br>
   AWS_REGION="" <br>
   AWS_BUCKET_NAME="" <br>

2. Open the API_KEYS.jsx file in IDE editor. The path to the file is "SCSDSimpleOneCrossBorder2006/Lab 4 Deliverables/Source Code/client/src/pages/API_KEYS.jsx". Replace the empty strings with   
   respective API keys.

   const NEWS_API_KEY=""; <br>
   const X_RapidAPI_Key=''; <br>
   const GOOGLE_MAPS_API_KEY=''; <br>

3. Open the firebase.config.js file in IDE editor. The path to the file is "SCSDSimpleOneCrossBorder2006/Lab 4 Deliverables/Source Code/client/src/pages/firebase.config.js". Complete the firebase 
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

4. Open the GEMINI_API_KEY.py file in IDE editor. The path to the file is "SCSDSimpleOneCrossBorder2006/Lab 4 Deliverables/Source Code/client/src/pages/Bot/geminichat/GEMINI_API_KEY.py". Replace the    
   empty string with Gemini API key.

   Gemini_API_KEY=""

After obtaining all the API keys, continue executing the code segments below-:

Ensure that your present working directory is SCSDSimpleOneCrossBorder2006 <br>
If yes, then run this code-:

```
cd "Lab 4 Deliverables"
cd "Source Code"
```
After that, create 3 terminals using Split Terminal command ( we will refer to them henceforth as T1, T2 and T3)

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
```plaintext
Server is listening on port 3000
```
(You can ignore any other warnings in T1 that may come along with this response)

Then in T2, run this code-:
```
sudo npm run dev
```
The command can be considered to be successful once you get this response in T2-:

```plaintext
> react-app@0.0.0 dev<br>
> vite


  VITE v5.2.4  ready in 339 ms

  ➜  Local:   http://localhost:5173/ <br>
  ➜  Network: use --host to expose<br>
  ➜  press h + enter to show help<br>
 ```
  
(You can ignore any other warnings in T2 that may come along with this response)

### Next, copy this URL "http://localhost:5173/" in your browser address bar and the App (hosted on localhost) will be successfully running with the Landing page visible

## Appendix
API Documentations and Source of API keys/Configuration credentials-:

Mongodb-: https://www.mongodb.com/cloud/atlas/register?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_general_prosp-brand_gic-null_apac-sg_ps-all_desktop_eng_lead&utm_term=mongo%20database&utm_medium=cpc_paid_search&utm_ad=p&utm_ad_campaign_id=7854364247&adgroup=81978310976&cq_cmp=7854364247&gad_source=1&gclid=Cj0KCQjw5cOwBhCiARIsAJ5njubc1O2i4Kgp3TEFhi7aDbnvPdH22XjA5FeL6UVEwgTItIjvJRji1zQaAksMEALw_wcB

AWS S3-: https://aws.amazon.com/pm/serv-s3/?gclid=Cj0KCQjw5cOwBhCiARIsAJ5njubaxT1o6P0QCLALESeQJ3ACpZIkDEHiF2u-OfBIxfUqgMQyenVFeYkaArYnEALw_wcB&trk=55ffcfa3-95d3-4418-9a79-62a64040b867&sc_channel=ps&ef_id=Cj0KCQjw5cOwBhCiARIsAJ5njubaxT1o6P0QCLALESeQJ3ACpZIkDEHiF2u-OfBIxfUqgMQyenVFeYkaArYnEALw_wcB:G:s&s_kwcid=AL!4422!3!536452732958!e!!g!!aws%20s3!11543056249!112002966709

Firebase API-: https://firebase.google.com/

Google Places API-: https://developers.google.com/maps/documentation/places/web-service/overview

Gemini API-: https://ai.google.dev/?gad_source=1&gclid=Cj0KCQjw5cOwBhCiARIsAJ5njuboxAVXySbu3orKNUolbT1A7EUjHwLbAZStb3QeF78IeOePkmyYpvwaAkcZEALw_wcB

News API-: https://newsapi.org/

Currency-converter API-: https://rapidapi.com/airaudoeduardo/api/currency-converter241

## Development Team

Aishwarya Anand <br>
Banerjee Mohor <br>
Chan Jie Ying Jolene <br>
Chen Guan Zong Aaron <br>
Poonawala Mustafa Jabir <br>

### Prepared by Team SimpleOne at Nanyang Technological University for course SC2006 Software Engineering
