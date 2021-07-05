package com.tokenswap.webserver.control;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tokenswap.webserver.db.HTLCStatus;
import com.tokenswap.webserver.db.HTLCStatusRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@Controller
@RequestMapping(path = "/htlc")
public class HTLCStatusController {

    @Autowired
    private HTLCStatusRepository htlcStatusRepository;

    @PostMapping(path = "/initswap")
    public @ResponseBody
    HashMap<String, String> initSwap(@RequestParam String SendParty,
                                     @RequestParam String ReceiveParty,
                                     @RequestParam String SendPartyAddress,
                                     @RequestParam String ReceivePartyAddress,
                                     @RequestParam String SendType,
                                     @RequestParam String ReceiveType,
                                     @RequestParam String SendValue,
                                     @RequestParam String ReceiveValue,
                                     @RequestParam String HTLCHash){
        HashMap<String, String> response = new HashMap<String, String> ();

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
        response.put("status", "SUCCESS");
        return response;

    }
    //update status
    @PostMapping(path = "/updatehtlc")
    public @ResponseBody
    HashMap<String, String> updateHTLCStatus(@RequestParam Integer HTLCId, @RequestParam String status, @RequestParam String PartyName){
        HashMap<String,String> response = new HashMap<>();
        Optional<HTLCStatus> result = htlcStatusRepository.findById(HTLCId);
        HTLCStatus htlcStatus = result.orElse(null);
        if(htlcStatus == null){
            response.put("status","Failed, not find htlc");
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
            response.put("status","Success");
        }
        return response;
    }

    //gethtlc_list
    @PostMapping(path = "/currenthtlc")
    public @ResponseBody
   HashMap<String, String> currentHTLCStatusList(@RequestParam String PartyName) throws JsonProcessingException {
      //
        List<HTLCStatus> htlclist = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        htlclist.addAll(htlcStatusRepository.findBySendpartyAndHtlcstatus(PartyName,"process"));
        htlclist.addAll(htlcStatusRepository.findByReceivepartyAndHtlcstatus(PartyName,"process"));
        HashMap<String,String> response = new HashMap<>();
        response.put("status","Success");
        response.put("data",mapper.writeValueAsString(htlclist));
        return response;
    }
    //getone_htlc
    @PostMapping(path = "/gethtlc")
    public @ResponseBody
    HashMap<String,String> getHTLCStatus(@RequestParam Integer HTLCId) throws JsonProcessingException {
        HashMap<String,String> response = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        Optional<HTLCStatus> result = htlcStatusRepository.findById(HTLCId);
        HTLCStatus htlcStatus = result.orElse(null);
        if(htlcStatus == null){
            response.put("status","Failed, not find htlc");
        }
        else {
            response.put("status","Success");
            response.put("data",mapper.writeValueAsString(htlcStatus));
        }
        return response;
    }
}
