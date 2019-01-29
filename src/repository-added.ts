import { Context } from "probot";
import { LicenseConfig } from "./config/license"
import { AppConfig } from "./config/app"

import { ChecksCreateParams, PullRequestsGetResponse } from "@octokit/rest";
import { StatusEnum } from "./interfaces/StatusEnum";
import Lookup from "./license/Lookup";

async function repositoryAdded(context: Context) {
  
  context.log(context.payload);

  if(
      context.payload.action === 'added' &&  
      context.payload.repositories_added.length > 0
      ){
    var installs = context.payload.repositories_added;
    

    for(const install of installs){
      
      const repo = {owner: install.full_name.split("/")[0], repo: install.name};
      const repo_data = await context.github.repos.get({...repo});
      
      const lookup = new Lookup(LicenseConfig, context, repo_data.data.license.spdx_id, false);
      await lookup.run(repo, repo_data.data.default_branch);

      var issueBody = AppConfig.overview + "\n";
      issueBody += await lookup.render(false); 

      await context.github.issues.create({ ...repo, title: "Dependencies", body: issueBody });
    }
  } 
}

export { repositoryAdded }