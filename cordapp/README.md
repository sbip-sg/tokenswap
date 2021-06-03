# Fungible House token sample CorDapp

This CorDapp serves as a basic example to create, issue, and move [Fungible](https://training.corda.net/libraries/tokens-sdk/#fungibletoken) tokens in Corda utilizing the Token SDK. In this specific fungible token sample, we will not talk about the redeem method of the Token SDK because the redeem process will take the physical asset off the ledger and destroy the token. Thus, this sample will be a simple walk though of the creation, issuance, and transfer of the tokens.

Quick blog about TokenSDK see [here](https://medium.com/corda/introduction-to-token-sdk-in-corda-9b4dbcf71025)


## Concepts


### Flows

There are a few flows that enable this project.

We will create a resource (in this case a house), and then issue tokens for that resource, and then transfer those tokens.


We create the representation of a house, within `CreateHouseTokenFlow.java`.


```java
public SignedTransaction call() throws FlowException {
    // Obtain a reference to a notary we wish to use.
    final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0); // METHOD 1
    // final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB")); // METHOD 2

    //create token type
    FungibleHouseTokenState evolvableTokenType = new FungibleHouseTokenState(valuation, getOurIdentity(),
                    new UniqueIdentifier(), 0, this.symbol);

    //wrap it with transaction state specifying the notary
    TransactionState<FungibleHouseTokenState> transactionState = new TransactionState<>(evolvableTokenType, notary);

    //call built in sub flow CreateEvolvableTokens. This can be called via rpc or in unit testing
    return subFlow(new CreateEvolvableTokens(transactionState));
}
```

We issue tokens `IssueHouseTokenFlow`

```java
public SignedTransaction call() throws FlowException {
    //get house states on ledger with uuid as input tokenId
    StateAndRef<FungibleHouseTokenState> stateAndRef = getServiceHub().getVaultService().
            queryBy(FungibleHouseTokenState.class).getStates().stream()
            .filter(sf->sf.getState().getData().getSymbol().equals(symbol)).findAny()
            .orElseThrow(()-> new IllegalArgumentException("FungibleHouseTokenState symbol=\""+symbol+"\" not found from vault"));

    //get the RealEstateEvolvableTokenType object
    FungibleHouseTokenState evolvableTokenType = stateAndRef.getState().getData();

    //create fungible token for the house token type
    FungibleToken fungibleToken = new FungibleTokenBuilder()
            .ofTokenType(evolvableTokenType.toPointer(FungibleHouseTokenState.class)) // get the token pointer
            .issuedBy(getOurIdentity())
            .heldBy(holder)
            .withAmount(quantity)
            .buildFungibleToken();

    //use built in flow for issuing tokens on ledger
    return subFlow(new IssueTokens(ImmutableList.of(fungibleToken)));
}
```

We then move the house token. `MoveHouseTokenFlow`

```java
public SignedTransaction call() throws FlowException {
    //get house states on ledger with uuid as input tokenId
    StateAndRef<FungibleHouseTokenState> stateAndRef = getServiceHub().getVaultService().
    queryBy(FungibleHouseTokenState.class).getStates().stream()
    .filter(sf->sf.getState().getData().getSymbol().equals(symbol)).findAny()
    .orElseThrow(()-> new IllegalArgumentException("FungibleHouseTokenState symbol=\""+symbol+"\" not found from vault"));

    //get the RealEstateEvolvableTokenType object
    FungibleHouseTokenState tokenstate = stateAndRef.getState().getData();

    /*  specify how much amount to transfer to which holder
     *  Note: we use a pointer of tokenstate because it of type EvolvableTokenType
     */
    Amount<TokenType> amount = new Amount<>(quantity, tokenstate.toPointer(FungibleHouseTokenState.class));
    //PartyAndAmount partyAndAmount = new PartyAndAmount(holder, amount);

    //use built in flow to move fungible tokens to holder
    return subFlow(new MoveFungibleTokens(amount,holder));
}
```

## Pre-Requisites

For development environment setup, please refer to: [Setup Guide](https://docs.corda.net/getting-set-up.html).


## Usage

### Running the CorDapp

Open a terminal and go to the project root directory and type: (to deploy the nodes using bootstrapper)
```
./gradlew clean deployNodes
```
Then type: (to run the nodes)
```
./build/nodes/runnodes
```

### Working in node shell

### Create and Issue token



Create house on the ledger using Escrow's terminal

    flow start CreateHouseTokenFlow symbol: house, valuation: 100000

This will create a linear state of type HouseTokenState in Escrow's vault

Seller will now issue some tokens to Buyer. run below command via Escrow's terminal.

    flow start IssueHouseTokenFlow symbol: house, quantity: 50, holder: Sender

Now at Sender's terminal, we can check the tokens by running:
    flow start GetTokenBalance symbol: house


### HTLC Process
Init HTLC and fund token to escrow in Sender's terminal

    flow start HTLCFundFlow HTLCId: 1001, escrow: Escrow, receiver: Receiver, symbol: house, amount: 30, time: 3000, hash: 0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd

Withdraw HTLC from Escrow in Receiver's terminal

    flow start HTLCWithdrawFlow escrow: Escrow, HTLCId: 1001, secret: abracadabra

Refund HTLC from Escrow in Sender's terminal

    flow start HTLCRefundFlow escrow: Escrow, HTLCId: 1001


    #test for refund
    flow start HTLCFundFlow HTLCId: 1002, escrow: Escrow, receiver: Receiver, symbol: house, amount: 10, time: 10, hash: 0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd

    flow start HTLCRefundFlow escrow: Escrow, HTLCId: 1001