"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var license_1 = require("./config/license");
var app_1 = require("./config/app");
var Lookup_1 = __importDefault(require("./license/Lookup"));
function handlePullRequestChange(context) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, CHECKNAME, pullRequest, issue, repo, sha, checkInfo, lookup, results, problems, warnings, checkResult, body, issue_comments, comment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.config(app_1.AppConfig.configfile, license_1.LicenseConfig)];
                case 1:
                    cfg = _a.sent();
                    CHECKNAME = app_1.AppConfig.checkname;
                    pullRequest = context.payload.pull_request;
                    issue = context.issue();
                    repo = context.repo();
                    sha = context.payload.pull_request.head.sha;
                    // if there is no pull request or the state is not open, no reason to continue
                    if (!pullRequest || pullRequest.state !== "open")
                        return [2 /*return*/];
                    checkInfo = {
                        owner: repo.owner,
                        repo: repo.repo,
                        name: CHECKNAME,
                        head_sha: sha
                    };
                    // In progress feedback
                    return [4 /*yield*/, context.github.checks.create(__assign({}, checkInfo, { status: "in_progress", output: {
                                title: "Checking dependency licensing",
                                summary: ''
                            } }))];
                case 2:
                    // In progress feedback
                    _a.sent();
                    lookup = new Lookup_1.default(cfg, context);
                    return [4 /*yield*/, lookup.run(context.repo(), pullRequest.base.ref, pullRequest)];
                case 3:
                    results = _a.sent();
                    problems = results.filter(function (x) { return x.result === "failure" /* Failure */; });
                    warnings = results.filter(function (x) { return x.result === "warning" /* Warning */; });
                    checkResult = __assign({}, checkInfo, { status: "completed", conclusion: (problems.length == 0) ? "success" : "action_required", completed_at: new Date().toISOString(), output: {
                            title: "Found " + problems.length + " problems,  " + warnings.length + " warnings",
                            summary: '',
                            text: ''
                        } });
                    if (!(problems.length + warnings.length > 0)) return [3 /*break*/, 8];
                    body = lookup.render(true);
                    checkResult.output.summary = app_1.AppConfig.review;
                    checkResult.output.text = body;
                    return [4 /*yield*/, context.github.issues.listComments(issue)];
                case 4:
                    issue_comments = _a.sent();
                    comment = issue_comments.data.find(function (comment) { return comment.user.login === app_1.AppConfig.checkname + "[bot]"; });
                    if (!comment) return [3 /*break*/, 6];
                    return [4 /*yield*/, context.github.issues.updateComment(__assign({}, repo, { comment_id: comment.id, body: app_1.AppConfig.review + "\n" + body }))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, context.github.issues.createComment(__assign({}, issue, { body: app_1.AppConfig.review + "\n" + body }))];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, context.github.checks.create(checkResult)];
            }
        });
    });
}
module.exports = handlePullRequestChange;
//# sourceMappingURL=pull-request-change.js.map