"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSceneContextScene = exports.GlobalStage = exports.GlobalScene = void 0;
var global_scene_1 = require("./scene/global-scene");
Object.defineProperty(exports, "GlobalScene", { enumerable: true, get: function () { return global_scene_1.GlobalScene; } });
var global_stage_1 = require("./stage/global-stage");
Object.defineProperty(exports, "GlobalStage", { enumerable: true, get: function () { return global_stage_1.GlobalStage; } });
var global_context_1 = require("./context/global-context");
Object.defineProperty(exports, "GlobalSceneContextScene", { enumerable: true, get: function () { return global_context_1.GlobalSceneContextScene; } });
