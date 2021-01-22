(async () => {
	const eth = window.web3.eth;
	async function getBlockNumber() {
		return new Promise((accept) => {
			eth.getBlockNumber((error, result) => {
				if (!error) {
					console.log('block number => ', result);
					accept(result);
				}
			});
		});
	}
	async function getBlock(i) {
		return new Promise((accept) => {
			eth.getBlock(i, true, (error, result) => {
				if (!error) {
					console.log('block number => ', i);
					accept(result);
				}
			});
		});
	}
	async function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
		if (endBlockNumber == null) {
			endBlockNumber = await getBlockNumber();
			console.log(`Using endBlockNumber: ${endBlockNumber}`);
		}
		if (startBlockNumber == null) {
			startBlockNumber = endBlockNumber - 500;
			console.log(`Using startBlockNumber: ${startBlockNumber}`);
		}
		console.log(`Searching for transactions to/from account "${myaccount}" within blocks ${startBlockNumber} and ${endBlockNumber}`);
		for (let i = startBlockNumber; i <= endBlockNumber; i++) {
			if (i % 500 == 0) {
				console.log(`Searching block ${i}`);
			}
			const block = await getBlock(i, true);
			if (block != null && block.transactions != null) {
				block.transactions.forEach((e) => {
					if (myaccount == '*' || myaccount == e.from || myaccount == e.to) {
						console.log(`  tx hash          : ${e.hash}\n` +
                            `   nonce           : ${e.nonce}\n` +
                            `   blockHash       : ${e.blockHash}\n` +
                            `   blockNumber     : ${e.blockNumber}\n` +
                            `   transactionIndex: ${e.transactionIndex}\n` +
                            `   from            : ${e.from}\n` +
                            `   to              : ${e.to}\n` +
                            `   value           : ${e.value}\n` +
                            `   time            : ${block.timestamp} ${new Date(block.timestamp * 1000).toGMTString()}\n` +
                            `   gasPrice        : ${e.gasPrice}\n` +
                            `   gas             : ${e.gas}\n` +
                            `   input           : ${e.input}`);
					}
				});
			}
		}
	}
	return getTransactionsByAccount('0x2096F2bcdca693a6613b928aCbB39Ef6AC669826');
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
