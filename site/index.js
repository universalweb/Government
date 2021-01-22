(async () => {
	const ractive = window.Ractive({
		data: {
			proposals: window.proposals,
			value: '',
			active: {}
		},
		async getMeSomeVote(value) {
			console.log(value);
			const valueReal = value || await this.get('value');
			console.log(web3.toHex(valueReal));
			const transactionParameters = {
				to: '0x2096F2bcdca693a6613b928aCbB39Ef6AC669826', // Required except during contract publications.
				from: ethereum.selectedAddress, // must match user's active address.
				gas: '0x76c0', // 30400
				gasPrice: '0x9184e72a000', // 10000000000000
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
			console.log(item.value);
			await this.set('active', item);
			await this.getMeSomeVote(item.value);
			console.log(await this.get('active'));
		},
		template: `<div class="container-lg overflow-hidden mx-auto mt-5">
			<div class="list-group">
				{{#each proposals as proposal}}
					<div href="#" class="list-group-item list-group-item-action p-4" target="_blank">
						<div class="d-flex w-100 justify-content-between">
						<h5 class="mb-1">{{title}}</h5>
						<small><a href="https://etherscan.io/tx/{{id}}" target="_blank">Etherscan</a></small>
						</div>
						<p class="mb-1">{{description}}</p>
						<p class="mb-1">HASH: <a href="https://etherscan.io/tx/{{id}}" target="_blank">{{id}}</a></p>
						<small>GITHUB: <a href="{{github}}" target="_blank">{{github}}</a></small>
						<hr />
						<div class="btn-group" role="group">
							{{#each options as item}}
								<button type="button" class="btn btn-outline-primary" on-click="@this.activate(proposal, item)">{{item}}</button>
							{{/each}}
						</div>
					</div>
				{{/each}}
			</div>
            <hr />
            <div class="container-sm">
				<label for="basic-url" class="form-label fw-bold">CUSTOM REQUEST</label> <br />
				<p><small>Create a custom Proposal, Vote, or data request</small></p>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon3">Value</span>
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
				onboardButton.innerText = 'Install MetaMask!';
				// The button is now disabled
				onboardButton.disabled = false;
			}
		};
		console.log('metaMask CONNECT STARTED');
		metamaskClientCheck();
	};
	initialize();
})();
