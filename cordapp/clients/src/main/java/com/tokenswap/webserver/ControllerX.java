package com.tokenswap.webserver;

import net.corda.core.messaging.CordaRPCOps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tokenswap.flows.RealEstateEvolvableFungibleTokenFlow.CreateHouseTokenFlow;
import com.tokenswap.flows.QueryTokens.GetTokenBalance;

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

import net.corda.core.messaging.FlowHandle;

/**
 * Define your API endpoints here.
 */
/*@RestController
@RequestMapping("/") // The paths for HTTP requests are relative to this base path.
public class ControllerX {
    private final CordaRPCOps proxy;
    private final static Logger logger = LoggerFactory.getLogger(ControllerX.class);

    public ControllerX (NodeRPCConnection rpc) {
        this.proxy = rpc.proxy;
    }

    @GetMapping(value = "/identity", produces = "text/html")
    private String templateendpoint() {
        return "My node is: " + proxy.nodeInfo().getLegalIdentities().get(0).getName();
    }
} */

@RestController
@RequestMapping("/") // The paths for HTTP requests are relative to this base path.
public class ControllerX {
/*    private final CordaRPCOps proxy;
    private final static Logger logger = LoggerFactory.getLogger(ControllerX.class); */

    public ControllerX (NodeRPCConnection rpc) {
    }

    @GetMapping(value = "/dologin", produces = "text/html")
    private String dologin(
        @RequestParam(value = "addr", defaultValue = "") String addr,
        @RequestParam(value = "user", defaultValue = "") String user,
        @RequestParam(value = "password", defaultValue = "") String password
        ) {
      final NetworkHostAndPort nodeAddress = NetworkHostAndPort.parse(addr);

      final CordaRPCClient client = new CordaRPCClient(nodeAddress);
      final CordaRPCConnection connection = client.start(user, password);
      final CordaRPCOps proxy = connection.getProxy();

      FlowHandle handle = proxy.startFlowDynamic(
        GetTokenBalance.class, "house");

      String s = "";

      try {
        s = (String) handle.getReturnValue().get();
      }
      catch (Exception e) {
        System.out.println("Exception occurred: " + e.getMessage());
      }

      return "Your node info: " + proxy.nodeInfo().getLegalIdentities().get(0).getName()
        + "<br>Your balance: " + s;
    }
}
