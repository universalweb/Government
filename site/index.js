(async () => {
	const getMeSomeVote = async () => {
		const {
			ethereum
		} = window;
		const transactionParameters = {
			to: '0x2096F2bcdca693a6613b928aCbB39Ef6AC669826', // Required except during contract publications.
			from: ethereum.selectedAddress, // must match user's active address.
			value: '0x00', // Only required to send ether to the recipient from the initiating external account.
			data: web3.toHex(textarea.value), // CONVERT TO HEX
		};
		// txHash is a hex string
		// As with any RPC call, it may throw an error
		const txHash = await ethereum.request({
			method: 'eth_sendTransaction',
			params: [transactionParameters],
		});
		console.log(txHash);
	};
	const proposals = [{
		id: '0xf1ba69aa88d5a5d60e000dc6968b8d071f0819057cc74631fdd3b58711db8ffc',
		github: 'https://github.com/universalweb/Government/issues/22',
		title: `UW WEBSITE UPDATE PROPOSAL(OFFICIAL)`,
		description: `First impressions count.Proposal to revamp universalweb.io, so that it breathes Bleeding Edge Tech like the UW itself does.No simple design, but something impressive for marketing the UW.`,
		options: ['YES', 'NO']
	}];
	const ractive = window.Ractive({
		data: {
			proposals,
			value: '',
			active: {}
		},
		async getMeSomeVote(value) {
			console.log(this);
			const valueReal = value || await this.get('value');
			const transactionParameters = {
				to: '0x2096F2bcdca693a6613b928aCbB39Ef6AC669826', // Required except during contract publications.
				from: ethereum.selectedAddress, // must match user's active address.
				value: '0x00', // Only required to send ether to the recipient from the initiating external account.
				data: web3.toHex(valueReal), // CONVERT TO HEX
			};
			// txHash is a hex string
			// As with any RPC call, it may throw an error
			const txHash = await ethereum.request({
				method: 'eth_sendTransaction',
				params: [transactionParameters],
			});
			console.log(txHash);
		},
		async activate(item, option) {
			item.value = `${option}-${item.id}`;
			await this.set('active', item);
			getMeSomeVote(item.value);
			console.log(await this.get('active'));
		},
		template: `<div class="container-lg">
            {{#each proposals as proposal}}
                <h6>{{title}}</h6>
                <div class="btn-group" role="group">
                    {{#each options as item}}
                        <button type="button" class="btn btn-outline-primary" on-click="@this.activate(proposal, item)">{{item}}</button>
                    {{/each}}
                </div>
            {{/each}}
            <hr />
            <div class="container-sm">
                <label for="basic-url" class="form-label"></label>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon3">VALUE</span>
                    <input type="text" class="form-control" value="{{value}}" id="textarea" aria-describedby="basic-addon3">
                </div>
                <button type="button" class="btn btn-primary right" on-click="@this.getMeSomeVote()">SUBMIT</button>
            </div>
        </div>`,
		target: '#proposals'
	});
	await ractive.render();
	const initialize = () => {
		const onboardButton = document.getElementById('connectButton');
		const isMetaMaskInstalled = () => {
			const {
				ethereum
			} = window;
			return Boolean(ethereum && ethereum.isMetaMask);
		};
		const onClickConnect = async () => {
			try {
				// Will Start the MetaMask Extension
				await ethereum.request({
					method: 'eth_requestAccounts'
				});
			} catch (error) {
				console.error(error);
			}
		};
		const metamaskClientCheck = async () => {
			// Now we check to see if MetaMask is installed
			if (isMetaMaskInstalled()) {
				// If MetaMask is installed we ask the user to connect to their wallet
				onboardButton.innerText = 'CONNECT';
				// When the button is clicked we call this function to connect the users MetaMask Wallet
				onboardButton.onclick = onClickConnect;
				// The button is now disabled
				onboardButton.disabled = false;
			} else {
				// If it isn't installed we ask the user to click to install it
				onboardButton.innerText = 'Click here to install MetaMask!';
				// When the button is clicked we call th is function
				onboardButton.onclick = onClickInstall;
				// The button is now disabled
				onboardButton.disabled = false;
			}
		};
		console.log('metaMask CONNECT STARTED');
		metamaskClientCheck();
	};
	initialize();
	return;
	const mainWallet = `https://api.etherscan.io/api?module=account&action=txlist&address=0x2096F2bcdca693a6613b928aCbB39Ef6AC669826&sort=asc`;
	const request = new Request(mainWallet, {
		method: 'GET'
	});
	const response = await fetch(mainWallet);
	let transactions;
	if (response.status === 200) {
		transactions = await response.json();
	}
	console.log(transactions.result);
	transactions.result.forEach((item) => {
		if (item.input) {
			console.log(web3.toAscii(item.input));
		}
	});
})();
