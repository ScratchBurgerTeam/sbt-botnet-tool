import Session from './util/session';
import { getAllUsers } from './util/util';


const main = async () => {
    const session = new Session();
    await session.init();

    const users = getAllUsers();

    for (const user of users) {
        if (user.verified === '1') continue;

        await session.signIn(user.username, user.password);
        await session.resendConfirmationEmail(user.password);
        console.log("Verification successful?");
    }

    await session.close();
}

main();