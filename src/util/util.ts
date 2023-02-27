import fs from "fs";
import path from "path";

import nouns from '../data/nouns.json';
import countries from '../data/countries.json';

const USERS_CSV_PATH = path.join(__dirname, "../out/users.csv");

// if USERS_CSV_PATH doesn't exist, create it
if (!fs.existsSync(USERS_CSV_PATH))
    fs.writeFileSync(USERS_CSV_PATH, 'username,password,email,verified');


const randomNoun = () => nouns[Math.floor(Math.random() * nouns.length)];

export const generateUsername = () => {
    const dateSuffix = Date.now().toString().slice(-6);
    const noun = randomNoun().slice(0, 14);
    const nounCased = noun.split('').map(m => {
        if (Math.random() > 0.8) return m.toUpperCase();
        return m;
    }).join('');

    return nounCased + dateSuffix;
}

export const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-10);
    return randomNoun() + randomNoun() + randomPassword;
}

export const generateCountry = () => countries[Math.floor(Math.random() * countries.length)];

export const saveUser = (username: string, password: string, email: string) => {
    fs.appendFileSync(USERS_CSV_PATH, `\n${username},${password},${email},0`);
}

export const updateUser = (username: string|null, idx: number, value: string) => {
    const users = fs.readFileSync(USERS_CSV_PATH, 'utf-8').split('\n');
    const user = users.find(u => u.split(',')[0] === username)?.split(',');
    if (!user) return;

    user[idx] = value;
    const newUser = user.join(',');
    const newUsers = users.map(u => u.split(',')[0] === username ? newUser : u).join('\n');
    fs.writeFileSync(USERS_CSV_PATH, newUsers);
}

export const getAllUsers = () => {
    const users = fs.readFileSync(USERS_CSV_PATH, 'utf-8').split(/\r?\n/);
    return users.map(u => {
        const [username, password, email, verified] = u.split(',');
        return { username, password, email, verified };
    }).slice(1);
}