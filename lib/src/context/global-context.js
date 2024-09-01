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
exports.GlobalSceneContextScene = void 0;
const noop = () => Promise.resolve();
class GlobalSceneContextScene {
    constructor(ctx, scenes) {
        this.ctx = ctx;
        this.scenes = scenes;
    }
    get current() {
        const sceneName = this.ctx.session.currentScene;
        return this.scenes.find((scene) => scene.sceneName === sceneName);
    }
    enter(sceneName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentScene = this.scenes.find((scene) => scene.sceneName === sceneName);
            if (!this.currentScene) {
                throw new Error('Wrong scene name');
            }
            this.ctx.session.currentScene = sceneName;
            if (!this.ctx.session.state) {
                this.ctx.session.state = {};
            }
            const handler = this.currentScene.enterMiddleware();
            return yield handler(this.ctx, noop);
        });
    }
    leave() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentScene = this.current;
            if (!currentScene) {
                return;
            }
            this.ctx.session.currentScene = undefined;
            const handler = currentScene.leaveMiddleware();
            yield handler(this.ctx, noop);
        });
    }
}
exports.GlobalSceneContextScene = GlobalSceneContextScene;
