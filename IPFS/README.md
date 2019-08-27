1. Install "ipfs-http-client" npm package:
		npm install -g ipfs-http-client

2. Install IPFS:
		Follow the instructions in the link given below:
		https://flyingzumwalt.gitbooks.io/decentralized-web-primer/content/install-ipfs/lessons/download-and-install.html

		After installation, do "ipfs version" in the command line to check if it is installed properly.

3. Now to initialize ipfs, in the command line type the following command:
		ipfs init

		now, follow the instructions that pops up.

4. Now, to interact with IPFS, we need to start the daemon. Do it by using 	  the following command.
		ipfs daemon

		which will return following:
		"""
		    Initializing daemon...
			go-ipfs version: 0.4.21-
			Repo version: 7
			System version: amd64/darwin
			Golang version: go1.12.5
			Swarm listening on /ip4/127.0.0.1/tcp/4001
			Swarm listening on /ip4/192.168.1.169/tcp/4001
			Swarm listening on /ip6/::1/tcp/4001
			Swarm listening on /p2p-circuit
			Swarm announcing /ip4/127.0.0.1/tcp/4001
			Swarm announcing /ip4/192.168.1.169/tcp/4001
			Swarm announcing /ip6/::1/tcp/4001
			API server listening on /ip4/127.0.0.1/tcp/5001
			WebUI: http://127.0.0.1:5001/webui
			Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/8080
			Daemon is ready 
		"""

		Once this is done, you are ready to interact with IPFS.

5. In the root directory of this project do:
		npm install

		which will install the required dependencies if not installed.

6. Now, run the node file.
		node app.js

7. Now, we are uploading the read.json file in the project directory to
   IPFS.

8. Now, in the browser hit the following url:
		http://localhost:3000/

		which will open an html web page using which you can select files from your computer and press "upload" button which in turn add the file to IPFS and will return the IPFS link to that file.

Testing:

I have previously uploaded few files for testing.

Sample Images:
https://gateway.ipfs.io/ipfs/QmbzLbFEW8kivX2aQ89f7Wq2KHMTJvGN5XVLkQy5EQu6UT
https://gateway.ipfs.io/ipfs/Qmf9ABjskfF6iEPSRvSLESEoyZ3rPmXmNt7YPzezv1RMXT
you can click on the link which will return the files that I have uploaded.


