import { Application } from "probot";
import { repositoryAdded } from "./repository-added"

export = (app: Application) => {
  // Your code here
  app.log("Yay, the app was loaded!");

  const handlePullRequest = require("./pull-request-change");
  //const repositoryAdded = require("./repository-added");


  app.on("",
    async function(context){
      app.log(context)
    }
  );

  app.on(
    [
      "pull_request"
    ],
    handlePullRequest
  );

  app.on('installation_repositories.added', repositoryAdded)  
};
