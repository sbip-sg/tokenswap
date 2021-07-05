# Web APIs for interacting with Corda nodes
## Overview
This is the API documentation for interacting with Corda nodes.  
There are 2 login-related endpoints: login/ and logout/  
After logging in, you can access 3 flow endpoints and 1 balance endpoint.  
All endpoints use POST method, except balance/. balance/ uses GET method  
If the response status code is not 200, it fails.
If the status code is 200, check “status” in the response, it might be “SUCCESS” or “FAILED”.

## Endpoints

### POST login/
#### Usage
Log in one of the Corda nodes  
#### Request parameters

| Parameter   | Use       | Description  | Type of data
| ----------- |:----------| :-----| :----
| address     | Required  | Details of user to login Corda nodes | String
| user        | Required  | | String
| password    | Required  | | String

#### Sample request
```
curl -c cookie.sav -X POST -d "address=localhost:10009" -d "user=user1" -d "password=test" localhost:10050/login
```
It gives you a cookie. `curl -i` to show the cookie, or `curl -c cookie.sav` (as above) to save the cookie to a file.

#### Possible response
On successful login: `{"nodeId":"O=Alice, L=New York, C=US","status":"SUCCESS"} `  
Failed login:  
`{"status":"FAILED! Already logged in!"}`  
`{"status":"FAILED"}`   (most likely wrong user/password but might be other causes)

#### After logging in
On successful login, the server will give you a cookie. In later sample `curl` requests, we insert `-b cookie.sav` to include the cookie in the request. In the browser, you don’t need to worry about it.



### POST logout/
#### Usage
Log out of the Corda node

#### Request parameters

None

#### Sample request
```
curl -X POST -b cookie.sav localhost:10050/logout
```
#### Possible response

Successful: `{"status":"SUCCESS"}`  (successful even if the cookie is invalid)  
Failed: `{"status":"FAILED"}`   (probably won’t happen)




### POST htlc_fund/
#### Usage
Calls HTLCFundFlow from the logged in node

#### Request parameters

| Parameter   | Use       | Description  | Type of data
| ----------- |:----------| :-----| :----
| htlc_id     | Required  | Same parameters as | String
| escrow      | Required  | HTLCFundFlow constructor| String
| receiver    | Required  | | String
| symbol      | Required  | | String
| amount      | Required  | | int
| time        | Required  | | int
| hash        | Required  | | String

#### Sample request
```
curl -X POST -b cookie.sav -d "htlc_id=1001" -d "escrow=Escrow" -d "receiver=Bob" -d "symbol=house" -d "amount=30" -d "time=3000" 
-d "hash=0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd" localhost:10050/htlc_fund
```

#### Possible response
Successful: `{"status":"SUCCESS"}`  
Failed:  
`{"status":"FAILED! Not logged in"}`  
`{"status":"FAILED! Invalid login"}`  
`{"status":"FAILED! Escrow not found"}`  
`{"status":"FAILED! Receiver not found"}`  
Not enough tokens and invalid HTLC_Id not implemented (yet)



### POST htlc_withdraw/
#### Usage
Calls HTLCWithdrawFlow from the logged in node

#### Request parameters

| Parameter   | Use       | Description  | Type of data
| ----------- |:----------| :-----| :----
| htlc_id     | Required  | Same parameters as | String
| escrow      | Required  | HTLCWithdrawFlow | String
| secret      | Required  | | String

#### Sample request
```
curl -X POST -b cookie.sav -d "htlc_id=1001" -d "escrow=Escrow" -d "secret=abracadabra" localhost:10050/htlc_withdraw
```

#### Possible response
Successful: `{"status":"SUCCESS"}`  
Failed:  
`{"status":"FAILED! Not logged in"}`  
`{"status":"FAILED! Invalid login"}`  
`{"status":"FAILED! Escrow not found"}`  
`{"status":"FAILED! Flow error [..]"}` (if the internal flow returns an error)  
Invalid HTLC_Id not implemented (yet)



### POST htlc_refund/
#### Usage
Calls HTLCRefundFlow from the logged in node

#### Request parameters

| Parameter   | Use       | Description  | Type of data
| ----------- |:----------| :-----| :----
| htlc_id     | Required  | Same parameters as | String
| escrow      | Required  | HTLCRefundFlow | String

#### Sample request
```
curl -X POST -b cookie.sav -d "htlc_id=1001" -d "escrow=Escrow" localhost:10050/htlc_refund
```

#### Possible response
Successful: `{"status":"SUCCESS"}`  
Failed:  
`{"status":"FAILED! Not logged in"}`  
`{"status":"FAILED! Invalid login"}`  
`{"status":"FAILED! Escrow not found"}`  
`{"status":"FAILED! Flow error [..]"}` (if the internal flow returns an error)  
Invalid HTLC_Id not implemented (yet)


### GET balance/
#### Usage
Get the token balance

#### Request parameters

| Parameter   | Use       | Description  | Type of data
| ----------- |:----------| :-----| :----
| symbol      | Required  | Token symbol | String

#### Sample request
```
curl -X POST -b cookie.sav -d "htlc_id=1001" -d "escrow=Escrow" localhost:10050/htlc_refund
```

#### Possible response
Successful: `{"balance":"\nYou currently have 170 house Tokens issued by Escrow\n","status":"SUCCESS"}`  
Failed:  
`{"status":"FAILED! Not logged in"}`  
`{"status":"FAILED! Invalid login"}`  
