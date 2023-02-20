import {
	CallbackQuery,
	Message,
	Update,
} from 'telegraf/typings/core/types/typegram';
import { Guard, MaybeArray } from 'telegraf/typings/util';
import { IGlobalSceneContext } from './../context/global-context';
import { Composer, Middleware, NarrowedContext } from 'telegraf';
import { Triggers } from 'telegraf/typings/composer';
import { FilteredContext } from 'telegraf/typings/context';
import { UpdateType, MountMap } from 'telegraf/typings/telegram-types';

export type Filter = UpdateType | Guard<Update>;

export interface IGlobalCommand<
	T extends Record<string, any> = Record<string, any>
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
	T extends Record<string, any> = Record<string, any>
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
	T extends Record<string, any> = Record<string, any>
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
	T extends Record<string, any> = Record<string, any>
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
	T extends Record<string, any> = Record<string, any>
> extends Composer<IGlobalSceneContext<T>> {
	allCommands: IGlobalCommand<T>[] = [];
	allActions: IGlobalAction<T>[] = [];
	allHears: IGlobalHears<T>[] = [];
	allOns: IGlobalOn<T>[] = [];
	options: IGlobalSceneOptions;

	constructor(
		public sceneName: string,
		sceneOptions?: Partial<IGlobalSceneOptions>
	) {
		super();
		this.options = {
			...defaultOptions,
			...sceneOptions,
		};
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

	on<Filter extends UpdateType | Guard<Update>>(
		filters: MaybeArray<Filter>,
		fns_0: Middleware<FilteredContext<IGlobalSceneContext<T>, Filter>>,
		...fns_1: Middleware<FilteredContext<IGlobalSceneContext<T>, Filter>>[]
	): this;
	on<
		Filter extends
			| 'message'
			| 'poll'
			| 'callback_query'
			| 'channel_post'
			| 'chat_member'
			| 'chosen_inline_result'
			| 'edited_channel_post'
			| 'edited_message'
			| 'inline_query'
			| 'my_chat_member'
			| 'pre_checkout_query'
			| 'poll_answer'
			| 'shipping_query'
			| 'chat_join_request'
			| 'forward_date'
			| 'channel_chat_created'
			| 'chat_shared'
			| 'connected_website'
			| 'delete_chat_photo'
			| 'group_chat_created'
			| 'invoice'
			| 'left_chat_member'
			| 'message_auto_delete_timer_changed'
			| 'migrate_from_chat_id'
			| 'migrate_to_chat_id'
			| 'new_chat_members'
			| 'new_chat_photo'
			| 'new_chat_title'
			| 'passport_data'
			| 'proximity_alert_triggered'
			| 'forum_topic_created'
			| 'forum_topic_closed'
			| 'forum_topic_reopened'
			| 'pinned_message'
			| 'successful_payment'
			| 'supergroup_chat_created'
			| 'user_shared'
			| 'video_chat_scheduled'
			| 'video_chat_started'
			| 'video_chat_ended'
			| 'video_chat_participants_invited'
			| 'web_app_data'
			| 'animation'
			| 'document'
			| 'has_media_spoiler'
			| 'audio'
			| 'contact'
			| 'dice'
			| 'game'
			| 'location'
			| 'photo'
			| 'sticker'
			| 'text'
			| 'venue'
			| 'video'
			| 'video_note'
			| 'voice'
	>(
		filters: MaybeArray<Filter>,
		fns_0: Middleware<
			NarrowedContext<IGlobalSceneContext<T>, MountMap[Filter]>
		>,
		...fns_1: Middleware<
			NarrowedContext<IGlobalSceneContext<T>, MountMap[Filter]>
		>[]
	): this;
	on(filters: unknown, ...fns: unknown[]): this {
		this.allOns.push({ filters, middlewares: fns });
		return this;
	}
}
