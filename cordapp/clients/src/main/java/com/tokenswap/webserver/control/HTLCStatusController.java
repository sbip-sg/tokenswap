package com.tokenswap.webserver.control;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenswap.webserver.APIResult;
import com.tokenswap.webserver.db.HTLCStatus;
import com.tokenswap.webserver.db.HTLCStatusRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(path = "/htlc")
public class HTLCStatusController {

    @Autowired
    private HTLCStatusRepository htlcStatusRepository;

    @PostMapping(path = "/initswap")
    public APIResult initSwap(@RequestParam String SendParty,
                              @RequestParam String ReceiveParty,
                              @RequestParam String SendPartyAddress,
                              @RequestParam String ReceivePartyAddress,
                              @RequestParam String SendType,
                              @RequestParam String ReceiveType,
                              @RequestParam String SendValue,
                              @RequestParam String ReceiveValue,
                              @RequestParam String HTLCHash){
        HTLCStatus htlcStatus = new HTLCStatus();
        htlcStatus.setSendparty(SendParty);
        htlcStatus.setReceiveparty(ReceiveParty);
        htlcStatus.setSendpartyaddress(SendPartyAddress);
        htlcStatus.setReceivepartyaddress(ReceivePartyAddress);
        htlcStatus.setSendtype(SendType);
        htlcStatus.setReceivetype(ReceiveType);
        htlcStatus.setSendvalue(SendValue);
        htlcStatus.setReceivevalue(ReceiveValue);
        htlcStatus.setHtlchash(HTLCHash);
        htlcStatus.setHtlcstatus("process");
        htlcStatusRepository.save(htlcStatus);
        return APIResult.createOKMessage("Init Sucess");
    }
    //update status
    @PostMapping(path = "/updatehtlc")
    public APIResult updateHTLCStatus(@RequestParam Integer HTLCId, @RequestParam String status, @RequestParam String PartyName){
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
    public APIResult currentHTLCStatusList(@RequestParam String PartyName) throws JsonProcessingException {
      //
        List<HTLCStatus> htlclist = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        htlclist.addAll(htlcStatusRepository.findBySendpartyAndHtlcstatus(PartyName,"process"));
        htlclist.addAll(htlcStatusRepository.findByReceivepartyAndHtlcstatus(PartyName,"process"));
        return APIResult.createOk(mapper.writeValueAsString(htlclist));
    }

    //gethtlc_list
    @PostMapping(path = "/historyhtlc")
    public APIResult historyHTLCStatusList(@RequestParam String PartyName) throws JsonProcessingException {
        //
        List<HTLCStatus> htlclist = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        htlclist.addAll(htlcStatusRepository.findBySendpartyAndHtlcstatus(PartyName,"finished"));
        htlclist.addAll(htlcStatusRepository.findByReceivepartyAndHtlcstatus(PartyName,"finished"));
        return APIResult.createOk(mapper.writeValueAsString(htlclist));
    }
    //getone_htlc
    @PostMapping(path = "/gethtlc")
    public APIResult getHTLCStatus(@RequestParam Integer HTLCId) throws JsonProcessingException {
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
}
