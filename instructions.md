# phoenixd for StartOS

**What is phoenixd?**

`phoenixd` is a minimal, specialized Lightning node designed for sending and receiving Lightning payments. It uses the same software as the popular Phoenix Wallet, but it:

- Runs on a server 24/7 instead of a mobile device
- Offers an HTTP API instead of a GUI
- Has fully automated liquidity management to facilitate receive-heavy use cases like merchants, crowdfunding, etc.

`phoenixd` makes it very easy to develop any application that needs to interact with Lightning, by abstracting away all the complexity, without compromising on self-custody.

**Accessing phoenixd service**

To get into the `phoenixd` service and start using it with `phoenix-cli`, you need to SSH into your StartOS and run the following command:

```sh
sudo podman exec -it phoenixd.embassy bash
```

**Using `phoenix-cli` to interact with the daemon**

You can use `phoenix-cli` to interact with the daemon. Here are some examples:

**Show basic info about your node**
```sh
phoenix-cli getinfo
```

**Create a Lightning invoice**
```sh
phoenix-cli createinvoice \
    --description "my first invoice" \
    --amountSat 12345
```
**Send to a bitcoin address**
```sh
phoenix-cli sendtoaddress \
    --address tb1q2qlmy0t2g33tjgujr6h53dxmypuf8qps9jnv9q \
    --amountSat 100000 \
    --feerateSatByte 12
```

**Learn More**

You can learn more about the phoenixd API at the [official documentation](https://phoenix.acinq.co/server/api).
