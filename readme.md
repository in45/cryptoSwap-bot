# Crypto Swap Bot

## Overview

The Crypto Swap Bot is a Node.js application designed for automated cryptocurrency swaps using smart contracts on the Ethereum blockchain. It interfaces with the Uniswap router to perform token swaps and monitors price changes to execute trades based on predefined conditions. The application also handles configuration management and sends email notifications upon successful transactions.

## Features

- **Automated Token Swaps**: Executes token swaps using the Uniswap router based on market conditions.
- **Price Monitoring**: Continuously tracks cryptocurrency prices and executes trades when favorable conditions are met.
- **Configuration Management**: Reads and writes settings from a JSON configuration file.
- **Email Notifications**: Sends notifications via email upon successful transactions.

## Project Structure

- **`server.js`**: Sets up an Express server to handle HTTP requests and manage the swap bot.
- **`bot.js`**: Contains the core logic for interacting with the Ethereum blockchain and executing swaps.
- **`config.json`**: Configuration file for storing and managing settings used by the bot.

## Installation

1. **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Dependencies**

    Ensure you have [Node.js](https://nodejs.org/) installed. Then run:

    ```bash
    npm install
    ```

3. **Configure Environment**

    Create a `config.json` file in the root directory with the following structure:

    ```json
    {
        "url": "YOUR_ETHEREUM_PROVIDER_URL",
        "mnemonic": "YOUR_WALLET_MNEMONIC",
        "token1": "TOKEN1_ADDRESS",
        "token2": "TOKEN2_ADDRESS",
        "amount_in": "AMOUNT_IN",
        "amount_min": "AMOUNT_MIN",
        "public_address": "PUBLIC_ADDRESS",
        "pourc": 5,
        "amount_in2": 1,
        "symbole1": "SYMBOL1",
        "symbole2": "SYMBOL2"
    }
    ```

4. **Start the Server**

    ```bash
    node server.js
    ```

## API Endpoints

### `GET /config`

- **Description**: Fetches the current configuration settings from `config.json`.
- **Response**: Returns the configuration as a JSON object.

    ```json
    {
        "url": "YOUR_ETHEREUM_PROVIDER_URL",
        "mnemonic": "YOUR_WALLET_MNEMONIC",
        "token1": "TOKEN1_ADDRESS",
        "token2": "TOKEN2_ADDRESS",
        "amount_in": "AMOUNT_IN",
        "amount_min": "AMOUNT_MIN",
        "public_address": "PUBLIC_ADDRESS",
        "pourc": 5,
        "amount_in2": 1,
        "symbole1": "SYMBOL1",
        "symbole2": "SYMBOL2"
    }
    ```

### `POST /script`

- **Description**: Initiates the swap bot script based on the provided configuration.

- **Response**: 

    ```json
    {
        "message": "ok"
    }
    ```

