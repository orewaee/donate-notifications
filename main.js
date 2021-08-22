const { Client, Intents, MessageEmbed } = require( "discord.js" );
const client = new Client( { intents: [ Intents.FLAGS.GUILDS ] } );

const Centrifuge = require( "centrifuge" );
const ws = require( "ws" );

global.XMLHttpRequest = require( "xmlhttprequest" ).XMLHttpRequest;

require( "dotenv" ).config();

client.once( "ready", () => {
    client.user.setActivity( "донаты", { type: "LISTENING" } );

    console.log( "Discord бот подключился." );

    let centrifuge = new Centrifuge( process.env.url, {
        websocket: ws,
        subscribeEndpoint: "https://www.donationalerts.com/api/v1/centrifuge/subscribe",
        subscribeHeaders: {
            "Authorization": `Bearer ${ process.env.access_token }`
        }
    } );

    centrifuge.setToken( process.env.soket_token );

    centrifuge.connect();

    centrifuge.on( "connect", ( context ) => {
        let client_id = context.client;
    
        console.log( "Donationalerts приложение подключилось:", client_id );
    
        centrifuge.subscribe( `$alerts:donation_${ process.env.app_id }`, ( message ) => {
            let embed = new MessageEmbed()
                .addFields(
                    {
                        name: "Идентификатор пожертвования:",
                        value: `${ message.data.id }`
                    },
                    {
                        name: "Пожертвовал:",
                        value: `${ message.data.username }`
                    },
                    {
                        name: "Сообщение:",
                        value: `${ message.data.message }` || "Отсуствует"
                    },
                    {
                        name: "Сумма:",
                        value: `${ message.data.amount } ${message.data.currency }`
                    }
                );
            
                client.channels.cache.get( `${ process.env.channel_id }` ).send( { embeds: [ embed ] } );
        } );
    } );
    
    centrifuge.on( "disconnect", ( context ) => {
        console.log( "Donationalerts приложение отключилось.", context );
    } );
} );

client.login( process.env.bot_token );