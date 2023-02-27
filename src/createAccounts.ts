import dotenv from "dotenv";
dotenv.config();

import { generateUsername, generatePassword, generateCountry, saveUser } from "./util/util";
import Session from "./util/session";

const EMAIL = process.env.EMAIL || 'scratchslander1@gmail.com';
const MONTHS = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"
];
const YEARS = [
    "2000", "2001", "2002", "2003", 
    "2004", "2005", "2006", "2007", 
    "2008", "2009", "2010", "2011",
];

const main = async () => {
    const session = new Session();
    await session.init();

    while (true) {
        const username = generateUsername();
        const password = generatePassword();
        const email = EMAIL;
        const country = generateCountry();
        const birthMonth = MONTHS[Math.floor(Math.random() * MONTHS.length)];
        const birthYear = YEARS[Math.floor(Math.random() * YEARS.length)];
        try {

            await session.createAccount({
                username, password, email, country, birthMonth, birthYear
            });

            saveUser(username, password, email);
        } catch (e: any) {
            console.log('Failed to create account', username, password, '  Error:', e.message);
        }
    }
}

main();