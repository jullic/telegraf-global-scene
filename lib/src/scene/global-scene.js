"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalScene = void 0;
const telegraf_1 = require("telegraf");
const defaultOptions = {
    globalCommands: false,
    globalActions: true,
    globalHears: false,
    globalOns: false,
};
class GlobalScene extends telegraf_1.Composer {
    constructor(sceneName, sceneOptions) {
        super();
        this.sceneName = sceneName;
        this.allCommands = [];
        this.allActions = [];
        this.allHears = [];
        this.allOns = [];
        this.options = Object.assign(Object.assign({}, defaultOptions), sceneOptions);
        this.enterHandler = telegraf_1.Composer.compose([]);
        this.leaveHandler = telegraf_1.Composer.compose([]);
        this.enterCommand = null;
    }
    leave(...fns) {
        this.leaveHandler = telegraf_1.Composer.compose([this.leaveHandler, ...fns]);
        return this;
    }
    leaveMiddleware() {
        return this.leaveHandler;
    }
    enter(...fns) {
        this.enterHandler = telegraf_1.Composer.compose([this.enterHandler, ...fns]);
        return this;
    }
    enterMiddleware() {
        return this.enterHandler;
    }
    command(command, fns_0, ...fns_1) {
        // const wrap: MiddlewareFn<IGlobalSceneContext> = (ctx, next) => {};
        this.allCommands.push({ command, middlewares: [fns_0, ...fns_1] });
        return this;
    }
    action(triggers, fns_0, ...fns_1) {
        this.allActions.push({ triggers, middlewares: [fns_0, ...fns_1] });
        return this;
    }
    hears(triggers, fns_0, ...fns_1) {
        this.allHears.push({ triggers, middlewares: [fns_0, ...fns_1] });
        return this;
    }
    on(filters, ...fns) {
        this.allOns.push({ filters, middlewares: fns });
        return this;
    }
}
exports.GlobalScene = GlobalScene;
