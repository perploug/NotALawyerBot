import { Context } from "probot";
import { ILicenseConfig } from "../interfaces/ILicenseConfig";
import { IResult } from "../interfaces/iresult";
import { IResultSummary } from "../interfaces/iresultsummary";
import { PullRequestsGetResponse } from "@octokit/rest";
export default class Lookup {
    result: IResult[];
    private _summary;
    private _config;
    private _onlyNew;
    private _context;
    constructor(config: ILicenseConfig, context: Context, baseLicense?: string | undefined, onlyNew?: boolean);
    private checkComments;
    private _buildConfig;
    private _licenseBanned;
    run(repo: {
        repo: string;
        owner: string;
    }, ref?: string, pr?: PullRequestsGetResponse | undefined): Promise<Array<IResult>>;
    summary(): IResultSummary;
    render(incudeDescription?: boolean): string;
}
