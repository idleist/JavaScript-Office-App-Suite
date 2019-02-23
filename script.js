// *** GLOBAL VARIABLES ***

    // ** LOCAL STORAGE FUNCTIONS** //
    function getLocalStorage(str){
        return JSON.parse(localStorage.getItem(str));
    }

    function setLocalStorage(str, array){
        localStorage.setItem(str , JSON.stringify(array));
    }


    // ** DATE VARIABLES AND FUNCTIONS **
    let day = (function(){
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let day = new Date().getDay();
        return days[day];
      }());
      
    let month = (function(){
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let month = new Date().getMonth();
        return months[month];
    }());
      
    let year = (function(){
        return new Date().getFullYear().toString();
    }());



    // ** FORM VARIABLES AND ASSOCIATED SUBMIT EVENT LISTENERS **

    // Login Form
    const loginForm = document.getElementById('login--form');
    loginForm.addEventListener('submit', loginSubmit);
    
    // Break Time Form
    const breakForm = document.getElementById('breakTime--form');
    breakForm.addEventListener('submit', checkBreakTime);

    // Meetings Form
    const meetingForm = document.getElementById('meetings--form');
    meetingForm.addEventListener('submit', checkMinTime);

    // Todo Form
    const todoForm = document.getElementById('todo--form');
    todoForm.addEventListener('submit', saveTodos);

    // ** DOM DIV VARIABLES ** 

    // Login screen (div) variable
    const loginScreen = document.querySelector('#login');

    // Logout and clear storage buttons
    const logoutButton = document.getElementById('logout--button');
    logoutButton.addEventListener('click', logout);

    const clearStorage = document.getElementById('clear--button');
    clearStorage.addEventListener('click', logoutClearStorage);

    // App Buttons
    const appButtons = document.querySelectorAll('.app--icon');
    appButtons.forEach((button) => button.addEventListener('click', clicked));

    // Todo Container Div
    const todoContainer = document.getElementById('todo--container');

    // Meeting Container Div
    const meetingDisplay = document.getElementById('meeting');

    // Breaktime Container Div
    const breakTimeContainer = document.getElementById('breakTime--container');

    // Contacts Container Div
    const contactsContainer = document.getElementById('contacts--container');

    // Operating System Information Div
    const operatingSystem = document.getElementById('browser--info');


// *** WINDOW ONLOAD FUNCTION *** 

    // ** An immediately invoked function for when window is loaded or refreshed.
    window.onload = (function(){
        // Checks if USER(employee) has logged in 
        login();

        // Fetches TODOS, MEETINGS, BREAKTIMES from local Storage and displays them in the DOM
        checkTodos();
        checkMeetings();
        checkBreakTimes();

        // Inputs Browser information from navigator object into the DOM
        systemInformation();
    })();

    

// *** WEBPAGE(APP) FUNCTIONALITY AND SECTIONS *** 

    // ** LOGIN FORM - Just a feature, not a full backend login system ** 

    // * Employee Object Constructor Function * 

    function Employees(name, startTime, finishTime){
        this.name = name,
        this.startTime = startTime,
        this.finishTime = finishTime
    }


    // Login function - runs when login form submitted AND when page loads or refreshes to check USER
    function login(){
        
        if(!localStorage.hasOwnProperty('employee')){
            // Set login screen display to block.  Show login screen
            loginScreen.style.display = 'block';
            
        } else {
            loginScreen.style.display = 'none';
            displayEmployeeInfo(JSON.parse(localStorage.getItem('employee')));
        }
    }

    // login function - runs when new USER enters details
    function loginSubmit(e){
        e.preventDefault();
        
        // Extract values from the form
        let name = document.getElementById('login--name').value;
        let start = document.getElementById('login--start').value;
        let finish = document.getElementById('login--finish').value;
        
        // creates NEW employee from Employees object constructor function
        var employee = new Employees(name, start, finish);

        // Uses the prototype greet() function from Employees Object (not really needed, just showing prototype functionality)
        alert(employee.greet());

        // Stores new Employee in Local Storage
        setLocalStorage('employee', employee);

        // runs function to add employee details to the DOM
        displayEmployeeInfo(employee);

        // closes the login screen
        loginScreen.style.display='none';
    }

    // Takes an employee object and manipulates the DOM to append new information
    function displayEmployeeInfo(object){
        let welcomeInformation = document.getElementById('welcome--information');
        let welcomeMessage = document.getElementById('welcome--message');

        // Capitalize Employee Name
        let nameCapital = object.name.charAt(0).toUpperCase() + object.name.slice(1);

        // Populate the welcome Div with various information
        welcomeInformation.innerHTML = `
            <p class='welcome--header'>Welcome ${nameCapital}</p>
            <p class='welcome--date'>${day}, ${month}, ${year}</p>
            <p class='welcome--text'>Start Time: ${object.startTime}</p>
            <p class='welcome--text'>Finish Time: ${object.finishTime}</p>
        `;

        // Gives a daily message to the user
        let messages = function(){
            let day = new Date().getDay();
            let message;
            switch(day){
              case 0: 
                message = 'What are you doing working on a weekend?'
                break;
              case 1: 
                message = 'Just another Manic Monday!'
                break;
              case 2: 
                message = "Well, at least it's not Monday"
                break;
              case 3: 
                message = 'Mid-week blues are setting in'
                break;
              case 4: 
                message = 'I can just about see the weekend!'
                break;
              case 5: 
                message = "Thank God, It's FRIDAY!!"
                break;
              case 6: 
                message = 'What are you doing working on a weekend?'
                break;    
            }
            return message;
        }
    
        welcomeMessage.innerHTML = `<p class='welcome--message'>${messages()}</p>`;


    }

    // Not really needed as only ever 1 employee object but it does show a prototype function in action.  Can expand on this functionality in later versions. 
    Employees.prototype.greet = function(){
        return `Hello ${this.name}, You start at ${this.startTime}, finish at ${this.finishTime}`;
    }


    // ** APP BUTTONS AND SCREENS FUNCTIONALITY **

    // * OPEN APPS App icon clicked - uses HTML data attribute to open correct app screen
    function clicked(){
        // stores this data attribute in variable
        let data = this.dataset.display;

        // manipulates DOM to display correct app screen
        document.querySelector(`.section[data-display = ${data}]`).classList.add('display');
        
    }

    // * CLOSE APPS 

    // select close buttons in sections
    const closeButton = document.querySelectorAll('.sectionClose');

    // Add click event to each button
    closeButton.forEach((button) => button.addEventListener('click', closeSection));

    // closes section(App) screen when button (x) is clicked
    function closeSection(e){
        this.parentElement.parentElement.classList.remove('display');
    }



    // ** TODO LIST FUNCTIONALITY **
    
    // * Todo Object Constructor Function
    function Todo(todoName, todoDescription){
        this.name = todoName,
        this.description = todoDescription,
        this.completed = false
    }
    
    // * Checks Todos in storage on submit and when window is refreshed - appends DOM
    function checkTodos(){
        if(localStorage.getItem('todos') != null){
            
            // Initially set todoContainer to empty
            todoContainer.innerHTML = "";
            
            // iterate through todos array and append the todoContainer
            getLocalStorage('todos').forEach((todo, index) => {
                todoContainer.innerHTML += `
                <div class='todo--item ${todo.completed?'completed':''}' data-item=${index}>
                    <p><i class="far fa-times-circle close"></i></p>
                    <h6 class='todo--name'>${todo.name}</h6>
                    <p class='todo--description'>${todo.description}</p>
                </div>`
            });   
        }

        // Selects all todo item divs - adds event listeners to them
        document.querySelectorAll('.todo--item').forEach((i) => {

            // Event listener for the div - if clicked, will change colour and text will have line through to symbolise completed.  If 'x' is clicked the todo will be deleted from DOM and from local storage.
            i.addEventListener('click', function(e){
                if(e.target.classList.contains('close')){
                    let newArray = getLocalStorage('todos');
                    newArray.splice(i.dataset.item, 1);
                    setLocalStorage('todos', newArray);
                    checkTodos();

                } else{
                    // toggles CSS class to add linethrough to text
                    let newArray = getLocalStorage('todos');
                    newArray[i.dataset.item].completed = newArray[i.dataset.item].completed != true;
                    setLocalStorage('todos', newArray);
                    checkTodos();
                }
                
            });
        });

        
    }


    // * Creates new Todo Object and Saves new todos to storage - appends DOM 
    function saveTodos(e){
        // Prevent usual form behaviour
        e.preventDefault();

        // store the form values
        var todoName = document.getElementById('todo--task').value;
        var todoDescription = document.getElementById('todo--description').value;

        // check if there are any todos in local storage.  Add new todos to storage
        let newArray = [];
        if(getLocalStorage('todos') != null){newArray = getLocalStorage('todos')};
        newArray.push(new Todo(todoName, todoDescription));
        
        setLocalStorage('todos', newArray);
        
        // Refresh data in the DOM
        checkTodos();
    }

    




    // ** JAVASCRIPT CLOCK **

    // Selecting the hands of the clock
    const secondHand = document.querySelector('.second__hand');
    const minsHand   = document.querySelector('.min__hand');
    const hourHand   = document.querySelector('.hour__hand');

    // Function Retrieves the current time and adjusts the hands accordingly
    function setDate() {
        // Sets new date object to now variable
        const now = new Date();
        // Sets current seconds from now object to seconds variable
        const seconds = now.getSeconds();
        // Sets the degrees by which the second hand moves.  Rotates second hand
        const secondsDegrees = ((seconds / 60) * 360) + 90;
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        // Sets current minutes from now object to mins variable
        const mins = now.getMinutes();
        // Sets the degrees by which the minute hand moves.  Rotates minute hand
        const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
        minsHand.style.transform = `rotate(${minsDegrees}deg)`;
        // Sets current hours from now object to hour variable
        const hour = now.getHours();
        // Sets the degrees by which the minute hand moves.  Rotates minute hand
        const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }

    // Runs the setDate function every second
    setInterval(setDate, 1000);
    // Calls the setDate function
    setDate();



    // ** SECRET NUMBER GAME **

    // Silly little game that demonstrates a do while loop

    function secretNumberGame(){

        const min = 1;
        const max = 12;
        
        var secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        
        var guesses = 0; // for storing the number of guesses
        var hint = ''; // for storing hint
        
        do {
            // get input from user
            var input = prompt(`Please enter a number between ${min} and ${max}` + hint);
            // get the integer
            var number = parseInt(input);
            // increase the number of guesses
            guesses++;
            // check input number with the secret number
            // provide hint if needed
            if (number > secretNumber) {
                hint = ', and less than ' + number;
            } else if (number < secretNumber) {
                hint = ', and greater than ' + number;
            } else if(number == secretNumber) {
                alert(`WOOHOO! you're correct after ${guesses} guess(es). Now GET BACK TO WORK!!`);
            }
        } while (number != secretNumber);
    }



    // ** Meeting App Functionality

    // * Meeting Object Constructor Function

    function Meeting(name, description, time){
        this.name = name,
        this.description = description,
        this.time = time;
        this.date = new Date().toString().replace(/(\d{2}:\d{2})/, time);
        this.timeMs = new Date(this.date).getTime();
    }


    // Form Validation - Ensuring meeting times cannot be set that have elapsed in input field in HTML
    function checkMinTime(e){
        // prevents default form behaviour
        e.preventDefault();

        // variable for the inputted time of meeting
        let inputTime = new Date().toString().replace(/(\d{2}:\d{2})/, document.getElementById('meetings--time').value);

        // convert it to a ms time format to compare with current time
        let compare = new Date(inputTime).getTime();
        
        // ternary function to determine if time input by user has already passed.  If not runs the saveMeeting function.
        (new Date().getTime() > compare)? alert('time has passed'): saveMeeting(); 
    }
        
    function saveMeeting(){
        
        // store the form values
        let meetingName = document.getElementById('meetings--name').value.toUpperCase();
        let meetingDesc = document.getElementById('meetings--description').value;
        let meetingTime = document.getElementById('meetings--time').value;

    
        // check if there are any todos in local storage.  Add new todos to storage
        let newArray = [];
        if(getLocalStorage('meetings') != null){newArray = getLocalStorage('meetings')};
        newArray.push(new Meeting(meetingName, meetingDesc, meetingTime));
        
        setLocalStorage('meetings', newArray);
        
        // Refresh data in the DOM
        checkMeetings();
    }
    
    
    function checkMeetings(){
        
        if(localStorage.getItem('meetings') != null){
            
            // Initially set todoContainer to empty
            meetingDisplay.innerHTML = "";
            
            // iterate through meetings array and append the meeting Container in DOM
            // sorts the meetings in storage by time.  Most recent meetings will be first.  Resorts on every resave or refresh.
            let meetings = getLocalStorage('meetings').sort((a, b) => a.timeMs - b.timeMs);
            setLocalStorage('meetings', meetings);
            getLocalStorage('meetings').forEach((meeting, index) => {
                meetingDisplay.innerHTML += `
                <div class='meeting--item' data-item=${index}>
                    <p><i class="far fa-times-circle close"></i></p>
                    <h6 class='meeting--name'>Meeting: ${meeting.name}</h6>
                    <p class='meeting--description'>Description: ${meeting.description}</p>
                    <p class='meeting--time'>Meeting Time: ${meeting.time}</p>
                </div>`
            });
        }

        // Selects all meeting item divs - adds event listeners to them
        document.querySelectorAll('.meeting--item').forEach((i) => {

            // Event listener for the div - if clicked, will change colour and text will have line through to symbolise completed.  If 'x' is clicked the meeting will be deleted from DOM and from local storage.
            i.addEventListener('click', function(e){
                if(e.target.classList.contains('close')){
                    let newArray = getLocalStorage('meetings');
                    newArray.splice(i.dataset.item, 1);
                    setLocalStorage('meetings', newArray);
                    checkMeetings();
                }
                
            });
            
        });
        // sets the countdown for the next meeting on the app screen
        clearInterval(meetingInterval);
        countdown('countdown--meeting');
                    
    }
            

    // *** COUNTDOWN FUNCTIONALITY ***

    // ** Countdown Function **

    // I think I over complicated this BUT IT WORKS!!

    // Set an interval variable for each countdown timer (global variable allows interval to be completely cleared so that no glitches occur)
    var meetingInterval;
    var breaktimeInterval;

    // Countdown function that determines meeting countdown or other countdowns
    function countdown(countdownID){
        // Selects the particular countdown div from the DOM
        let countdownDiv = document.getElementById(countdownID);
        countdownDiv.innerHTML = '';

        // Selectors to determine which counter needs setting
        if(countdownID === 'countdown--meeting'){
            meetingsCountdown(countdownID, countdownDiv);
        }
        if(countdownID ==='countdown--breaktime'){
            breaktimeCountdown(countdownID, countdownDiv);
        }
        
    }

    // * Sets Meeting Countdown
    function meetingsCountdown(countdownID, countdownDiv){

        // Checks if there are upcoming meetings in local storage
        if(getLocalStorage('meetings')){

            // Extra check (I had glitches) to check if there are any meetings in storage
            if(getLocalStorage('meetings').length > 0){

                // Clears any previously set intervals
                clearInterval(meetingInterval);
                // Sets an interval function every 1 second
                meetingInterval = setInterval(function(){
                    
                    // Todays date and time
                    let now = new Date().getTime();
                    let time = getLocalStorage('meetings')[0].timeMs;
                    // find the difference between now and the event
                    let difference = time - now;
                    
                    // Time calculations for hours, minutes and seconds
                    let hour = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minute = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    let second = Math.floor((difference % (1000 * 60)) / 1000);
                    
                    let hours = (hour < 10) ? "0" + hour: hour;
                    let minutes = (minute < 10) ? "0" + minute: minute;
                    let seconds = (second < 10) ? "0" + second: second;

                    // Display the results
                    countdownDiv.innerHTML = `Your next meeting is in <br>${hours}:${minutes}:${seconds}`;  

                    // If countdown is finished
                    if (difference < 0){
                        clearInterval(meetingInterval);
                        document.getElementById(countdownID).innerHTML = '<p class="eventstart">Meeting is starting</p>';
                        let newArray = getLocalStorage('meetings');
                        newArray.shift();
                        setLocalStorage('meetings', newArray);

                        // Gives 3 seconds for user to see 'Meeting Starting' Message then reruns function
                        setTimeout(function(){
                            checkMeetings();
                        }, 10000)
                        
                    }
                }, 1000);

            // Displays 'No Meetings Planned' in the countdown div in DOM
            } else {
                document.getElementById(countdownID).innerHTML = 'No Meetings Planned';
            }
        } else {
            document.getElementById(countdownID).innerHTML = 'No Meetings Planned';
        }
    }


    // ** BREAKTIME SECTION FUNCTIONALITY **

    function Breaktime(name, time){
        this.name = name,
        this.time = time;
        this.date = new Date().toString().replace(/(\d{2}:\d{2})/, time);
        this.timeMs = new Date(this.date).getTime();
    }


    function saveBreakTime(){
        
        // store the form values
        let breaktimeName = document.getElementById('breakTime--task').value;
        let breakTime = document.getElementById('breakTime--time').value;

        // check if there are any todos in local storage.  Add new todos to storage
        let newArray = [];
        if(getLocalStorage('breaktimes') != null){newArray = getLocalStorage('breaktimes')};
        newArray.push(new Breaktime(breaktimeName, breakTime));
        
        setLocalStorage('breaktimes', newArray);
        
        // Refresh data in the DOM
        checkBreakTimes();
    }

    // * Checks if time is entered correctly on break form 

    function checkBreakTime(e){
        // prevents default form behaviour
        e.preventDefault();

        // variable for the inputted time of meeting - use of reg exp to select current time and replace with break time.
        let inputTime = new Date().toString().replace(/(\d{2}:\d{2})/, document.getElementById('breakTime--time').value);

        // convert it to a ms time format to compare with current time
        let compare = new Date(inputTime).getTime();
        
        // ternary function to determine if time input by user has already passed.  If not runs the saveMeeting function.
        (new Date().getTime() > compare)? alert('time has passed'): saveBreakTime(); 
    }


    // * Checks if break time is in local storage, appends the DOM and sets countdown timers
    function checkBreakTimes(){
        
    
        if(localStorage.getItem('breaktimes') != null){
            
            // Initially set todoContainer to empty
            breakTimeContainer.innerHTML = "";
            
            // iterate through meetings array and append the meeting Container in DOM
            // sorts the meetings in storage by time.  Most recent meetings will be first.  Resorts on every resave or refresh.
            let breaks = getLocalStorage('breaktimes').sort((a, b) => a.timeMs - b.timeMs);
            setLocalStorage('breaktimes', breaks);
            getLocalStorage('breaktimes').forEach((breaktime, index) => {
                breakTimeContainer.innerHTML += `
                <div class='break--item' data-item=${index}>
                    <p><i class="far fa-times-circle close"></i></p>
                    <h6 class='break--name'>${breaktime.name}</h6>
                    <p class='break--time'>${breaktime.time}</p>
                </div>`
            });
        }

        // Selects all meeting item divs - adds event listeners to them
        document.querySelectorAll('.break--item').forEach((i) => {

            // Event listener for the div - if clicked, will change colour and text will have line through to symbolise completed.  If 'x' is clicked the meeting will be deleted from DOM and from local storage.
            i.addEventListener('click', function(e){
                if(e.target.classList.contains('close')){
                    let newArray = getLocalStorage('breaktimes');
                    newArray.splice(i.dataset.item, 1);
                    setLocalStorage('breaktimes', newArray);
                    checkBreakTimes();
                }   
            });
            
        });
        clearInterval(breaktimeInterval);
        countdown('countdown--breaktime');
            // sets the countdown for the next meeting on the app screen
        
    
    
    }

    // * Sets BreakTime Countdown Function *

    function breaktimeCountdown(countdownID, countdownDiv){
        if(getLocalStorage('breaktimes')){

            // Extra check (I had glitches) to check if there are any meetings in storage
            if(getLocalStorage('breaktimes').length > 0){

                // Clears any previously set intervals
                clearInterval(breaktimeInterval);
                // Sets an interval function every 1 second
                breaktimeInterval = setInterval(function(){
                    
                    // Todays date and time
                    let now = new Date().getTime();
                    let time = getLocalStorage('breaktimes')[0].timeMs;
                    // find the difference between now and the event
                    let difference = time - now;
                    
                    // Time calculations for hours, minutes and seconds
                    let hour = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minute = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    let second = Math.floor((difference % (1000 * 60)) / 1000);
                    
                    let hours = (hour < 10) ? "0" + hour: hour;
                    let minutes = (minute < 10) ? "0" + minute: minute;
                    let seconds = (second < 10) ? "0" + second: second;

                    // Display the results
                    countdownDiv.innerHTML = `Your next break is in <br>${hours}:${minutes}:${seconds}`;  

                    // If countdown is finished
                    if (difference < 0){
                        clearInterval(breaktimeInterval);
                        document.getElementById(countdownID).innerHTML = '<p class="eventstart">Take A Break</p>';
                        let newArray = getLocalStorage('breaktimes');
                        newArray.shift();
                        setLocalStorage('breaktimes', newArray);

                        // Gives 3 seconds for user to see 'Meeting Starting' Message then reruns function
                        setTimeout(function(){
                            checkBreakTimes();
                        }, 10000)
                        
                    }
                }, 1000);

            // Displays 'No Meetings Planned' in the countdown div in DOM
            } else {
                document.getElementById(countdownID).innerHTML = 'No Breaks Planned';
            }
        } else {
            document.getElementById(countdownID).innerHTML = 'No Breaks Planned';
        }

    }

    // ** OPERATING SYSTEM INFORMATION **
    function systemInformation(){
        let codeName = navigator.appCodeName;
        let browserName = navigator.appName;
        let browserVersion = navigator.appVersion;
        
        operatingSystem.innerHTML = `
        Code name of the browser: ${codeName}<br>
        Browser name: ${browserName}<br>
        Browser version: ${browserVersion}`
    }

    
    






// MUSIC PLAYER - Using YouTube API

// When YouTube API is ready
function onYouTubeIframeAPIReady() {
    var player;

    player = new YT.Player('musicvideo', {
        width: 600,
        height: 400,
        host: 'http://www.youtube.com',
        videoId: 'vAKtNV8KcWg',
        playerVars: {
            playlist: 'gmv54pfxk0Q'
        }
    })
}

// ** CONTACTS FUNCTIONALITY **

// * Company Contacts Object - An object preloaded with names to show some object and array functionality for the assignment criteria.
var companyContacts = {
    contacts: [
        {
            name: 'Bob',
            email: 'bob@technocorp.com',
            phone: '07812 555 444',
            department: 'IT'
        },
        {
            name: 'Jane',
            email: 'jane@technocorp.com',
            phone: '07812 555 333',
            department: 'Human Resources'
        },
        {
            name: 'Bill',
            email: 'bill@technocorp.com',
            phone: '07812 666 444',
            department: 'Accounts'
        },
        {
            name: 'Derek',
            email: 'derek@technocorp.com',
            phone: '07812 555 332',
            department: 'Sales'
        },
        {
            name: 'Catherine',
            email: 'catherine@technocorp.com',
            phone: '07812 553 442',
            department: 'Customer Relations'
        },
        {
            name: 'Louise',
            email: 'louise@technocorp.com',
            phone: '07812 435 464',
            department: 'IT'
        }
    ],
    // Object method added within the object itself - displays full contact info
    displayContacts: function(){
        contactsContainer.innerHTML = '';
        this.contacts.forEach((contact)=>{
            contactsContainer.innerHTML += `
            <div class='contacts--container'>
                <div class='contacts--name'>
                    <i class="fas fa-smile"></i>   
                    <p class='contact--name'>Name: ${contact.name}</p>
                </div>
                <div class='contacts--details'>
                    <p class='contact--email'>Email: ${contact.email}</p>
                    <p class='contact--phone'>Phone: ${contact.phone}</p>
                    <p class='contact--department'>Department: ${contact.department}</p>
                </div>
            </div>
            `
        });
    },
    // method displays names and phone numbers only
    displayNamesOnly: function(){
        contactsContainer.innerHTML = '';
        this.contacts.forEach((contact)=>{
            contactsContainer.innerHTML += `
            <div class='contacts--container'>
                <p class='contact--name'>Name: ${contact.name}</p>
                <p class='contact--phone'>Phone: ${contact.phone}</p>
            </div>
            `
        });
    },
}


// Object methods added to companyContacts object externally

// method to reverse the contacts array
companyContacts.contactsReverse = function(){
    companyContacts.contacts.reverse();
}

// method sorts contacts into alphabetical order
companyContacts.alphabetical = function(){
    companyContacts.contacts.sort(function(a, b){
        let contactA = a.name.toLowerCase()
        let contactB = b.name.toLowerCase();
        // sort alphabetically
        if (contactA < contactB) 
         return -1;
        if (contactA > contactB)
         return 1;
        return 0; //default return value (no sorting)
       });
}

// * Search Functionality
const searchBar = document.querySelector('.contacts--search');
searchBar.addEventListener('input', function(){
    // Empties contacts container after each input
    contactsContainer.innerHTML = '';
    // sets str variable to the search input (or SPACE so that results are cleared when search deleted)
    let str = searchBar.value || ' ';
    // filters through contacts - only returns those that name contains the str
    let newArray = companyContacts.contacts.filter(function(contact){
        if(contact.name.toLowerCase().search(str) != -1){return contact};
    });
    // Takes those filtered contacts and appends them in the DOM
    for(let i = 0; i < newArray.length; i++){
        contactsContainer.innerHTML += `
            <div class='contacts--container'>
                <div class='contacts--name'>
                    <i class="fas fa-smile"></i>   
                    <p class='contact--name'>Name: ${newArray[i].name}</p>
                </div>
                <div class='contacts--details'>
                    <p class='contact--email'>Email: ${newArray[i].email}</p>
                    <p class='contact--phone'>Phone: ${newArray[i].phone}</p>
                    <p class='contact--department'>Department: ${newArray[i].department}</p>
                </div>
            </div>
            `
    }
});

// * Contacts Buttons and Event Listeners *

// Shows full contact details
document.querySelector('.fullList').addEventListener('click',() => companyContacts.displayContacts());

// Reverses the array of contacts
document.querySelector('.reverse').addEventListener('click', () => {
    companyContacts.contactsReverse();
    companyContacts.displayContacts();
});

// Shows just name and phone number
document.querySelector('.phone').addEventListener('click', () => companyContacts.displayNamesOnly());

// Shows contacts in alphebetical order
document.querySelector('.alphabet').addEventListener('click', () => {
    companyContacts.alphabetical();
    companyContacts.displayContacts();
});


// ** Images Button Link **


function openImagesPage(){
    let imagesUrl = "/images.html";
    window.location.href = window.location.origin + imagesUrl; 
}



// ** LOGOUT AND CLEAR LOCAL STORAGE BUTTON FUNCTIONS **

// * Function that removes employee data from local storage
function logout(){
    localStorage.removeItem('employee');
    location.reload();
}

// * Complete Reset - removes employee information and all stored todos, meetings and breaks
function logoutClearStorage(){
    if(confirm('Are you sure you want to clear all your stored data?')){
        localStorage.clear();
        location.reload();
    }
}



