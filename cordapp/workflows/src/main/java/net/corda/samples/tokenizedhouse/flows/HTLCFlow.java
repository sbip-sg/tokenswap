package net.corda.samples.tokenizedhouse.flows;

import co.paralleluniverse.fibers.Suspendable;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.ProgressTracker;
import net.corda.samples.tokenizedhouse.contracts.HTLCContract;
import net.corda.samples.tokenizedhouse.states.HTLCState;
import org.jetbrains.annotations.NotNull;

import java.security.PublicKey;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;


import static java.util.Collections.singletonList;

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
            List<PublicKey> requireSingers = Arrays.asList(getOurIdentity().getOwningKey(),escrow.getOwningKey());
            txBuilder.addCommand(command,requireSingers);

            //verify transaction is valid
            txBuilder.verify(getServiceHub());

            //creat session
            FlowSession session = initiateFlow(escrow);

            //sign transaction
            SignedTransaction signedTransaction = getServiceHub().signInitialTransaction(txBuilder);

            //escrow sign transaction
            SignedTransaction fullSignedTransaction = subFlow(new CollectSignaturesFlow(signedTransaction, singletonList(session)));


            return subFlow(new FinalityFlow(fullSignedTransaction,singletonList(session)));
        }
    }

    @InitiatedBy(HTLCFundFlow.class)
    public static class HTLCFundFlowResponder extends FlowLogic<Void>{

        private final FlowSession counterParty;

        public HTLCFundFlowResponder(FlowSession counterParty) {
            this.counterParty = counterParty;
        }

        @Override
        @Suspendable
        public Void call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterParty) {
                @Override
                protected void checkTransaction(@NotNull SignedTransaction stx) throws FlowException {

                }
            });
            subFlow(new ReceiveFinalityFlow(counterParty,signedTransaction.getId()));
            return null;
        }
    }

    //HTLCWithdrawFlow
    //check secrect key and store in
//    public static class HTLCWithdrawFlow extends FlowLogic<SignedTransaction>{
//
//        @Override
//        public SignedTransaction call() throws FlowException {
//            return null;
//        }
//    }

    // responder


    //HTLCRefundFlow
//    public static class HTLCRefundFlow extends FlowLogic<SignedTransaction>{
//        @Override
//        public SignedTransaction call() throws FlowException {
//            return null;
//        }
//    }

    //need responder?



}
