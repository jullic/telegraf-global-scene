import { GlobalSceneContextScene } from './../context/global-context';
import { Composer, Middleware, MiddlewareFn } from 'telegraf';
import { GlobalScene } from '../scene/global-scene';
import { IGlobalSceneContext } from '../context/global-context';

export class GlobalStage<T extends Record<string, any> = Record<string, any>> {
	private handler: MiddlewareFn<IGlobalSceneContext<T>>;

	constructor(private readonly globalScenes: GlobalScene<T>[]) {
		this.handler = Composer.compose([]);
		this.getListeners();
	}

	middleware() {
		this.handler = Composer.compose([this.handler]);
		return this.handler;
	}

	private getListeners() {
		const wrapper = <M extends IGlobalSceneContext<T>>(
			scene: GlobalScene<T>,
			middleware: Middleware<M>
		): Middleware<M> => {
			return (ctx, next) => {
				if (ctx.session.currentScene === scene.sceneName) {
					//@ts-ignore
					return middleware(ctx, next);
				} else {
					return next();
				}
			};
		};

		this.handler = Composer.compose([
			(ctx, next) => {
				const scene = new GlobalSceneContextScene(
					ctx,
					this.globalScenes
				);
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
					this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn) =>
							Composer.command<IGlobalSceneContext<T>>(
								command.command,
								wrapper(scene, fn)
							)
						),
					]);
				} else {
					this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn) =>
							Composer.command(command.command, fn)
						),
					]);
				}
			});
			scene.allActions.forEach((command) => {
				if (!scene.options.globalActions) {
					return (this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn) =>
							Composer.action<IGlobalSceneContext<T>>(
								command.triggers,
								wrapper(scene, fn)
							)
						),
					]));
				} else {
					this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn) =>
							Composer.action(command.triggers, fn)
						),
					]);
				}
			});
			scene.allHears.forEach((command) => {
				if (!scene.options.globalHears) {
					return (this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn) =>
							Composer.hears<IGlobalSceneContext<T>>(
								command.triggers,
								wrapper(scene, fn)
							)
						),
					]));
				} else {
					this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn) =>
							Composer.hears(command.triggers, fn)
						),
					]);
				}
			});
			scene.allOns.forEach((command) => {
				if (!scene.options.globalOns) {
					return (this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn: any) =>
							Composer.on<IGlobalSceneContext<T>, any>(
								command.filters,
								wrapper(scene, fn)
							)
						),
					]));
				} else {
					this.handler = Composer.compose([
						this.handler,
						...command.middlewares.map((fn: any) =>
							Composer.on(command.filters, fn)
						),
					]);
				}
			});
		});
	}
}
