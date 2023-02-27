import dotenv from 'dotenv';
import puppeteer from 'puppeteer-extra';
import { Browser, executablePath } from 'puppeteer';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';

dotenv.config();

if (process.env.USE_RECAPTCHA_PLUGIN === '1') {
    puppeteer.use(RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: process.env.TWO_CAPTCHA_TOKEN,
        },
        visualFeedback: true,
    }));
}

type AccountCreds = {
    username: string;
    password: string;
    email: string;
    country: string;
    birthMonth: string;
    birthYear: string;
}

export default class Session {

    browser?: Browser;

    init = async () => {
        this.browser = await puppeteer.launch({
            headless: false,
            executablePath: executablePath(),
        });
    }

    createAccount = async ({
        username, password, email, country, birthMonth, birthYear
    }: AccountCreds) => {

        if (!this.browser) {
            await this.init();
        }

        const browser = this.browser!;

        const page = await browser.newPage();
        await page.goto("https://scratch.mit.edu/join");

        try {
        
            // step 1: username and password
        
            const inputUsername = await page.waitForSelector("input[name='username']", { timeout: 0 });
            const inputPassword = await page.$("input[name='password']");
            const inputPasswordConfirm = await page.$("input[name='passwordConfirm']");
            const btnNext1 = await page.$("button[type='submit']");
        
            await inputUsername?.type(username);
            await inputPassword?.type(password);
            await inputPasswordConfirm?.type(password);
            await btnNext1?.click();
        
        
            // step 2: select country
        
            const selectCountry = await page.waitForSelector("select[name='country']", { timeout: 2000 });
            const btnNext2 = await page.$("button[type='submit']");
        
            await selectCountry?.select(country);
            await btnNext2?.click();
        
        
            // step 3: birthday
        
            const inputBirthMonth = await page.waitForSelector("select[name='birth_month']", { timeout: 2000 });
            const inputBirthYear = await page.$("select[name='birth_year']");
            const btnNext3 = await page.$("button[type='submit']");
        
            await inputBirthMonth?.select(birthMonth);
            await inputBirthYear?.select(birthYear);
            await btnNext3?.click();
        
        
            // step 4: skip
        
            const btnNext4 = await page.waitForSelector("button[type='submit']", { timeout: 2000 });
            await btnNext4?.click();
        
        
            // step 5: email
        
            const inputEmail = await page.waitForSelector("input[name='email']", { timeout: 2000 });
            const btnNext5 = await page.$("button[type='submit']");
        
            await inputEmail?.type(email);
            await page.waitForTimeout(1000);
            await btnNext5?.click();
        
        
            // final step

            let solvingCaptcha = false;
            const interval = setInterval(async () => {
                if (!page.url().includes('join')) return;
                const btnGetStarted = await page.$("button[type='submit']");
                await btnGetStarted?.click();

                if (process.env.USE_RECAPTCHA_PLUGIN !== '1') return;

                // if captcha, try to solve it
                if (solvingCaptcha) return;
                solvingCaptcha = true;
                await page.solveRecaptchas();
                solvingCaptcha = false;
            }, 2000);

            // sign out

            await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 0 });
            clearInterval(interval);
            page.evaluate(() => {
                (document as any).evaluate("//span[contains(., 'Sign out')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().parentElement.click();
            });
        
            await page.waitForNavigation({ timeout: 0 });
            await page.close();

        } catch (e) {
            await page.close();
            throw e;
        }
    }

    verifyEmail = async (link: string) => {
        if (!this.browser) {
            await this.init();
        }

        const browser = this.browser!;

        const page = await browser.newPage();
        await page.goto(link);
        await page.waitForTimeout(1000);

        const url = new URL(page.url());
        const params = new URLSearchParams(url.search);
        const username = params.get("username");

        await page.close();
        return username;
    }

    signIn = async (username: string, password: string, close: boolean = true) => {
        if (!this.browser) {
            await this.init();
        }

        const browser = this.browser!;

        const page = await browser.newPage();
        await page.goto("https://scratch.mit.edu");
        page.evaluate(() => {
            (document as any).evaluate("//span[contains(., 'Sign out')]", document, null, XPathResult.ANY_TYPE, null )?.iterateNext()?.parentElement?.click();
        });

        await page.waitForTimeout(1000);
        await page.goto("https://scratch.mit.edu/login");

        const inputUsername = await page.waitForSelector("#id_username", { timeout: 0 });
        const inputPassword = await page.$("#id_password");
        const btnSignIn = (await page.$$("button[type='submit']"))[1];

        await inputUsername?.type(username);
        await inputPassword?.type(password);
        await btnSignIn?.click();

        await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 0 });
        await page.close();
    }

    resendConfirmationEmail = async (password: string) => {
        if (!this.browser) {
            await this.init();
        }

        const browser = this.browser!;
        const page = await browser.newPage();
        await page.goto("https://scratch.mit.edu/accounts/email_change");

        const inputPassword = await page.waitForSelector("#id_password", { timeout: 0 });
        const btnResend = await page.$("button[type='submit']");

        await inputPassword?.type(password);
        await btnResend?.click();

        await page.waitForTimeout(2000);
        await page.goto("https://scratch.mit.edu");
        await page.waitForTimeout(1000);
        page.evaluate(() => {
            (document as any).evaluate("//span[contains(., 'Sign out')]", document, null, XPathResult.ANY_TYPE, null )?.iterateNext()?.parentElement?.click();
        });

        await page.waitForNavigation({ timeout: 0 });
        await page.close();
    }

    close = async () => {
        if (this.browser) {
            await this.browser.close();
        }
    }

}