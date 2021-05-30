# Elixir :chart_with_upwards_trend:
## Data Activation Platform and Health Repository 

## History & Motivation :bulb:
The widespread problems and issues present in Indian healthcare system which motivated us to develop **Elixir** are :   

 - :white_check_mark: Covid 19 :ambulance: has created **:rotating_light: acute shortage of primary healthcare workers and physicians :rotating_light:** to be consulted for primary healthcare. 
 - :white_check_mark: Traditional telemedicine facilities are time consuming and not effective and inclusive.
 - :white_check_mark: Lack of features for end user which makes most of the virtual care provider platforms inclusive to only tech-savy individuals.
 - :white_check_mark: There's a major lapse in storage and transfer of patient medical records, most of the time causing loss of health records and leads to compromised diagnosis
 - :white_check_mark: Lack of data security and data democratization.
 - :white_check_mark: Vulnerability of paper based records. 

    
## About :rocket:
- **Elixir** is a web-based application which enables patients and doctors to share electronic medical records(EMRs) :memo: in an efficient and easy to use manner. 
- It acts a central medical repository :card_file_box: for all health records :page_facing_up: and data for a patient and enables quick, systematic and hassle-free monitoring of longitudinal medical history of patients across the care spectrum by different health facilities i.e doctors, hospitals, etc. 
- It uses a ⚡️**unique consent based approach**⚡️ to let medical data ownership in the hands of patients all the time and employs advanced authentication techniques to ensure secure data transfer. 
- It also hosts a smart consutation dashboard which allows patient to request for specialist consultation. 
- The major goal of Elixir is to make :rotating_light: **patient care accessible at this time of COVID19** :rotating_light: and to remove the heavy lifting of organizing, indexing, and structuring patient information to provide a complete view of the health of individual patients and entire patient populations in a secure, compliant, and auditable manner. 

**:pushpin: Please go through the [release information](https://github.com/purplepotion/Elixir/releases/tag/v1.0.0) for more details on features**

## :recycle: Workflow and :art: Design
![Alt Text](https://github.com/purplepotion/Elixir/blob/dev/imgs/elixir%20(5).png)

## Build Instructions :building_construction:
Please insure that you have the following installed in your system.   
**Requirements :memo:**

    Node.js & npm
    Python 3.6 or above
 
 1. :twisted_rightwards_arrows: Fork this repository and clone it to build a local copy of the application in your system.  
 2. Inside the project directory, run `npm install` in your terminal to get all the required dependencies for the client.
 3. Inside the client directory, run `npm install` again to configure the starter script and get other packages.
 4. In the same directory, build a python virtual environment using venv, by running `python -m venv myvenv` in the terminal. Activate this virtual environment via `myvenv\Scripts\activate.bat` in the terminal.
 5. Navigate inside the *server* directory and run `pip install -r requirements.txt` to install all the packages and dependencies inside the virtual environment.
 6. In the same directory, configure and add the environment variables (database URI & secret_key) by making a `.env` file.
 7. In the project directory, modify `app.py` to run in `DEBUG` mode.
 8. Finally start the application :rocket: by opening two terminals, and run the following commands :  
 
        terminal 1: python app.py (make sure your virtual environment is activated) 
        terminal 2: npm run client


## ScreenShots :camera_flash:
![Alt Text](https://github.com/purplepotion/Elixir/blob/dev/imgs/elixir%20pages.gif)
 
 



