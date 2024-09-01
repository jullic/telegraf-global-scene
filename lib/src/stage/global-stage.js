"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalStage = void 0;
const global_context_1 = require("./../context/global-context");
const telegraf_1 = require("telegraf");
class GlobalStage {
    constructor(globalScenes) {
        this.globalScenes = globalScenes;
        this.handler = telegraf_1.Composer.compose([]);
    }
    middleware() {
        this.getListeners();
        return this.handler;
    }
    getListeners() {
        const wrapper = (scene, middleware) => {
            return (ctx, next) => {
                if (ctx.session.currentScene === scene.sceneName) {
                    //@ts-ignore
                    return middleware(ctx, next);
                }
                else {
                    return next();
                }
            };
        };
        this.handler = telegraf_1.Composer.compose([
            (ctx, next) => {
                const scene = new global_context_1.GlobalSceneContextScene(ctx, this.globalScenes);
                if (!ctx.session.currentScene) {
                    ctx.session.currentScene = '';
                }
                if (!ctx.session.state) {
                    ctx.session.state = {};
                }
                ctx.scene = scene;
                return next();
            },
            this.handler,
        ]);
        this.globalScenes.forEach((scene) => {
            scene.allCommands.forEach((command) => {
                if (!scene.options.globalCommands) {
                    this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.command(command.command, wrapper(scene, fn))),
                    ]);
                }
                else {
                    this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.command(command.command, fn)),
                    ]);
                }
            });
            scene.allActions.forEach((command) => {
                if (!scene.options.globalActions) {
                    return (this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.action(command.triggers, wrapper(scene, fn))),
                    ]));
                }
                else {
                    this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.action(command.triggers, fn)),
                    ]);
                }
            });
            scene.allHears.forEach((command) => {
                if (!scene.options.globalHears) {
                    return (this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.hears(command.triggers, wrapper(scene, fn))),
                    ]));
                }
                else {
                    this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.hears(command.triggers, fn)),
                    ]);
                }
            });
            scene.allOns.forEach((command) => {
                if (!scene.options.globalOns) {
                    return (this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.on(command.filters, wrapper(scene, fn))),
                    ]));
                }
                else {
                    this.handler = telegraf_1.Composer.compose([
                        this.handler,
                        ...command.middlewares.map((fn) => telegraf_1.Composer.on(command.filters, fn)),
                    ]);
                }
            });
            if (scene.enterCommand) {
                this.handler = telegraf_1.Composer.compose([
                    this.handler,
                    telegraf_1.Composer.command(scene.enterCommand, (ctx) => __awaiter(this, void 0, void 0, function* () {
                        ctx.scene.enter(scene.sceneName);
                    })),
                ]);
            }
        });
    }
}
exports.GlobalStage = GlobalStage;
