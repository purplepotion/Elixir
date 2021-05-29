# Elixir
## Integrated Public Health Repository System 

## History & Motivation
The widespreads problems and issues present in Indian healthcare system which motivated us to develop **Elixir** are :    

    1. Covid 19 have created acute shortage of primary healthcare workers and physicians to be consulted for primary healthcare.
    2. Traditional telemedicine facilities are time consuming and not effective and inclusive.
    3. Lack of features for end user which makes most of the virtual care provider platforms inclusive to only tech-savy individuals.
    4. There's a major lapse in storage and transfer of patient medical record, most of the time causing in loss of health records and leads to compromised diagnosis
    5. Lack of data security and data democratization
    6. Vulnerability of paper based records.
  

## About
**Elixir** is a web-based application which enables patients and doctors to share electronic medical records(EMRs) in an efficient and easy to use manner. It acts a central medical repository for all health records and data for a patient and enables quick, systematic and hassle-free monitoring of longitudinal medical history of patients across the care spectrum by different health facilities i.e doctors, hospitals, etc. It uses a **unique consent based approach** to let medical data ownership in the hands of patients all the time and employs advanced authentication techniques to ensure secure data transfer. Also it hosts a smart consutation dashboard whicb allows patient to request for specoalist consultation. The major goal of Elixir is to make **patient care accessible at this times of COVID19** and to remove the heavy lifting of organizing, indexing, and structuring patient information to provide a complete view of the health of individual patients and entire patient populations in a secure, compliant, and auditable manner. 

## Build Instructions
Please insure that you have the following installed in your system.   
**Requirements**

    Node.js & npm
    Python 3.6 or above
 
 1. Fork this repository and clone it to build a local copy of the application in your system.  
 2. Inside the project directory, run `npm install` in your terminal to get all the required dependencies for the client.
 3. In the same directory, build a python virtual environment using venv, by running `python -m venv myvenv` in the terminal. Activate this virtual environment via `myvenv\Scripts\activate.bat` in the terminal.
 4. Navigate inside the *server* directory and run `pip install -r requirements.txt` to install all the packages and dependencies inside the virtual environment.
 5. In the same directory, configure and add the environment variables (database URI & secret_key) by making a `.env` file.
 6. In the project directory, modify `app.py` to run in `DEBUG` mode.
 7. Finally start the application by opening two terminals, and run the following commands :  
 
        terminal 1: python app.py (make sure your virtual environment is activated) 
        terminal 2: npm run client


## ScreenShots
 
 
![ScreenShot 1](https://github.com/purplepotion/Elixir/blob/main/imgs/elixir1.png)
![ScreenShot 2](https://github.com/purplepotion/Elixir/blob/main/imgs/elixir2.png)
![ScreenShot 3](https://github.com/purplepotion/Elixir/blob/main/imgs/Screenshot%20(14).png)
![ScreenShot 4](https://github.com/purplepotion/Elixir/blob/main/imgs/Screenshot%20(15).png)
![ScreenShot 5](https://github.com/purplepotion/Elixir/blob/main/imgs/elixir3.png)
![ScreenShot 6](https://github.com/purplepotion/Elixir/blob/main/imgs/elixir4.png)


