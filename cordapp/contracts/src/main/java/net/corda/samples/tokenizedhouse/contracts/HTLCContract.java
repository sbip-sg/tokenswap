package net.corda.samples.tokenizedhouse.contracts;

import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

public class HTLCContract implements Contract {
    public static String ID = "net.corda.samples.tokenizedhouse.contracts.HTLCContract";

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {


    }

    public interface Commands extends CommandData{
        class Fund implements Commands{}
    }

}
