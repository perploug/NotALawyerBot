import { Context } from "probot";
import { LicenseConfig } from "./config/license"
import { AppConfig } from "./config/app"

import { ChecksCreateParams, PullRequestsGetResponse } from "@octokit/rest";
import { StatusEnum } from "./interfaces/StatusEnum";
import Lookup from "./license/Lookup";

async function handlePullRequestChange(context: Context) {
  
  // use the legacy zappr config for drop-in replacement support
  const cfg = await context.config(AppConfig.configfile, LicenseConfig);
  const CHECKNAME = AppConfig.checkname;

  const pullRequest : PullRequestsGetResponse = context.payload.pull_request;
  const issue = context.issue();
  const repo = context.repo();
  const { sha } = context.payload.pull_request.head;


  // if there is no pull request or the state is not open, no reason to continue
  if (!pullRequest || pullRequest.state !== "open") return;

  const checkInfo = {
    owner: repo.owner,
    repo: repo.repo,
    name: CHECKNAME,
    head_sha: sha};
  
  // In progress feedback
  await context.github.checks.create({
    ...checkInfo,
    status: "in_progress",
    output: {
      title: `Checking dependency licensing`,
      summary: ''
    }
  });
  
  //do the license lookup
  var lookup = new Lookup(cfg, context);
  var results = await lookup.run(context.repo(), pullRequest.base.ref, pullRequest);
  
  // looking up warnings and failures
  var problems = results.filter(x => x.result === StatusEnum.Failure);
  var warnings = results.filter(x => x.result === StatusEnum.Warning);

  let checkResult : ChecksCreateParams = {
    ...checkInfo,
    status: "completed",
    conclusion: (problems.length==0) ? "success" : "action_required",
    completed_at: new Date().toISOString(),
    output: {
      title: `Found ${problems.length} problems,  ${warnings.length} warnings`,
      summary: '',
      text: ''
    }
  };
  
  if(problems.length + warnings.length > 0){
    
    var body = lookup.render(true);
    checkResult.output!.summary = AppConfig.review;
    checkResult.output!.text = body;

    //section for providing guidance as a comment on the P
    const issue_comments = await context.github.issues.listComments(issue);
    const comment = issue_comments.data.find(comment => comment.user.login === AppConfig.checkname + "[bot]");

    if(comment){
        await context.github.issues.updateComment({ ...repo, comment_id: comment.id, body: AppConfig.review + "\n" +body });
      }else{
        await context.github.issues.createComment({ ...issue, body: AppConfig.review + "\n" + body });
    }
  }

  return context.github.checks.create(checkResult);
}

module.exports = handlePullRequestChange;