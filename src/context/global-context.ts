import { BaseGlobalSceneSessionState } from '../common/types';
import { GlobalScene } from './../scene/global-scene';
import { Context } from 'telegraf';

const noop = () => Promise.resolve();

export interface IGlobalSceneContext<
	T extends BaseGlobalSceneSessionState = BaseGlobalSceneSessionState
> extends Context {
	scene: GlobalSceneContextScene<T, IGlobalSceneContext<T>>;
	session: IGlobalSceneSession<T>;
}

export interface IGlobalSceneSession<T extends BaseGlobalSceneSessionState> {
	currentScene: string | undefined;
	state: Partial<T>;
}

export class GlobalSceneContextScene<
	S extends BaseGlobalSceneSessionState,
	C extends IGlobalSceneContext<S>
> {
	currentScene: GlobalScene<S> | undefined;
	constructor(private ctx: C, private readonly scenes: GlobalScene<S>[]) {}

	get current(): GlobalScene<S> | undefined {
		const sceneName = this.ctx.session.currentScene;
		return this.scenes.find((scene) => scene.sceneName === sceneName);
	}

	async enter(sceneName: string): Promise<any> {
		this.currentScene = this.scenes.find(
			(scene) => scene.sceneName === sceneName
		);

		if (!this.currentScene) {
			throw new Error('Wrong scene name');
		}
		this.ctx.session.currentScene = sceneName;
		if (!this.ctx.session.state) {
			this.ctx.session.state = {};
		}
		const handler = this.currentScene.enterMiddleware();
		return await handler(this.ctx, noop);
	}

	async leave() {
		const currentScene = this.current;
		if (!currentScene) {
			return;
		}
		this.ctx.session.currentScene = undefined;
		const handler = currentScene.leaveMiddleware();
		await handler(this.ctx, noop);
	}
}
