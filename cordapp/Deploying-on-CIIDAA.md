# Deploying the example on CIIDAA
## Steps to deploy on CIIDAA
* Prepare the nodes
  - Check out the `deployNetwork` task in `build.gradle`:
    - Change `p2pAddress` of nodes (`Alice`, `Bob`, etc.) to where you want them (`10.0.0.4`, `10.0.0.5`, etc.)
    - Change ports as you wish. It is good to avoid other applications' ports.
  - Run the task:
    ```
    ./gradlew clean deployNetwork
    ```
  - Enter the `build/nodes` directory, you will see directories of nodes like `Alice`, `Bob`, `Escrow`, etc. Copy these folders to their respective address in `build.gradle`
* Running the nodes
  - Run with java
    - From each slave node, run the node with 
      ```
      java -jar corda.jar
      ```
    - After starting all nodes, you can start creating transactions, you can use the terminal or SSH with (for example) (password: test)
      ```
      ssh user1@10.0.0.5 -p 2221 
      ```
  - Run with docker
    - For each slave node, do the following:
      - Use the `docker-compose.yml` provided as example, put it right outside of the node folders
      - Adjust `docker-compose.yml` so it only contains the node(s) you need
      - Create all the volumes written in the file in the node folder(s). Usually, you only have to create the `persistence` folder
      - Allow permission from the image to the folder: (`Notary` as an example)
        ```
        chmod o+rwx Notary -R
        ```
      - Uncomment the line(s) with `CORDA_ARGS` in `docker-compose.yml` and run the migration script with:
        ```
        docker-compose -f docker-compose.yml up
        ```
      - Comment the line(s) again and run the above command again to run the container(s)
    - After starting all nodes (hopefully), you can SSH to the nodes and create transactions
        
    
## Some commands
Useful commands to run in the Corda terminal:
- `run nodeInfo`: show which node it is
- `run networkMapSnapshot`: show all other nodes (just the info, they might not connect)
- `run` : show all commands
