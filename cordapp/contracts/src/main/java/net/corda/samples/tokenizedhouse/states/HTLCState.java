package net.corda.samples.tokenizedhouse.states;

import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.ContractState;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.samples.tokenizedhouse.contracts.HTLCContract;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.List;

@BelongsToContract(HTLCContract.class)
public class HTLCState implements ContractState {
    private String HTLCId;
    private Party sender;
    private Party receiver;
    private Party escrow;
    private int time;
    private String symbol;
    private int amount;
    private String hash;
    private String key;
    //TODO withdraw status
    private Boolean ifWithdrawOrRefund;

    public HTLCState(String HTLCId, Party sender, Party receiver, Party escrow, int time, String symbol, int amount, String hash){
           this.HTLCId = HTLCId;
           this.sender = sender;
           this.receiver = receiver;
           this.escrow = escrow;
           this.time = time;
           this.symbol = symbol;
           this.amount = amount;
           this.hash = hash;
    }

    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        return Arrays.asList(sender,receiver,escrow);
    }

    public Party getSender() {
        return sender;
    }

    public Party getReceiver() {
        return receiver;
    }

    public Party getEscrow() {
        return escrow;
    }

    public int getTime() {
        return time;
    }

    public int getAmount() {
        return amount;
    }

    public String getHash() {
        return hash;
    }

    public String getHTLCId() {
        return HTLCId;
    }

    public String getSymbol() {
        return symbol;
    }
}
