import { Context } from "probot";

import { LicenseLookup } from "license-lookup"
import { StatusEnum } from "../interfaces/StatusEnum";
import { LicenseConfig } from "../config/license";
import { ILicenseConfig } from "../interfaces/ILicenseConfig";
import { IResult } from "../interfaces/iresult";
import { IResultSummary } from "../interfaces/iresultsummary";
import { AppConfig } from "../config/app"

export default class Lookup {
  
  result = new Array<IResult>();
  private _summary : IResultSummary | null = null;

  constructor() {
  
  }

  private async checkComments(context : Context, pull : any) {
    const comments = await context.github.issues.listComments(pull);
    const comment = comments.data.find(
      comment => comment.user.login === process.env.APP_NAME + "[bot]"
    );

    return comment;
  }
  
  private _licenseBanned(license : string | undefined, config : any ){
    if(!license){
      return StatusEnum.Warning; 
    }

    if(!config){
      return StatusEnum.Warning; 
    }

    if(config.exclude && config.exclude.length>0 && config.exclude.indexOf(license)){
      return StatusEnum.Failure;
    }

    if(config.onlyAllow && config.onlyAllow.length>0 && config.onlyAllow.indexOf(license)<0){
      return StatusEnum.Failure;
    }

    return StatusEnum.Warning;
  }

  async run(context: Context, config: ILicenseConfig) : Promise<Array<IResult>>{

    // repo and pr data
    //const repo = context.repo();
    const pr = context.payload.pull_request;
    const repo = context.repo();
    const pr_contents = await context.github.pullRequests.listFiles({ ...repo, number: pr.number});
    const pr_files = pr_contents.data.map(x => x.filename);

    var ll = new LicenseLookup();
    var matches = ll.matchFilesToManager(pr_files);
    if(matches.length == 0)
    {
      return [];
    }
    

    for(const match of matches){

      try{
      var base = await context.github.repos.getContents( {...repo, path: match.file,});
      var head = await context.github.repos.getContents( {repo: pr.head.repo.name, owner: pr.head.repo.owner.login, path: match.file, ref: pr.head.ref})
      
      const base_content = Buffer.from(base.data.content, 'base64').toString()
      const head_content = Buffer.from(head.data.content, 'base64').toString()

      var base_deps = await match.manager.detect(base_content);
      var head_deps = await match.manager.detect(head_content);

      var baseDepsKeys = base_deps.map(x => x.name);
      var new_deps = head_deps.filter( x => baseDepsKeys.indexOf(x.name)<0 );
      var new_deps_lookup = await match.manager.lookup(new_deps);
      
      for(var dd of new_deps_lookup){
        this.result.push({
          label: `Detected **[${dd.name}](${dd.url})** as a new dependency in **${match.file}**, licensed under: **${dd.license}**`,
          result: this._licenseBanned(dd.license, config),
          dependency: dd
        });
      }
      }catch(ex){
        this.result.push({
          label: `Could not process **${match.file}** for new dependencies`,
          result: StatusEnum.Warning
        });
      }
    }

    return this.result;
  }

  summary(){

    if(this._summary == null){
      
      this._summary = {
        Success : this.result.filter(x => x.result == StatusEnum.Success),
        Failure : this.result.filter(x => x.result == StatusEnum.Failure),
        Warning : this.result.filter(x => x.result == StatusEnum.Warning)
      };

    }

    return this._summary
  }

  render(){
    const icon = (status: StatusEnum)=>{
      switch (status) {
        case StatusEnum.Success:
          return '✅'
        case StatusEnum.Failure:
          return '❌'
        case StatusEnum.Warning:
          return '⚠️'
        default:
          return 'ℹ️'
      }
    }

   
    var resolutions = [];
    resolutions.push(`### ${AppConfig.description}`);

    if(this.result){
      resolutions.push(" ");
      for(const subResult of this.result){
          resolutions.push(`#### ${icon(subResult.result)} ${subResult.label}`);
          
          if(subResult.dependency){
            if(subResult.result === StatusEnum.Failure){
              resolutions.push("This dependency is distributed under a license which is not allowed on this project - **this pull request can therefore not be merged**");
            }else{
              resolutions.push(`This is a new dependency, please [review it](${subResult.dependency.url}) and confirm you wish to introduce this to the codebase`);
            }
          }
      }
    }

    return resolutions.join('\n');
  }
}




