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
        description: "Amount automatically requested when inbound liquidity is needed",
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
    "max-absolute-fee": {
        name: "Max Absolute Fee",
        description: "Max absolute fee for on-chain operations. Includes mining fee and service fee for auto-liquidity.",
        type: "number",
        nullable: false,
        default: 0.02,
        range: "[0,1]"
    },
    "max-fee-credit": {
        name: "Max Fee Credit",
        description: "Max fee credit, if reached payments will be rejected.",
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
        description: "Bitcoin chain to use",
        type: "enum",
        values: ["mainnet", "testnet"],
        "value-names": {
            "mainnet": "Mainnet",
            "testnet": "Testnet"
        },
        default: "mainnet"
    },
    "http-password": {
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
        name: "Verbosity",
        description: "Verbosity level",
        type: "enum",
        values: ["silent", "verbose"],
        "value-names": {
            "silent": "Silent",
            "verbose": "Verbose"
        },
        default: "verbose"
    }
});
