package com.tokenswap.webserver.db;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface HTLCSecretRepository extends CrudRepository<HTLCSecret, Integer> {

    Optional<HTLCSecret> findById(Integer id);
    HTLCSecret findByInitpartyAndAndHtlcid(String Initparty,String htlcid);
}
