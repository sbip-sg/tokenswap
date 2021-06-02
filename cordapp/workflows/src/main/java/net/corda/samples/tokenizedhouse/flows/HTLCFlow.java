package net.corda.samples.tokenizedhouse.flows;

import co.paralleluniverse.fibers.Suspendable;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.ProgressTracker;
import net.corda.core.utilities.UntrustworthyData;
import net.corda.samples.tokenizedhouse.contracts.HTLCContract;
import net.corda.samples.tokenizedhouse.states.HTLCState;
import org.bouncycastle.jcajce.provider.digest.Keccak;
import org.bouncycastle.util.encoders.Hex;


import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.time.Instant;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;

public class HTLCFlow {
    //HTLCFundFlow
    //Creat HTLC, transfer token to escrow node and set time lock
    @InitiatingFlow
    @StartableByRPC
    public static class HTLCFundFlow extends FlowLogic<SignedTransaction>{
        private String HTLCId;
        private Party escrow;
        private Party receiver;
        private int timeout;
        private String symbol;
        private int amount;
        private String hash;

        //progresstracker
        private final ProgressTracker progressTracker = new ProgressTracker();

        public HTLCFundFlow(String HTLCId, Party escrow, Party receiver, String symbol, int amount, int time, String hash){
            this.HTLCId = HTLCId;
            this.escrow = escrow;
            this.receiver = receiver;
            this.symbol = symbol;
            this.amount = amount;
            this.timeout = (int) (Instant.now().getEpochSecond() + time);
            this.hash = hash;
        }
        @Override
        public ProgressTracker getProgressTracker() {
            return progressTracker;
        }

        @Suspendable
        @Override
        public SignedTransaction call() throws FlowException {
            //notary
            Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

            //create transaction components
            HTLCState outputState = new HTLCState(HTLCId, getOurIdentity(), receiver, escrow, timeout, symbol, amount, hash);
            HTLCContract.Commands.Fund command = new HTLCContract.Commands.Fund();
            //transfer token to escrow
            subFlow(new RealEstateEvolvableFungibleTokenFlow.MoveHouseTokenFlow(symbol,escrow,amount));
            //transaction builder
            TransactionBuilder txBuilder = new TransactionBuilder();
            txBuilder.setNotary(notary);
            txBuilder.addOutputState(outputState, HTLCContract.ID);
            List<PublicKey> requireSingers = Arrays.asList(getOurIdentity().getOwningKey(),escrow.getOwningKey(),receiver.getOwningKey());
            txBuilder.addCommand(command,requireSingers);

            //verify transaction is valid
            txBuilder.verify(getServiceHub());

            //creat sessions to escrow and recevier
            FlowSession session = initiateFlow(escrow);
            FlowSession session1 = initiateFlow(receiver);

            //sign transaction
            SignedTransaction signedTransaction = getServiceHub().signInitialTransaction(txBuilder);

            //escrow sign transaction
            SignedTransaction fullSignedTransaction = subFlow(new CollectSignaturesFlow(signedTransaction, Arrays.asList(session,session1)));


            return subFlow(new FinalityFlow(fullSignedTransaction,Arrays.asList(session,session1)));
        }
    }

    @InitiatedBy(HTLCFundFlow.class)
    public static class HTLCFundFlowResponder extends FlowLogic<SignedTransaction>{

        private final FlowSession counterParty;

        public HTLCFundFlowResponder(FlowSession counterParty) {
            this.counterParty = counterParty;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterParty) {
                @Override
                protected void checkTransaction( SignedTransaction stx) throws FlowException {

                }
            });
            return subFlow(new ReceiveFinalityFlow(counterParty,signedTransaction.getId()));

        }
    }

    //HTLCWithdrawFlow
    //check secrect key and store in
    //a ping-pong example
    @InitiatingFlow
    @StartableByRPC
    public static class HTLCWithdrawFlow extends FlowLogic<String> {

        private final Party escrow;
        private final String HTLCId;
        private final String secret;

        public HTLCWithdrawFlow(Party escrow, String HTLCId, String secret) {
            this.escrow = escrow;
            this.HTLCId = HTLCId;
            this.secret = secret;
        }

        @Suspendable
        @Override
        public String call() throws FlowException {
            FlowSession escrowSession = initiateFlow(escrow);
            LinkedHashMap<String,String> payload = new LinkedHashMap<>();
            payload.put("HTLCId",HTLCId);
            payload.put("secret",secret);
            UntrustworthyData<String> resultData = escrowSession.sendAndReceive(String.class,payload);
            String result = resultData.unwrap(data -> {
                return data;
            });
            return result;

        }
    }

    // responder


    //HTLCWithdrawFlowResponder
    @InitiatedBy(HTLCWithdrawFlow.class)
    public static class HTLCWithdrawFlowResponder extends FlowLogic<SignedTransaction>{

        private final FlowSession receiverSession;

        public HTLCWithdrawFlowResponder(FlowSession receiverSession) {
            this.receiverSession = receiverSession;
        }

        @Suspendable
        @Override
        public SignedTransaction call() throws FlowException {
            UntrustworthyData<LinkedHashMap> payload =  receiverSession.receive(LinkedHashMap.class);
            LinkedHashMap<String,String> data = payload.unwrap(data1 -> {
                return data1;
            });
            String HTLCId = data.get("HTLCId");
            String secret = data.get("secret");
            System.out.println("htlcid"+HTLCId);
            // get HTLC state of HTLCId
            StateAndRef<HTLCState> stateAndRef = getServiceHub().getVaultService().queryBy(HTLCState.class).
                    getStates().stream().filter(sf->sf.getState().getData().getHTLCId().equals(HTLCId)).findAny()
                    .orElseThrow(()->new IllegalArgumentException("HTCL state is not exist"));
            HTLCState htlcState = stateAndRef.getState().getData();
            int time = htlcState.getTime();
            System.out.println("time"+time);
            int currentTime = (int) Instant.now().getEpochSecond();
            Party receiveHTLC = htlcState.getReceiver();
            if(!receiverSession.getCounterparty().equals(receiveHTLC)){
                receiverSession.send("error:Withdraw can only invoke by receiver");
                throw new FlowException("Withdraw can only invoke by receiver");
            }
            if(currentTime>time){
                receiverSession.send("error:Timeout");
                throw new FlowException("Timeout");
            }
            String hash = htlcState.getHash();
            if(hash.equals(HTLCFlow.getHash(secret))){
                String symbol = htlcState.getSymbol();
                int amount = htlcState.getAmount();
                receiverSession.send("Success");
                return subFlow(new RealEstateEvolvableFungibleTokenFlow.MoveHouseTokenFlow(symbol,receiverSession.getCounterparty(),amount));
            }
            else {
                receiverSession.send("error:Uncorrect secrect");
                throw new FlowException("Uncorrect secrect");
            }
        }
    }


    //HTLCRefundFlow
    @InitiatingFlow
    @StartableByRPC
    public static class HTLCRefundFlow extends FlowLogic<String>{

        private final Party escrow;
        private final String HTLCId;

        public HTLCRefundFlow(Party escrow, String HTLCId) {
            this.escrow = escrow;
            this.HTLCId = HTLCId;
        }

        @Suspendable
        @Override
        public String call() throws FlowException {
            FlowSession escrowSession = initiateFlow(escrow);
            UntrustworthyData<String> resultData = escrowSession.sendAndReceive(String.class,HTLCId);

            String result = resultData.unwrap(data -> {
               return data;
            });
            return result;
        }
    }

    //HTLCRefundFlowResponder
    @InitiatedBy(HTLCRefundFlow.class)
    public static class HTLCRefundFlowResponder extends FlowLogic<SignedTransaction>{

        private final FlowSession senderSession;

        public HTLCRefundFlowResponder(FlowSession senderSession) {
            this.senderSession = senderSession;
        }

        @Suspendable
        @Override
        public SignedTransaction call() throws FlowException {
            UntrustworthyData<String> payload = senderSession.receive(String.class);
            String HTLCId = payload.unwrap(data -> {
                return data;
            });
             StateAndRef<HTLCState> stateAndRef = getServiceHub().getVaultService().queryBy(HTLCState.class).
                     getStates().stream().filter(sf->sf.getState().getData().getHTLCId().equals(HTLCId)).findAny()
                     .orElseThrow(()->new IllegalArgumentException("HTCL state is not exist"));
             HTLCState htlcState = stateAndRef.getState().getData();
             Party senderHTLC = htlcState.getSender();
             int time = htlcState.getTime();
             int currentTime = (int) Instant.now().getEpochSecond();

             if(!senderSession.getCounterparty().equals(senderHTLC)){
                 senderSession.send("error: Withdraw can only invoke by sender");
                 throw new FlowException("Withdraw can only invoke by sender");
             }
             if(currentTime<=time){
                 senderSession.send("error: It is not time to refund");
                 throw new FlowException("It is not time to refund");
             }
             String symbol = htlcState.getSymbol();
             int amount = htlcState.getAmount();
             senderSession.send("success");
             return subFlow(new RealEstateEvolvableFungibleTokenFlow.MoveHouseTokenFlow(symbol,senderSession.getCounterparty(),amount));
        }
    }


    //utils
    public static String getHash(String secret){
        Keccak.Digest256 digest256 = new Keccak.Digest256();
        byte[] hashbytes = digest256.digest(
                secret.getBytes(StandardCharsets.UTF_8));
        return "0x" + new String(Hex.encode(hashbytes));
    }
}
