const discord = require( "discord.js" );
const client = new discord.Client();

const io = require( "socket.io-client" );

require( "dotenv" ).config();

const donationalerts = io( `${ process.env.url }:${ process.env.port }` );
donationalerts.emit( "add-user", { token: process.env.donationalerts_token, type: process.env.type } );

const getDateTime = () => {
    let now = new Date();

    return `${ now.getDate() }.${ now.getMonth() }.${ now.getFullYear() } в ${ now.getHours() }:${ now.getMinutes() }:${ now.getSeconds() }`;
}

client.on( "ready", () => {
    console.log( "Discord бот подключился." );

    const channel = client.channels.cache.get( `${ process.env.channel_id }` );

    donationalerts.on( "donation", ( donate ) => {
        donate = JSON.parse( donate );

        let embed = new discord.MessageEmbed()
            .setColor( "#EFA30B" )
            .setTitle( `💰 Новое пожертвование` )
            .addFields(
                {
                    name: "Способ оплаты:",
                    value: 'DonationAlerts'
                },
                {
                    name: "Идентификатор пожертвования:",
                    value: `${ donate.id }`
                },
                {
                    name: "Пожертвовал:",
                    value: `${ donate.username }`
                },
                {
                    name: "Сообщение:",
                    value: `${ donate.message }` || "_Отсуствует_"
                },
                {
                    name: "Сумма:",
                    value: `${ donate.amount } ${ donate.currency }`
                }
            )
            .setFooter( getDateTime() );

		channel.send( `<@!${ process.env.user_id }>`, embed );
    } );
} );

client.login( process.env.bot_token );