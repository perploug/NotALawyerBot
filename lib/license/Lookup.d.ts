import { Context } from "probot";
import { ILicenseConfig } from "../interfaces/ILicenseConfig";
import { IResult } from "../interfaces/iresult";
import { IResultSummary } from "../interfaces/iresultsummary";
export default class Lookup {
    result: IResult[];
    private _summary;
    constructor();
    private checkComments;
    private _licenseBanned;
    run(context: Context, config: ILicenseConfig): Promise<Array<IResult>>;
    summary(): IResultSummary;
    render(): string;
}