package com.tokenswap.webserver.db;


import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Data;
import org.hibernate.annotations.TypeDef;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity

public class HTLCStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer htlcid;

    private String sendparty;
    private String receiveparty;
    private String sendpartyaddress;
    private String receivepartyaddress;
    private String sendtype;
    private String sendvalue;
    private String receivetype;
    private String receivevalue;
    private String sendtimeout;
    private String receivetimout;
    private String htlchash;
    private String ethsmartcontractaddress;
    //started: init
    //process: sendwithdraw, receivewithdraw,receiverefund, sendrefund
    //end: finished,finished
    private String htlcstatus;
    // sendfund, sendwithdraw, sendrefund, finished
    private String sendstatus;
    //receivefund, receivedwithdraw, receiverefund, finished
    private String receivestatus;

    public String getReceiveparty() {
        return receiveparty;
    }

    public void setReceiveparty(String receiveparty) {
        this.receiveparty = receiveparty;
    }

    public String getSendpartyaddress() {
        return sendpartyaddress;
    }

    public void setSendpartyaddress(String sendpartyaddress) {
        this.sendpartyaddress = sendpartyaddress;
    }

    public String getReceivepartyaddress() {
        return receivepartyaddress;
    }

    public void setReceivepartyaddress(String receivepartyaddress) {
        this.receivepartyaddress = receivepartyaddress;
    }

    public String getSendtype() {
        return sendtype;
    }

    public void setSendtype(String sendtype) {
        this.sendtype = sendtype;
    }

    public String getSendvalue() {
        return sendvalue;
    }

    public void setSendvalue(String sendvalue) {
        this.sendvalue = sendvalue;
    }

    public String getReceivetype() {
        return receivetype;
    }

    public void setReceivetype(String receivetype) {
        this.receivetype = receivetype;
    }

    public String getReceivevalue() {
        return receivevalue;
    }

    public void setReceivevalue(String receivevalue) {
        this.receivevalue = receivevalue;
    }

    public String getSendtimeout() {
        return sendtimeout;
    }

    public void setSendtimeout(String sendtimeout) {
        this.sendtimeout = sendtimeout;
    }

    public String getReceivetimout() {
        return receivetimout;
    }

    public void setReceivetimout(String receivetimout) {
        this.receivetimout = receivetimout;
    }

    public String getEthsmartcontractaddress() {
        return ethsmartcontractaddress;
    }

    public void setEthsmartcontractaddress(String ethsmartcontractaddress) {
        this.ethsmartcontractaddress = ethsmartcontractaddress;
    }

    public String getHtlcstatus() {
        return htlcstatus;
    }

    public void setHtlcstatus(String htlcstatus) {
        this.htlcstatus = htlcstatus;
    }

    public String getSendstatus() {
        return sendstatus;
    }

    public void setSendstatus(String sendstatus) {
        this.sendstatus = sendstatus;
    }

    public String getReceivestatus() {
        return receivestatus;
    }

    public void setReceivestatus(String receivestatus) {
        this.receivestatus = receivestatus;
    }

    public Integer getHtlcid() {
        return htlcid;
    }

    public void setHtlcid(Integer htlcid) {
        this.htlcid = htlcid;
    }

    public String getSendparty() {
        return sendparty;
    }

    public void setSendparty(String sendparty) {
        this.sendparty = sendparty;
    }

    public String getHtlchash() {
        return htlchash;
    }

    public void setHtlchash(String htlchash) {
        this.htlchash = htlchash;
    }
}
