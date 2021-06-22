package com.tokenswap;

import net.corda.client.rpc.CordaRPCClient;
import net.corda.client.rpc.CordaRPCConnection;
import net.corda.core.messaging.CordaRPCOps;
import net.corda.core.utilities.NetworkHostAndPort;
import net.corda.core.node.NodeInfo;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.node.services.Vault;
import net.corda.core.contracts.ContractState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tokenswap.flows.RealEstateEvolvableFungibleTokenFlow.CreateHouseTokenFlow;
import com.tokenswap.flows.QueryTokens.GetTokenBalance;

import net.corda.core.CordaRuntimeException;
import net.corda.core.messaging.FlowHandle;
import net.corda.core.concurrent.CordaFuture;
import net.corda.core.transactions.SignedTransaction;

import java.util.List;

public class TestConnect {
    private static final Logger logger = LoggerFactory.getLogger(TestConnect.class);

    public static void main(String[] args) {
/*        if (args.length != 3) {
            throw new IllegalArgumentException("Usage: TemplateClient <node address> <username> <password>");
        }
        final NetworkHostAndPort nodeAddress = NetworkHostAndPort.parse(args[0]);
        String username = args[1];
        String password = args[2]; */

      final NetworkHostAndPort nodeAddress = NetworkHostAndPort.parse("localhost:10009");
      String username = "user1";
      String password = "test";

      final CordaRPCClient client = new CordaRPCClient(nodeAddress);
      final CordaRPCConnection connection = client.start(username, password);
      final CordaRPCOps operations = connection.getProxy();

      List<NodeInfo> nodes = operations.networkMapSnapshot();
      System.out.println("\n-- networkMap snapshot --");
      logger.info("{}", nodes);

      System.out.println("\n-- current time --");
      logger.info(operations.currentNodeTime().toString());

      CordaX500Name name = operations.nodeInfo().getLegalIdentities().get(0).getName();
      System.out.println("\n-- node info --");
      logger.info("{}", name);

      Vault.Page<ContractState> q = operations.vaultQuery(ContractState.class);

      try {
        operations.startFlowDynamic(CreateHouseTokenFlow.class, "table", 10000);
      }
      catch (CordaRuntimeException e) {
        System.out.println("Hello! \n" + e.getMessage());
      }

      FlowHandle handle = operations.startFlowDynamic(
        GetTokenBalance.class, "table");

      try {
        String s = (String) handle.getReturnValue().get();
        System.out.println(s);
      }
      catch (Exception e) {
        System.out.println("Exception occurred: " + e.getMessage());
      }

      connection.notifyServerAndClose();

      System.out.println("Hello, world!");
    }
}
