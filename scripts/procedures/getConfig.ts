import {types as T, compat} from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
    "tor-address": {
        name: "phoenixd Tor Address",
        description: "The Tor address for the phoenixd interface.",
        type: "pointer",
        subtype: "package",
        "package-id": "phoenixd",
        target: "tor-address",
        interface: "main"
    },
    "auto-liquidity": {
        name: "Auto Liquidity",
        description: "Amount automatically requested when inbound liquidity is needed (default: 2m)",
        type: "enum",
        values: ["off", "2m", "5m", "10m"],
        "value-names": {
            "off": "Off",
            "2m": "2m",
            "5m": "5m",
            "10m": "10m"
        },
        default: "2m"
    },
    "max-mining-fee": {
        name: "Max Mining Fee",
        description: "Max mining fee for on-chain operations, in satoshis. Valid range is 5000 to 200000 satoshis.",
        type: "number",
        nullable: false,
        default: 10000,
        range: "[5000,200000]",
        integral: true,
        units: "satoshis"
    },
    "max-fee-credit": {
        name: "Max Fee Credit",
        description: "Max fee credit, if reached payments will be rejected (default: 100k)",
        type: "enum",
        values: ["off", "50k", "100k"],
        "value-names": {
            "off": "Off",
            "50k": "50k",
            "100k": "100k"
        },
        default: "100k"
    },
    chain: {
        name: "Chain",
        description: "Bitcoin chain to use (default: mainnet)",
        type: "enum",
        values: ["mainnet", "testnet"],
        "value-names": {
            "mainnet": "Mainnet",
            "testnet": "Testnet"
        },
        default: "mainnet"
    },
    "http-api-pass": {
        name: "HTTP API Password",
        description: "Password for the phoenixd HTTP API. This is used to authenticate API requests.",
        type: "string",
        nullable: false,
        masked: true,
        copyable: true,
        default: {
            charset: "a-f,0-9",
            len: 64,
        },
        pattern: "^[a-f0-9]{64}$",
        "pattern-description": "Must be a 64-character lowercase hexadecimal string.",
        warning: "Changing this password will require updating any services or clients that connect to phoenixd's HTTP API.",
    },
    verbosity: {
        name: "Logs Verbosity",
        description: "Logs verbosity level (default: prints high-level info to the console)",
        type: "enum",
        values: ["default", "verbose"],
        "value-names": {
            "default": "Default",
            "verbose": "Verbose"
        },
        default: "default"
    }
});
