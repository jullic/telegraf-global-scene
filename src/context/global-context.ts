import { Context } from 'telegraf';
export interface IGlobalSceneContext<
	T extends Record<string, any> = Record<string, any>
> extends Context {
	scene: GlobalSceneContextScene<T, IGlobalSceneContext<T>>;
	session: IGlobalSceneSession<T>;
}

export interface IGlobalSceneSession<T extends Record<string, any>> {
	currentScene: string;
	state: Partial<T>;
}

export class GlobalSceneContextScene<
	S extends Record<string, any>,
	C extends IGlobalSceneContext<S>
> {
	constructor(private ctx: C, private readonly scenes: any[]) {}

	enter(sceneName: string) {
		if (!this.scenes.find((scene) => scene.sceneName === sceneName)) {
			throw new Error('Wrong scene name');
		}
		this.ctx.session.currentScene = sceneName;
		if (!this.ctx.session.state) {
			this.ctx.session.state = {};
		}
	}

	leave() {
		this.ctx.session.currentScene = '';
	}
}
