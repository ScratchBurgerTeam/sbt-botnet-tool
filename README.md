# SBT Account Creation Tool

This program automatically creates Scratch accounts and verifies them using Gmail. If you find a bug or have any question/suggestion, please open an issue or contact us on [Discord](https://discord.gg/PnqRjCVm8z)!

## Requirements

- Node.js
- A computer that can run Chromium and Puppeteer
- A Gmail account
- A Google Cloud Platform project with the Gmail API enabled
- (optional) 2captcha API key


## Installation

First, install and build the project.
```bash
npm install
npm run build
```

Create a `.env` file in the root directory and fill it out with the following information:
```sh
EMAIL=youremail@gmail.com
CLIENT_ID=<Your Google Cloud Platform project client ID>
CLIENT_SECRET=<Your Google Cloud Platform project client secret>
REFRESH_TOKEN=<Your Gmail OAuth refresh token>
REDIRECT_URI=https://developers.google.com/oauthplayground

USE_RECAPTCHA_PLUGIN=1 # Set to 0 if you don't want automatic captcha solver
TWO_CAPTCHA_TOKEN=<Your 2captcha API key> # Only required if USE_RECAPTCHA_PLUGIN is set to 1
```


## Gmail Setup

First of all, we recommend creating a new Gmail account for this purpose. You have to disable spam filters and create a new label with the name "DoneDone" (exact case). You also have to enabled the Gmail API and create OAuth credentials for your project. [Here's a guide](https://stateful.com/blog/gmail-api-node-tutorial) on how to do that. 

After running `npm run verifyAccounts`, please go to your Gmail, select all messages, mark them as read and add the "DoneDone" label to them. This will prevent the program from going through the "Welcome to Scratch" emails.


## Usage

### Creating accounts

To start creating accounts, run the following command:

```bash
npm run createAccounts
```

This will open a Puppeteer browser and start creating accounts. The accounts data will be saved in the `out/users.csv` file. If you disable the captcha plugin, you will have to solve the captchas manually. They usually appear after 10-20 successful account creations. To temporarily get rid of captchas, you can try changing your IP address with a VPN or other methods.

> Note: If an error or glitch occurs and the program doesn't exit automatically after 10 seconds, you should restart it manually.

> Note: You can get a 2captcha API key by signing up to 2captcha. Keep in mind that this service is paid, the price is approximately $3 per 1000 captchas.

### Verifying accounts

To verify creatd accounts through email, run:

```bash
npm run verifyAccounts
```

This will open a Puppeteer browser and start verifying accounts. After all accounts are verified, the program will exit automatically. After that, you can check which accounts were successfully verified by looking at the `out/verified.csv` file (verified accounts have a `1` in the `verified` column).

Some accounts would most likely still not be verified, due to Scratch's rate limiting. To fix that, you can run:

```bash
npm run fixAccounts
```

This will open a Puppeteer browser and start re-verifying accounts by logging into them and resending the confirmation email. After the program exits automatically, run `npm run verifyAccounts` again to verify the accounts that were fixed. Repeat this process until all accounts are verified.


## What's next?

After you create the bots, you can use the [Scratch Python API](https://cubeythecube.github.io/scratchclient/) or any other Scratch API to control them. Please keep in mind that bots are against Scratch's Terms of Service and Community Guidelines, so use them at your own risk. To avoid getting IP banned, we recommend using a VPN or proxy.