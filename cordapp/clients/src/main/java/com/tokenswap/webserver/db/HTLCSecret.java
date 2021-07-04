package com.tokenswap.webserver.db;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class HTLCSecret {

    public Integer getHtlcsecid() {
        return htlcsecid;
    }

    public void setHtlcsecid(Integer htlcsecid) {
        this.htlcsecid = htlcsecid;
    }

    public Integer getHtlcid() {
        return htlcid;
    }

    public void setHtlcid(Integer htlcid) {
        this.htlcid = htlcid;
    }

    public String getInitparty() {
        return initparty;
    }

    public void setInitparty(String initparty) {
        this.initparty = initparty;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getHtlchash() {
        return htlchash;
    }

    public void setHtlchash(String htlchash) {
        this.htlchash = htlchash;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer htlcsecid;

    private Integer htlcid;
    private String initparty;
    private String secret;
    private String htlchash;
}
