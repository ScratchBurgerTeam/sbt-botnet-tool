import { getMessages, getMessageBody, markMessage, getMsgText } from './util/email';
import Session from './util/session';
import { updateUser } from './util/util';
import { parse } from 'node-html-parser';


const main = async () => {
    const session = new Session();
    await session.init();
    
    const messages = await getMessages();
    for (const message of messages) {
        const messageBody = await getMessageBody(message.id!) as any;
        const messageText = getMsgText(messageBody.payload.parts, 0).split('\n');
        const messageHtml = parse(getMsgText(messageBody.payload.parts, 1));

        const username = messageHtml.querySelector('strong')?.innerText ?? null;
        const verificationLink: string|undefined = messageText.find(f => f.startsWith('https://'));

        if (!verificationLink) {
            console.log("Failed to verify: link not found");
            continue;
        }

        await session.verifyEmail(verificationLink);
        console.log("Verification successful?");
        updateUser(username, 3, '1');
        await markMessage(message.id!);
    }

    await session.close();
}

main();