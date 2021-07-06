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

import java.util.*;


@RestController
@RequestMapping(path = "/htlc")
public class HTLCStatusController {

    @Autowired
    private HTLCStatusRepository htlcStatusRepository;
    @Autowired
    private HTLCSecretRepository htlcSecretRepository;

    //update status
    @PostMapping(path = "/updatehtlc")
    public APIResult updateHTLCStatus(
            @CookieValue(defaultValue = "") String cordaUUID,
            @RequestParam Integer HTLCId,
            @RequestParam String status,
            @RequestParam String PartyName){
        if (cordaUUID.equals("")) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        UUID uuid = UUID.fromString(cordaUUID);

        final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
        if (proxy==null) {
            return APIResult.createEg("FAILED! Not logged in");
        }
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
            if("withdraw".equals(htlcStatus.getSendstatus())&&"withdraw".equals(htlcStatus.getReceivestatus())||
                    "refund".equals(htlcStatus.getSendstatus())&&"refund".equals(htlcStatus.getReceivestatus())){
                htlcStatus.setHtlcstatus("finished");
            }
            htlcStatusRepository.save(htlcStatus);
           return APIResult.createOKMessage("Update sucess");
        }
    }

    //gethtlc_list
    @PostMapping(path = "/currenthtlc")
    public APIResult currentHTLCStatusList(
            @CookieValue(defaultValue = "") String cordaUUID,
            @RequestParam String PartyName) throws JsonProcessingException {
        if (cordaUUID.equals("")) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        UUID uuid = UUID.fromString(cordaUUID);

        final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
        if (proxy==null) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        List<HTLCStatus> htlclist = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        htlclist.addAll(htlcStatusRepository.findBySendpartyAndHtlcstatus(PartyName,"process"));
        htlclist.addAll(htlcStatusRepository.findByReceivepartyAndHtlcstatus(PartyName,"process"));
        return APIResult.createOk(mapper.writeValueAsString(htlclist));
    }

    //gethtlc_list
    @PostMapping(path = "/historyhtlc")
    public APIResult historyHTLCStatusList(
            @CookieValue(defaultValue = "") String cordaUUID,
            @RequestParam String PartyName) throws JsonProcessingException {
        //
        if (cordaUUID.equals("")) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        UUID uuid = UUID.fromString(cordaUUID);

        final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
        if (proxy==null) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        List<HTLCStatus> htlclist = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        htlclist.addAll(htlcStatusRepository.findBySendpartyAndHtlcstatus(PartyName,"finished"));
        htlclist.addAll(htlcStatusRepository.findByReceivepartyAndHtlcstatus(PartyName,"finished"));
        return APIResult.createOk(mapper.writeValueAsString(htlclist));
    }
    //getone_htlc
    @PostMapping(path = "/gethtlc")
    public APIResult getHTLCStatus(
            @CookieValue(defaultValue = "") String cordaUUID,
            @RequestParam Integer HTLCId) throws JsonProcessingException {
        if (cordaUUID.equals("")) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        UUID uuid = UUID.fromString(cordaUUID);

        final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
        if (proxy==null) {
            return APIResult.createEg("FAILED! Not logged in");
        }
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
            @CookieValue(defaultValue = "") String cordaUUID,
            @RequestParam Integer HTLCId, @RequestParam String PartyName){
        if (cordaUUID.equals("")) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        UUID uuid = UUID.fromString(cordaUUID);

        final CordaRPCOps proxy = CordaController.loginMap.get(uuid);
        if (proxy==null) {
            return APIResult.createEg("FAILED! Not logged in");
        }
        HTLCSecret htlcSecret = htlcSecretRepository.findByInitpartyAndAndHtlcid(PartyName,HTLCId);
        if(htlcSecret!= null){
            return APIResult.createOk(htlcSecret.getSecret());
        }
        else {
            return APIResult.createEg("Not fund secret");
        }
    }
}
