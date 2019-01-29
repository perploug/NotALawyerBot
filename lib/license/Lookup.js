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
Object.defineProperty(exports, "__esModule", { value: true });
var license_lookup_1 = require("license-lookup");
var licensetypes_1 = require("../config/licensetypes");
var app_1 = require("../config/app");
var Lookup = /** @class */ (function () {
    function Lookup(config) {
        this.result = new Array();
        this._summary = null;
        this._config = { exclude: [], onlyAllow: [] };
        this._config = config;
        this._config.exclude = this._buildConfig(config.exclude, licensetypes_1.LicenseTypes);
        this._config.onlyAllow = this._buildConfig(config.onlyAllow, licensetypes_1.LicenseTypes);
    }
    Lookup.prototype.checkComments = function (context, pull) {
        return __awaiter(this, void 0, void 0, function () {
            var comments, comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.issues.listComments(pull)];
                    case 1:
                        comments = _a.sent();
                        comment = comments.data.find(function (comment) { return comment.user.login === process.env.APP_NAME + "[bot]"; });
                        return [2 /*return*/, comment];
                }
            });
        });
    };
    Lookup.prototype._buildConfig = function (licenses, licenseTypes) {
        for (var _i = 0, _a = Object.keys(licenseTypes); _i < _a.length; _i++) {
            var group = _a[_i];
            var groupIndex = licenses.indexOf(group);
            if (groupIndex >= 0) {
                licenses.splice(groupIndex, 1);
                licenses.push.apply(licenses, licenseTypes[group.toString()]);
            }
        }
        return licenses;
    };
    Lookup.prototype._licenseBanned = function (license) {
        if (!license) {
            return "warning" /* Warning */;
        }
        if (!this._config) {
            return "warning" /* Warning */;
        }
        if (this._config.exclude && this._config.exclude.length > 0 && this._config.exclude.indexOf(license) >= 0) {
            return "failure" /* Failure */;
        }
        if (this._config.onlyAllow && this._config.onlyAllow.length > 0 && this._config.onlyAllow.indexOf(license) < 0) {
            return "failure" /* Failure */;
        }
        return "warning" /* Warning */;
    };
    Lookup.prototype.run = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var pr, repo, pr_contents, pr_files, ll, matches, _i, matches_1, match, base, head, base_content, head_content, base_deps, head_deps, baseDepsKeys, new_deps, new_deps_lookup, _a, new_deps_lookup_1, dd, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pr = context.payload.pull_request;
                        repo = context.repo();
                        return [4 /*yield*/, context.github.pullRequests.listFiles(__assign({}, repo, { number: pr.number }))];
                    case 1:
                        pr_contents = _b.sent();
                        pr_files = pr_contents.data.map(function (x) { return x.filename; });
                        ll = new license_lookup_1.LicenseLookup();
                        matches = ll.matchFilesToManager(pr_files);
                        if (matches.length == 0) {
                            return [2 /*return*/, []];
                        }
                        _i = 0, matches_1 = matches;
                        _b.label = 2;
                    case 2:
                        if (!(_i < matches_1.length)) return [3 /*break*/, 11];
                        match = matches_1[_i];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 9, , 10]);
                        return [4 /*yield*/, context.github.repos.getContents(__assign({}, repo, { path: match.file }))];
                    case 4:
                        base = _b.sent();
                        return [4 /*yield*/, context.github.repos.getContents({ repo: pr.head.repo.name, owner: pr.head.repo.owner.login, path: match.file, ref: pr.head.ref })];
                    case 5:
                        head = _b.sent();
                        base_content = Buffer.from(base.data.content, 'base64').toString();
                        head_content = Buffer.from(head.data.content, 'base64').toString();
                        return [4 /*yield*/, match.manager.detect(base_content)];
                    case 6:
                        base_deps = _b.sent();
                        return [4 /*yield*/, match.manager.detect(head_content)];
                    case 7:
                        head_deps = _b.sent();
                        baseDepsKeys = base_deps.map(function (x) { return x.name; });
                        new_deps = head_deps.filter(function (x) { return baseDepsKeys.indexOf(x.name) < 0; });
                        return [4 /*yield*/, match.manager.lookup(new_deps)];
                    case 8:
                        new_deps_lookup = _b.sent();
                        for (_a = 0, new_deps_lookup_1 = new_deps_lookup; _a < new_deps_lookup_1.length; _a++) {
                            dd = new_deps_lookup_1[_a];
                            this.result.push({
                                label: "Detected **[" + dd.name + "](" + dd.url + ")** as a new dependency in **" + match.file + "**, licensed under: **" + dd.license + "**",
                                result: this._licenseBanned(dd.license),
                                dependency: dd
                            });
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        ex_1 = _b.sent();
                        this.result.push({
                            label: "Could not process **" + match.file + "** for new dependencies",
                            result: "warning" /* Warning */
                        });
                        return [3 /*break*/, 10];
                    case 10:
                        _i++;
                        return [3 /*break*/, 2];
                    case 11: return [2 /*return*/, this.result];
                }
            });
        });
    };
    Lookup.prototype.summary = function () {
        if (this._summary == null) {
            this._summary = {
                Success: this.result.filter(function (x) { return x.result == "success" /* Success */; }),
                Failure: this.result.filter(function (x) { return x.result == "failure" /* Failure */; }),
                Warning: this.result.filter(function (x) { return x.result == "warning" /* Warning */; })
            };
        }
        return this._summary;
    };
    Lookup.prototype.render = function () {
        var icon = function (status) {
            switch (status) {
                case "success" /* Success */:
                    return '✅';
                case "failure" /* Failure */:
                    return '❌';
                case "warning" /* Warning */:
                    return '⚠️';
                default:
                    return 'ℹ️';
            }
        };
        var resolutions = [];
        resolutions.push("### " + app_1.AppConfig.description);
        if (this.result) {
            resolutions.push(" ");
            for (var _i = 0, _a = this.result; _i < _a.length; _i++) {
                var subResult = _a[_i];
                resolutions.push("#### " + icon(subResult.result) + " " + subResult.label);
                if (subResult.dependency) {
                    if (subResult.result === "failure" /* Failure */) {
                        resolutions.push("This dependency is distributed under a license which is not allowed on this project - **this pull request can therefore not be merged**");
                    }
                    else {
                        resolutions.push("This is a new dependency, please [review it](" + subResult.dependency.url + ") and confirm you wish to introduce this to the codebase");
                    }
                }
            }
        }
        return resolutions.join('\n');
    };
    return Lookup;
}());
exports.default = Lookup;
//# sourceMappingURL=Lookup.js.map