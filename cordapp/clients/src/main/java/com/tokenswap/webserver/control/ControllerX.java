package com.tokenswap.webserver.control;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;
import java.util.List;

import com.tokenswap.webserver.NodeRPCConnection;
import net.corda.core.messaging.CordaRPCOps;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CookieValue;

import javax.servlet.http.Cookie;

import com.tokenswap.flows.QueryTokens.GetTokenBalance;
import com.tokenswap.flows.HTLCFlow.HTLCFundFlow;
import com.tokenswap.flows.HTLCFlow.HTLCRefundFlow;
import com.tokenswap.flows.HTLCFlow.HTLCWithdrawFlow;

import net.corda.core.identity.Party;
import net.corda.client.rpc.CordaRPCClient;
import net.corda.client.rpc.CordaRPCConnection;
import net.corda.core.utilities.NetworkHostAndPort;
import net.corda.core.node.NodeInfo;


import javax.servlet.http.HttpServletResponse;

import net.corda.core.messaging.FlowHandle;

/**
 * Define your API endpoints here.
 */

@Controller
@RequestMapping("/") // The paths for HTTP requests are relative to this base path.
public class ControllerX {
/*    private final CordaRPCOps proxy;
    private final static Logger logger = LoggerFactory.getLogger(ControllerX.class); */

    private ConcurrentHashMap<UUID, CordaRPCOps> loginMap;

    private Party findParty(CordaRPCOps proxy, String name) {
      final List<NodeInfo> nodes = proxy.networkMapSnapshot();

      for (NodeInfo node:nodes) {
        Party party = node.getLegalIdentities().get(0);
        if (party.getName().getOrganisation().equals(name)) return party;
      }

      return null;
    }

    public ControllerX (NodeRPCConnection rpc) {
      loginMap = new ConcurrentHashMap<UUID, CordaRPCOps> ();
    }

    @PostMapping(value = "/login")
    @ResponseBody
    private HashMap<String, String> login(
        HttpServletResponse httpResponse,
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestParam(defaultValue = "") String address,
        @RequestParam(defaultValue = "") String user,
        @RequestParam(defaultValue = "") String password) {
      HashMap<String, String> response = new HashMap<String, String> ();

      if (!cordaUUID.equals("")) {
        response.put("status", "FAILED! Already logged in!");
        return response;
      }

      final NetworkHostAndPort nodeAddress = NetworkHostAndPort.parse(address);
      final CordaRPCClient client = new CordaRPCClient(nodeAddress);

      response.put("status", "SUCCESS");

      try {
        final CordaRPCConnection connection = client.start(user, password);
        final CordaRPCOps proxy = connection.getProxy();

        UUID loginUUID = UUID.randomUUID();
        loginMap.put(loginUUID, proxy);

        Cookie cookie = new Cookie("cordaUUID", loginUUID.toString());        
        cookie.setMaxAge(7 * 24 * 60 * 60); //expires in 7 days
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        httpResponse.addCookie(cookie);

        String nodeId = (String) (proxy.nodeInfo().getLegalIdentities().get(0).getName().toString());
        response.put("nodeId", nodeId);
      }
      catch (Exception e) {
        response.put("status", "FAILED");
      }

      return response;
    }

    @PostMapping(value = "/logout")
    @ResponseBody
    private HashMap<String, String> logout(
        HttpServletResponse httpResponse,
        @CookieValue(defaultValue = "") String cordaUUID) {
      HashMap<String, String> response = new HashMap<String, String> ();

      response.put("status", "SUCCESS");

      try {
        Cookie cookie = new Cookie("cordaUUID", "");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        httpResponse.addCookie(cookie);
      }
      catch (Exception e) {
        response.put("status", "FAILED");
      }

      if (cordaUUID != null) loginMap.remove(UUID.fromString(cordaUUID));

      return response;
    }

    @PostMapping(value = "/htlc_fund")
    @ResponseBody
    private HashMap<String, String> htlcFundResponse(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestParam(defaultValue = "") String htlc_id,
        @RequestParam(defaultValue = "") String escrow,
        @RequestParam(defaultValue = "") String receiver,
        @RequestParam(defaultValue = "") String symbol,
        @RequestParam(defaultValue = "") int amount,
        @RequestParam(defaultValue = "") int time,
        @RequestParam(defaultValue = "") String hash) {
      HashMap<String, String> response = new HashMap<String, String> ();

      if (cordaUUID.equals("")) {
        response.put("status", "FAILED! Not logged in");
        return response;
      }

      response.put("status", "SUCCESS");

      UUID uuid = UUID.fromString(cordaUUID);

      final CordaRPCOps proxy = loginMap.get(uuid);
      if (proxy==null) {
        response.put("status", "FAILED! Invalid login");
        return response;
      } 

      final List<NodeInfo> nodes = proxy.networkMapSnapshot();
      Party escrowParty = nodes.get(0).getLegalIdentities().get(0), receiverParty = escrowParty;

      boolean escrowFound = false, receiverFound = false;

      for (NodeInfo node:nodes) {
        Party party = node.getLegalIdentities().get(0);
        if (party.getName().getOrganisation().equals(escrow)) {
          escrowParty = party;
          escrowFound = true;
        }
        if (party.getName().getOrganisation().equals(receiver)) {
          receiverParty = party;
          receiverFound = true;
        }
      }

      if (!escrowFound) {
        response.put("status", "FAILED! Escrow not found");
        return response;
      }

      if (!receiverFound) {
        response.put("status", "FAILED! Receiver not found");
        return response;
      }

      FlowHandle handle = proxy.startFlowDynamic(
          HTLCFundFlow.class, htlc_id, escrowParty, receiverParty, symbol, amount, time, hash);

      return response;
    }

    @PostMapping(value = "/htlc_withdraw")
    @ResponseBody
    private HashMap<String, String> htlcWithdrawResponse(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestParam(defaultValue = "") String escrow,
        @RequestParam(defaultValue = "") String htlc_id,
        @RequestParam(defaultValue = "") String secret) {
      HashMap<String, String> response = new HashMap<String, String> ();

      if (cordaUUID.equals("")) {
        response.put("status", "FAILED! Not logged in");
        return response;
      }

      response.put("status", "SUCCESS");

      UUID uuid = UUID.fromString(cordaUUID);

      final CordaRPCOps proxy = loginMap.get(uuid);

      if (proxy==null) {
        response.put("status", "FAILED! Invalid login");
        return response;
      } 

/*      final List<NodeInfo> nodes = proxy.networkMapSnapshot();
      Party escrowParty = nodes.get(0).getLegalIdentities().get(0);

      for (NodeInfo node:nodes) {
        Party party = node.getLegalIdentities().get(0);
        if (party.getName().getOrganisation().equals(escrow)) escrowParty = party;
      } short version is the line below */

      final Party escrowParty = findParty(proxy, escrow);

      if (escrowParty == null) {
        response.put("status", "FAILED! Escrow not found");
        return response;
      }

      FlowHandle handle = proxy.startFlowDynamic(
          HTLCWithdrawFlow.class, escrowParty, htlc_id, secret);

      String s = "";

      try {
        s = (String) handle.getReturnValue().get();
      }
      catch (Exception e) {
        response.put("status", "FAILED! Exception occured");
      }

      if (!s.equals("Success") && !s.equals("success")) response.put("status", "FAILED! Flow error: " + s); 

      return response;
    }

    @PostMapping(value = "/htlc_refund")
    @ResponseBody
    private HashMap<String, String> htlcRefundResponse(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestParam(defaultValue = "") String escrow,
        @RequestParam(defaultValue = "") String htlc_id) {
      HashMap<String, String> response = new HashMap<String, String> ();

      if (cordaUUID.equals("")) {
        response.put("status", "FAILED! Not logged in");
        return response;
      }

      response.put("status", "SUCCESS");

      UUID uuid = UUID.fromString(cordaUUID);

      final CordaRPCOps proxy = loginMap.get(uuid);

      if (proxy==null) {
        response.put("status", "FAILED! Invalid login");
        return response;
      } 

      final Party escrowParty = findParty(proxy, escrow);

      if (escrowParty == null) {
        response.put("status", "FAILED! Escrow not found");
        return response;
      }

      FlowHandle handle = proxy.startFlowDynamic(
          HTLCRefundFlow.class, escrowParty, htlc_id);

      String s = "";

      try {
        s = (String) handle.getReturnValue().get();
      }
      catch (Exception e) {
        response.put("status", "FAILED! Exception occured");
      }

      if (!s.equals("Success") && !s.equals("success")) response.put("status", "FAILED! Flow error: " + s); 

      return response;
    }

    @GetMapping(value = "/balance")
    @ResponseBody
    private HashMap<String, String> balance(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestParam(defaultValue = "") String symbol) {

      HashMap<String, String> response = new HashMap<String, String> ();

      if (cordaUUID.equals("")) {
        response.put("status", "FAILED! Not logged in!");
        return response;
      }
        
      UUID uuid = UUID.fromString(cordaUUID);
      final CordaRPCOps proxy = loginMap.get(uuid);

      if (proxy==null) {
        response.put("status", "FAILED! Invalid login");
        return response;
      } 

      FlowHandle handle = proxy.startFlowDynamic(
        GetTokenBalance.class, symbol);

      String s = "";

      try {
        s = (String) handle.getReturnValue().get();
      }
      catch (Exception e) {
        response.put("status", "FAILED! Exception occured");
        return response;
      }

      response.put("status", "SUCCESS");
      response.put("result", s);

      return response;
    }
}
