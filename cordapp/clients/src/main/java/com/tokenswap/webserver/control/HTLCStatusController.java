package com.tokenswap.webserver.control;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenswap.webserver.APIResult;
import com.tokenswap.webserver.db.HTLCSecret;
import com.tokenswap.webserver.db.HTLCSecretRepository;
import com.tokenswap.webserver.db.HTLCStatus;
import com.tokenswap.webserver.db.HTLCStatusRepository;

import net.corda.core.messaging.CordaRPCOps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;


@RestController
//@CrossOrigin(origins="http://localhost:3000",allowCredentials="true")
@RequestMapping("/htlc")
public class HTLCStatusController {

    @Autowired
    private HTLCStatusRepository htlcStatusRepository;
    @Autowired
    private HTLCSecretRepository htlcSecretRepository;

    //update status
    @PostMapping(path = "/updatehtlc")
    public APIResult updateHTLCStatus(
            HttpServletRequest request,
            @RequestBody HashMap<String,String> requestdata){
            // @RequestParam Integer HTLCId,
            // @RequestParam String status,
            // @RequestParam String PartyName){
        String cordaUUID = request.getHeader("cordaUUID");
        Integer HTLCId = Integer.parseInt(requestdata.get("HTLCId"));
        String status = requestdata.get("status");
        String PartyName = requestdata.get("PartyName");
        String ethsmartcontractaddress = requestdata.get("EthContractAddress");
//         if (cordaUUID.equals("")) {
//             return APIResult.createEg("FAILED! Not logged in");
//         }
//         UUID uuid = UUID.fromString(cordaUUID);
//
//         final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
//         if (proxy==null) {
//             return APIResult.createEg("FAILED! Not logged in");
//         }
        Optional<HTLCStatus> result = htlcStatusRepository.findById(HTLCId);
        HTLCStatus htlcStatus = result.orElse(null);
        if(htlcStatus == null){
          return APIResult.createNg("No such HTLC recorde");
        }
        else {
            if(PartyName.equals(htlcStatus.getSendparty())){
                htlcStatus.setSendstatus(status);
            }
            else if(PartyName.equals(htlcStatus.getReceiveparty())){
                htlcStatus.setReceivestatus(status);
            }
            if("sendwithdraw".equals(htlcStatus.getSendstatus())&&"receivewithdraw".equals(htlcStatus.getReceivestatus())||
                    "sendrefund".equals(htlcStatus.getSendstatus())&&"receiverefund".equals(htlcStatus.getReceivestatus())){
                htlcStatus.setHtlcstatus("finished");
            }
            if(ethsmartcontractaddress!=null){
                htlcStatus.setEthsmartcontractaddress(ethsmartcontractaddress);
            }
            htlcStatusRepository.save(htlcStatus);
           return APIResult.createOKMessage("Update sucess");
        }
    }

    //gethtlc_list
    @PostMapping(path = "/currenthtlc")
    public APIResult currentHTLCStatusList(
            HttpServletRequest request,
            @RequestBody HashMap<String,String> requestdata) throws JsonProcessingException {
        String PartyName = requestdata.get("PartyName");
        String cordaUUID = request.getHeader("cordaUUID");
//         if (cordaUUID.equals("")) {
//             return APIResult.createEg("FAILED! Not logged in");
//         }
//         UUID uuid = UUID.fromString(cordaUUID);
//
//         final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
//         if (proxy==null) {
//             return APIResult.createEg("FAILED! Not logged in");
//         }
        List<HTLCStatus> htlclist = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        htlclist.addAll(htlcStatusRepository.findBySendpartyAndHtlcstatus(PartyName,"process"));
        htlclist.addAll(htlcStatusRepository.findByReceivepartyAndHtlcstatus(PartyName,"process"));
        return APIResult.createOk(mapper.writeValueAsString(htlclist));
    }

    //gethtlc_list
    @PostMapping(path = "/historyhtlc")
    public APIResult historyHTLCStatusList(
            HttpServletRequest request,
            @RequestBody HashMap<String,String> requestdata) throws JsonProcessingException {
        //
        String cordaUUID = request.getHeader("cordaUUID");
        String PartyName = requestdata.get("PartyName");
//         if (cordaUUID.equals("")) {
//             return APIResult.createEg("FAILED! Not logged in");
//         }
//         UUID uuid = UUID.fromString(cordaUUID);
//
//         final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
//         if (proxy==null) {
//             return APIResult.createEg("FAILED! Not logged in");
//         }
        List<HTLCStatus> htlclist = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        htlclist.addAll(htlcStatusRepository.findBySendpartyAndHtlcstatus(PartyName,"finished"));
        htlclist.addAll(htlcStatusRepository.findByReceivepartyAndHtlcstatus(PartyName,"finished"));
        return APIResult.createOk(mapper.writeValueAsString(htlclist));
    }
    //getone_htlc
    @PostMapping(path = "/gethtlc")
    public APIResult getHTLCStatus(
            HttpServletRequest request,
            @RequestBody HashMap<String,String> requestdata) throws JsonProcessingException {
        Integer HTLCId = Integer.parseInt(requestdata.get("HTLCId"));
        String cordaUUID = request.getHeader("cordaUUID");
        // if (cordaUUID.equals("")) {
        //     return APIResult.createEg("FAILED! Not logged in");
        // }
        // UUID uuid = UUID.fromString(cordaUUID);

        // final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
        // if (proxy==null) {
        //     return APIResult.createEg("FAILED! Not logged in");
        // }
        ObjectMapper mapper = new ObjectMapper();
        Optional<HTLCStatus> result = htlcStatusRepository.findById(HTLCId);
        HTLCStatus htlcStatus = result.orElse(null);
        if(htlcStatus == null){
            return APIResult.createNg("Not find HTLC");
        }
        else {
            return APIResult.createOk(mapper.writeValueAsString(htlcStatus));
        }
    }
    @PostMapping(path = "/getsecret")
    public APIResult getHTLCSecret(
            HttpServletRequest request,
            @RequestBody HashMap<String,String> requestdata) {
        String cordaUUID = request.getHeader("cordaUUID");
        Integer HTLCId = Integer.parseInt(requestdata.get("HTLCId"));
        String PartyName = requestdata.get("PartyName");
        // if (cordaUUID.equals("")) {
        //     return APIResult.createEg("FAILED! Not logged in");
        // }
        // UUID uuid = UUID.fromString(cordaUUID);

        // final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
        // if (proxy==null) {
        //     return APIResult.createEg("FAILED! Not logged in");
        // }
        HTLCSecret htlcSecret = htlcSecretRepository.findByInitpartyAndAndHtlcid(PartyName,HTLCId);
        if(htlcSecret!= null){
            return APIResult.createOk(htlcSecret.getSecret());
        }
        else {
            return APIResult.createEg("Not fund secret");
        }
    }
}
