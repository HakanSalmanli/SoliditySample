const express = require('express');
const Web3 = require('web3');
const { abi, networks } = require('../contract/NFTMinter.json');

const app = express();
const port = process.env.PORT || 3000;

const web3 = new Web3('https://mainnet.infura.io/v3/3eda99f3f1644f62a87d781578f6e34f');
const contractAddress = networks['1'].address;
const contract = new web3.eth.Contract(abi, contractAddress);

app.use(express.json());

app.post('/mint-nft', async (req, res) => {

    const { recipient, tokenURI } = req.body;
    console.error('recipient = ', recipient);
    console.error('tokenURI = ', tokenURI);

    try {
        const gas = await contract.methods.mintNFT(tokenURI).estimateGas();
        const gasPrice = await web3.eth.getGasPrice();
        const data = contract.methods.mintNFT(tokenURI).encodeABI();
        const nonce = await web3.eth.getTransactionCount('YOUR_SENDER_ADDRESS');
        const privateKey = Buffer.from('YOUR_PRIVATE_KEY', 'hex');

        console.error('gas = ', gas);
        console.error('gasPrice = ', gasPrice);
        console.error('data = ', data);
        console.error('nonce = ', nonce);
        console.error('privateKey = ', privateKey); 

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: contractAddress,
                gas,
                gasPrice,
                data,
                nonce,
            },
            privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Minting NFT failed' });
    }
});

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
