import {
	CallbackQuery,
	Message,
	Update,
} from 'telegraf/typings/core/types/typegram';
import { IGlobalSceneContext } from './../context/global-context';
import { Composer, Middleware, MiddlewareFn, NarrowedContext } from 'telegraf';
import { Triggers } from 'telegraf/typings/composer';
import Context, { FilteredContext } from 'telegraf/typings/context';
import {
	UpdateType,
	MountMap,
	MessageSubType,
} from 'telegraf/typings/telegram-types';
import {
	Guard,
	MaybeArray,
	NonemptyReadonlyArray,
} from 'telegraf/typings/core/helpers/util';
import { BaseGlobalSceneSessionState } from '../common/types';

type MatchedContext<
	C extends Context,
	T extends UpdateType | MessageSubType
> = NarrowedContext<C, MountMap[T]>;

export type Filter = UpdateType | Guard<Update>;

export interface IGlobalCommand<
	T extends BaseGlobalSceneSessionState = BaseGlobalSceneSessionState
> {
	command: MaybeArray<string>;
	middlewares: Middleware<
		NarrowedContext<
			IGlobalSceneContext<T>,
			{
				message: Update.New & Update.NonChannel & Message.TextMessage;
				update_id: number;
			}
		>
	>[];
}

export interface IGlobalAction<
	T extends BaseGlobalSceneSessionState = BaseGlobalSceneSessionState
> {
	triggers: Triggers<IGlobalSceneContext<T>>;
	middlewares: Middleware<
		NarrowedContext<
			IGlobalSceneContext<T> & { match: RegExpExecArray },
			Update.CallbackQueryUpdate<CallbackQuery>
		>
	>[];
}

export interface IGlobalHears<
	T extends BaseGlobalSceneSessionState = BaseGlobalSceneSessionState
> {
	triggers: Triggers<IGlobalSceneContext<T>>;
	middlewares: Middleware<
		NarrowedContext<
			IGlobalSceneContext<T> & { match: RegExpExecArray },
			{
				message: Update.New & Update.NonChannel & Message.TextMessage;
				update_id: number;
			}
		>
	>[];
}

export interface IGlobalOn<
	T extends BaseGlobalSceneSessionState = BaseGlobalSceneSessionState
> {
	filters: any;
	middlewares: any;
}

export interface IGlobalSceneOptions {
	globalCommands: boolean;
	globalActions: boolean;
	globalHears: boolean;
	globalOns: boolean;
}

const defaultOptions = {
	globalCommands: false,
	globalActions: true,
	globalHears: false,
	globalOns: false,
};

export class GlobalScene<
	T extends BaseGlobalSceneSessionState = BaseGlobalSceneSessionState
> extends Composer<IGlobalSceneContext<T>> {
	allCommands: IGlobalCommand<T>[] = [];
	allActions: IGlobalAction<T>[] = [];
	allHears: IGlobalHears<T>[] = [];
	allOns: IGlobalOn<T>[] = [];
	options: IGlobalSceneOptions;
	enterHandler: MiddlewareFn<IGlobalSceneContext<T>>;
	leaveHandler: MiddlewareFn<IGlobalSceneContext<T>>;
	enterCommand: string | null;

	constructor(
		public sceneName: string,
		sceneOptions?: Partial<IGlobalSceneOptions>
	) {
		super();
		this.options = {
			...defaultOptions,
			...sceneOptions,
		};
		this.enterHandler = Composer.compose([]);
		this.leaveHandler = Composer.compose([]);
		this.enterCommand = null;
	}

	leave(...fns: Array<Middleware<IGlobalSceneContext<T>>>) {
		this.leaveHandler = Composer.compose([this.leaveHandler, ...fns]);
		return this;
	}

	leaveMiddleware() {
		return this.leaveHandler;
	}

	enter(...fns: Array<Middleware<IGlobalSceneContext<T>>>) {
		this.enterHandler = Composer.compose([this.enterHandler, ...fns]);
		return this;
	}

	enterMiddleware() {
		return this.enterHandler;
	}

	command(
		command: MaybeArray<string>,
		fns_0: Middleware<
			NarrowedContext<
				IGlobalSceneContext<T>,
				{
					message: Update.New &
						Update.NonChannel &
						Message.TextMessage;
					update_id: number;
				}
			>
		>,
		...fns_1: Middleware<
			NarrowedContext<
				IGlobalSceneContext<T>,
				{
					message: Update.New &
						Update.NonChannel &
						Message.TextMessage;
					update_id: number;
				}
			>
		>[]
	): this {
		// const wrap: MiddlewareFn<IGlobalSceneContext> = (ctx, next) => {};
		this.allCommands.push({ command, middlewares: [fns_0, ...fns_1] });
		return this;
	}

	action(
		triggers: Triggers<IGlobalSceneContext<T>>,
		fns_0: Middleware<
			NarrowedContext<
				IGlobalSceneContext<T> & { match: RegExpExecArray },
				Update.CallbackQueryUpdate<CallbackQuery>
			>
		>,
		...fns_1: Middleware<
			NarrowedContext<
				IGlobalSceneContext<T> & { match: RegExpExecArray },
				Update.CallbackQueryUpdate<CallbackQuery>
			>
		>[]
	): this {
		this.allActions.push({ triggers, middlewares: [fns_0, ...fns_1] });
		return this;
	}

	hears(
		triggers: Triggers<IGlobalSceneContext<T>>,
		fns_0: Middleware<
			NarrowedContext<
				IGlobalSceneContext<T> & { match: RegExpExecArray },
				{
					message: Update.New &
						Update.NonChannel &
						Message.TextMessage;
					update_id: number;
				}
			>
		>,
		...fns_1: Middleware<
			NarrowedContext<
				IGlobalSceneContext<T> & { match: RegExpExecArray },
				{
					message: Update.New &
						Update.NonChannel &
						Message.TextMessage;
					update_id: number;
				}
			>
		>[]
	): this {
		this.allHears.push({ triggers, middlewares: [fns_0, ...fns_1] });
		return this;
	}

	on<Filter extends UpdateType | Guard<IGlobalSceneContext<T>['update']>>(
		filters: MaybeArray<Filter>,
		...fns: NonemptyReadonlyArray<
			Middleware<FilteredContext<IGlobalSceneContext<T>, Filter>>
		>
	): this;

	/**
	 * Registers middleware for handling updates narrowed by update types or message subtypes.
	 * @deprecated Use filter utils instead. Support for Message subtype in `Composer::on` will be removed in Telegraf v5.
	 */
	on<Filter extends UpdateType | MessageSubType>(
		filters: MaybeArray<Filter>,
		...fns: NonemptyReadonlyArray<
			Middleware<
				NarrowedContext<IGlobalSceneContext<T>, MountMap[Filter]>,
				MountMap[Filter]
			>
		>
	): this;

	on<
		Filter extends
			| UpdateType
			| MessageSubType
			| Guard<IGlobalSceneContext<T>['update']>
	>(
		filters: MaybeArray<Filter>,
		...fns: NonemptyReadonlyArray<
			Middleware<
				Filter extends MessageSubType
					? MatchedContext<IGlobalSceneContext<T>, Filter>
					: Filter extends
							| UpdateType
							| Guard<IGlobalSceneContext<T>['update']>
					? FilteredContext<IGlobalSceneContext<T>, Filter>
					: never
			>
		>
	): this;
	on(filters: unknown, ...fns: unknown[]): this {
		this.allOns.push({ filters, middlewares: fns });
		return this;
	}
}
