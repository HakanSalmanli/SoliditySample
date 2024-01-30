document.addEventListener('DOMContentLoaded', () => {
    
    const mintForm = document.getElementById('mint-form');
    const recipientInput = document.getElementById('recipient');
    const tokenUriInput = document.getElementById('token-uri');

    mintForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const recipient = recipientInput.value;
        const tokenURI = tokenUriInput.value;
        console.error('recipient = ', recipient);
        console.error('tokenURI = ', tokenURI);

        try {
            const response = await fetch('/mint-nft', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ recipient, tokenURI }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`NFT minted. Transaction Hash: ${data.transactionHash}`);
            } else {
                const data = await response.json();
                alert(`Failed to mint NFT. Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error Occured = ', error);
            alert(`Error Occured = ${error}`);
        }
    });
});
