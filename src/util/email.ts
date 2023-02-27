import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const authClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
authClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const gmail = google.gmail({
    version: 'v1',
    auth: authClient,
});


export const getMessages = async () => {
    // get a list of all messages with no labels
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
    });

    const messages = res.data.messages;

    if (messages) {
        return messages;
    } else {
        return [];
    }
}

export const getMessageBody = async (messageId: string) => {
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
    });

    const message = res.data;

    if (message) {
        return message;
    } else {
        return [];
    }
}

export const markMessage = async (messageId: string) => {

    // add label "DoneDone" to message

    const labelRes = await gmail.users.labels.list({
        userId: 'me',
    });

    const labelId = labelRes.data.labels?.find(l => l.name === 'DoneDone')?.id;
    const addLabelIds = labelId ? [labelId] : [];

    await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
            addLabelIds: addLabelIds,
            removeLabelIds: ['UNREAD']
        }
    });

}

export const getMsgText = (parts: any[], idx: number = 0) => {
    const decoded = Buffer.from(parts[idx].body.data, 'base64').toString('utf-8');
    return decoded;
}