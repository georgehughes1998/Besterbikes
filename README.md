# Besterbikes System

The main purpose of the System is to serve as expandable city-based bike rental service, with a secondary functionality to operators and managers to perform administrative tasks. The system will be responsible for managing bikes, users and bike stations throughout the system and setting up a method of payment to do so. The processing of the payment will be carried out by an external actor and thus is outwith the project scope.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Tips

Recommend using webstorm as your code editor since it is free for students and provides lots of features to ease development

Also, read the following guide carefully to ensure you clone, push and pull to Git correctly as this can be quite confusing


### Downloading the Remote Repository (GitHub) for the first time

1. Open Webstorm and select:
* VCS
* Checkout from Version Control
* Git
* Enter https://raw.githubusercontent.com/jackow98/Besterbikes as URL

2. Once the repository has been cloned you will need to run the following commands
```shell
cd besterbikes
npm install --save react react-router redux redux-form react-redux react-router-dom firebase faker
```

3. Run the following command to host the project locally
```shell
npm start
```

### Pulling from the Remote Repository (GitHub)
1. Open Webstorm and select:
* Select the Git branch in the bottom right and select which branch you want to checkout as 
* This essentially lets you make a copy another branch
* Would recomend you create a branch called something like "JackDevelop" and push this to the develop branch
* The main branch will be reserved for big releases decided by the entire group

### Pushing to the Remote Repository (GitHub)
1. Open Webstorm and select:
* The green tick icon in the top right to commit
* When the window opens, select the arrow to show the dropdown menu
* Select commit and push to add changes to github
* If you want to just mark a commit then just select commit and this will only be stored locally
* __DON'T PUSH TO THE MAIN BRANCH__
* __DON'T PUSH THE node_modules FOLDER OR THE .idea folder__

## Built With

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Firebase](https://firebase.google.com/)