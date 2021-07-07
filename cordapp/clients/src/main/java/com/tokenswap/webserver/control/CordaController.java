package com.tokenswap.webserver.control;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;
import java.util.List;

import com.tokenswap.webserver.APIResult;
import com.tokenswap.webserver.NodeRPCConnection;
import com.tokenswap.webserver.db.HTLCSecret;
import com.tokenswap.webserver.db.HTLCSecretRepository;
import com.tokenswap.webserver.db.HTLCStatus;
import com.tokenswap.webserver.db.HTLCStatusRepository;
import net.corda.core.messaging.CordaRPCOps;
import org.bouncycastle.jcajce.provider.digest.Keccak;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

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

@RestController
@CrossOrigin
@RequestMapping("/corda") // The paths for HTTP requests are relative to this base path.
public class CordaController {
/*    private final CordaRPCOps proxy;
    private final static Logger logger = LoggerFactory.getLogger(ControllerX.class); */

    public static ConcurrentHashMap<UUID, CordaRPCOps> loginMap;
    @Autowired
    private HTLCStatusRepository htlcStatusRepository;
    @Autowired
    private HTLCSecretRepository htlcSecretRepository;
    private  final String EscrowParty = "Escrow";


    private Party findParty(CordaRPCOps proxy, String name) {
      final List<NodeInfo> nodes = proxy.networkMapSnapshot();

      for (NodeInfo node:nodes) {
        Party party = node.getLegalIdentities().get(0);
        if (party.getName().getOrganisation().equals(name)) return party;
      }

      return null;
    }

    public CordaController(NodeRPCConnection rpc) {
      loginMap = new ConcurrentHashMap<UUID, CordaRPCOps> ();
    }

    @PostMapping(value = "/login")

    public APIResult login(
        HttpServletResponse httpResponse,
        @CookieValue(defaultValue = "") String cordaUUID,
          @RequestBody HashMap<String,String> requestdata){
      String address = requestdata.get("address");
      String user = requestdata.get("username");
      String password = requestdata.get("password");

      //Already logged
      if (!cordaUUID.equals("")) {
        return APIResult.createEg("FAILED! Already logged in!");
      }

      final NetworkHostAndPort nodeAddress = NetworkHostAndPort.parse(address);
      final CordaRPCClient client = new CordaRPCClient(nodeAddress);

      String result;

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
        result = nodeId;
      }
      catch (Exception e) {
        return APIResult.createEg("Login failed!");
      }
      return APIResult.createOk(result);
    }

    @PostMapping(value = "/logout")
    public APIResult logout(
        HttpServletResponse httpResponse,
        @CookieValue(defaultValue = "") String cordaUUID) {

      try {
        Cookie cookie = new Cookie("cordaUUID", "");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        httpResponse.addCookie(cookie);
      }
      catch (Exception e) {
        return APIResult.createEg("Failed");
      }

      if (cordaUUID != null) loginMap.remove(UUID.fromString(cordaUUID));

      return APIResult.createOKMessage("Logout success");
    }

    @PostMapping(value = "/initswap")
    public APIResult htlcFundResponse(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestBody HashMap<String,String> requestdata){
      HashMap<String, String> response = new HashMap<String, String> ();

      String SendParty = requestdata.get("SendParty");
      String ReceiveParty = requestdata.get("ReceiveParty");
      String SendPartyAddress = requestdata.get("SendPartyAddress");
      String ReceivePartyAddress = requestdata.get("ReceivePartyAddress");
      String SendType = requestdata.get("SendType");
      String ReceiveType = requestdata.get("ReceiveType");
      int SendValue =  Integer.valueOf(requestdata.get("SendValue"));
      String ReceiveValue = requestdata.get("ReceiveValue");
      String Secret = requestdata.get("Secret");
      int Timeoutnum = Integer.valueOf(requestdata.get("Timeoutnum"));


      if (cordaUUID.equals("")) {
        return APIResult.createEg("FAILED! Not logged in");
      }

      response.put("status", "SUCCESS");

      UUID uuid = UUID.fromString(cordaUUID);

      final CordaRPCOps proxy = loginMap.get(uuid);
      if (proxy==null) {
        response.put("status", "FAILED! Invalid login");
        return APIResult.createEg("FAILED! Not logged in");
      } 

      final List<NodeInfo> nodes = proxy.networkMapSnapshot();
      Party escrowParty = nodes.get(0).getLegalIdentities().get(0), receiverParty = escrowParty;

      boolean escrowFound = false, receiverFound = false;

      for (NodeInfo node:nodes) {
        Party party = node.getLegalIdentities().get(0);
        if (party.getName().getOrganisation().equals(EscrowParty)) {
          escrowParty = party;
          escrowFound = true;
        }
        if (party.getName().getOrganisation().equals(ReceiveParty)) {
          receiverParty = party;
          receiverFound = true;
        }
      }

      if (!escrowFound) {
        return APIResult.createEg("FAILED! Escrow not found");
      }

      if (!receiverFound) {
        return APIResult.createEg("FAILED! Receiver not found");
      }
      String HTLCHash = getHash(Secret);
      HTLCStatus htlcStatus = new HTLCStatus();
      htlcStatus.setSendparty(SendParty);
      htlcStatus.setReceiveparty(ReceiveParty);
      htlcStatus.setSendpartyaddress(SendPartyAddress);
      htlcStatus.setReceivepartyaddress(ReceivePartyAddress);
      htlcStatus.setSendtype(SendType);
      htlcStatus.setReceivetype(ReceiveType);
      htlcStatus.setSendvalue(String.valueOf(SendValue));
      htlcStatus.setReceivevalue(ReceiveValue);
      htlcStatus.setSendtimeout(String.valueOf(Timeoutnum));

      htlcStatus.setHtlchash(HTLCHash);
      htlcStatus.setHtlcstatus("init");
      htlcStatus = htlcStatusRepository.save(htlcStatus);
      Integer htlc_id = htlcStatus.getHtlcid();
      HTLCSecret htlcSecret = new HTLCSecret();
      htlcSecret.setHtlchash(HTLCHash);
      htlcSecret.setHtlcid(htlc_id);
      htlcSecret.setSecret(Secret);
      htlcSecret.setInitparty(SendParty);
      //detect flow runing status
      //banlance> sendvalue
      FlowHandle handle = proxy.startFlowDynamic(
              GetTokenBalance.class, SendType);

      float s;

      try {
        s = Float.parseFloat((String) handle.getReturnValue().get());
      }
      catch (Exception e) {
        System.out.println(e);
        return APIResult.createEg("Don't hold any "+SendType +" token");
      }
      if(s<(float)(SendValue)){
        return APIResult.createEg("Don't have much balance to transfer");

      }
      FlowHandle handle1 = proxy.startFlowDynamic(
          HTLCFundFlow.class, htlc_id.toString(), escrowParty, receiverParty, SendType, SendValue, Timeoutnum, HTLCHash);
      htlcStatus.setHtlcstatus("process");
      htlcStatusRepository.save(htlcStatus);
      htlcSecretRepository.save(htlcSecret);
      return APIResult.createOKMessage("init success");
    }

    @PostMapping(value = "/htlc_withdraw")
    private APIResult htlcWithdrawResponse(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestBody HashMap<String,String> requestdata){
      
      Integer HTLCId = Integer.valueOf(requestdata.get("HTLCId"));
      String Secret = requestdata.get("Secret");
      if (cordaUUID.equals("")) {
        return APIResult.createEg("FAILED! Not logged in");
      }


      UUID uuid = UUID.fromString(cordaUUID);

      final CordaRPCOps proxy = loginMap.get(uuid);

      if (proxy==null) {
        return APIResult.createEg("FAILED! Invalid login");
      } 


      final Party escrowParty = findParty(proxy, EscrowParty);

      if (escrowParty == null) {
        return APIResult.createEg("FAILED! Escrow not found");
      }

      FlowHandle handle = proxy.startFlowDynamic(
          HTLCWithdrawFlow.class, escrowParty, HTLCId.toString(), Secret);

      String s = "";

      try {
        s = (String) handle.getReturnValue().get();
      }
      catch (Exception e) {
        return APIResult.createEg("FAILED! Exception occured");
      }

      if (!s.equals("Success") && !s.equals("success"))
        return APIResult.createEg("FAILED! Flow error: " + s);
      else {
        HTLCStatus htlcStatus = htlcStatusRepository.findById(HTLCId).orElse(null);
        htlcStatus.setReceivestatus("withdraw");
        if("withdraw".equals(htlcStatus.getSendstatus())) {
          htlcStatus.setHtlcstatus("finished");
        }
        htlcStatusRepository.save(htlcStatus);

        return APIResult.createOKMessage("Withdraw success");
      }
    }

    @PostMapping(value = "/htlc_refund")
    private APIResult htlcRefundResponse(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestBody HashMap<String,String> requestdata){
      HashMap<String, String> response = new HashMap<String, String> ();
      
      Integer HTLCId = Integer.valueOf(requestdata.get("HTLCId"));
      if (cordaUUID.equals("")) {
        return APIResult.createEg("FAILED! Not logged in");
      }


      UUID uuid = UUID.fromString(cordaUUID);

      final CordaRPCOps proxy = loginMap.get(uuid);

      if (proxy==null) {
        return APIResult.createEg("FAILED! Invalid login");
      } 

      final Party escrowParty = findParty(proxy, EscrowParty);

      if (escrowParty == null) {
        return APIResult.createEg("FAILED! Escrow not found");
      }

      FlowHandle handle = proxy.startFlowDynamic(
          HTLCRefundFlow.class, escrowParty, HTLCId.toString());

      String s = "";

      try {
        s = (String) handle.getReturnValue().get();
      }
      catch (Exception e) {
        return APIResult.createEg("FAILED! Exception occured");
      }

      if (!s.equals("Success") && !s.equals("success"))
        return APIResult.createEg( "FAILED! Flow error: " + s);
      else {
        HTLCStatus htlcStatus = htlcStatusRepository.findById(HTLCId).orElse(null);
        htlcStatus.setSendstatus("refund");
        if("refund".equals(htlcStatus.getReceivestatus())) {
          htlcStatus.setHtlcstatus("finished");
        }
        htlcStatusRepository.save(htlcStatus);

        return APIResult.createOKMessage("Refund success");
      }
    }

    @PostMapping(value = "/balance")
    private APIResult balance(
        @CookieValue(defaultValue = "") String cordaUUID,
        @RequestBody HashMap<String,String> requestdata){
        // @RequestParam(defaultValue = "") String symbol) {
      String symbol = requestdata.get("symbol");

      if (cordaUUID.equals("")) {
        return APIResult.createEg("FAILED! Not logged in");
      }
        
      UUID uuid = UUID.fromString(cordaUUID);
      final CordaRPCOps proxy = loginMap.get(uuid);

      if (proxy==null) {
        return APIResult.createEg("FAILED! Invalid login");
      } 

      FlowHandle handle = proxy.startFlowDynamic(
        GetTokenBalance.class, symbol);

      String s = "";

      try {
        s = (String) handle.getReturnValue().get();
      }
      catch (Exception e) {
        return APIResult.createEg("FAILED! Exception occured");
      }

      return APIResult.createOk("{\"balance\":\""+s+"\"}");
    }

  public static String getHash(String secret){
    Keccak.Digest256 digest256 = new Keccak.Digest256();
    byte[] hashbytes = digest256.digest(
            secret.getBytes(StandardCharsets.UTF_8));
    return "0x" + new String(Hex.encode(hashbytes));
  }
}
