# telegraf-global-scene

They also work as built-in scenes, but it becomes possible to use the listeners of these scenes while outside the scene

## Context

`IGlobalSceneContext - interface for global scene`

## Scene

`GlobalScene(sceneName, options)`

## Stage

`GlobalStage(scenes)`

### Example

```code
import { Telegraf } from 'telegraf';
import { IGlobalSceneContext, GlobalScene, GlobalStage } from 'telegraf-global-scene';
import LocalSession from 'telegraf-session-local';

interface ISessionState {
    text: string;
}

const bot = new Telegraf<IGlobalSceneContext<ISessionState>>('TOKEN');
bot.use(new LocalSession().middleware());

const globalScene = new GlobalScene<ISessionState>('sceneName', {
    globalCommands: false,
    globalActions: true,
});
const stage = new GlobalStage([globalScene]);

globalScene.command('scene', (ctx) => {
    ctx.session.state.text = 'Hello';
    ctx.reply('Press button', {
        reply_markup: {
            inline_keyboard: [
                [{ callback_data: 'update', text: 'Update session' }],
                [{ callback_data: 'get', text: 'Get session text' }],
            ],
        },
    });
});

globalScene.action('update', async (ctx) => {
    ctx.session.state.text
        ? (ctx.session.state.text += ' Hello')
        : (ctx.session.state.text = 'Hello');

    const msg = await ctx.reply('Updated');
    setTimeout(async () => {
        await ctx.deleteMessage(msg.message_id);
    }, 500);
});

globalScene.action('get', (ctx) => {
    ctx.reply(ctx.session.state.text || '');
});

bot.use(stage.middleware());

bot.start((ctx) => {
    ctx.scene.enter('sceneName');
    ctx.reply('Enter scene');
});

bot.launch();
```
