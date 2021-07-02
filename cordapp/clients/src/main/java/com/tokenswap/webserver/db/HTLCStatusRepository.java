package com.tokenswap.webserver.db;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;


public interface HTLCStatusRepository extends CrudRepository<HTLCStatus, Integer> {

    Optional<HTLCStatus> findById(Integer id);

    List<HTLCStatus> findBySendpartyAndHtlcstatus(String SendParty, String HTLCStatus);
    List<HTLCStatus> findByReceivepartyAndHtlcstatus(String ReceiveParty, String HTLCStatus);

}