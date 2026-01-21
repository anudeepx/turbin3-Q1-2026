import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { amountToNumber } from "@metaplex-foundation/umi";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// berg pubkey : G7MTCM2S1W6ufPhYLjodUyRZLBFbPz91CXd5C63aWoqV

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("H23WUxmBLvbdS2d1mJpX1Zoc5QLztqRx4DmfF7PcJxRp");

// Recipient address
const to = new PublicKey("G7MTCM2S1W6ufPhYLjodUyRZLBFbPz91CXd5C63aWoqV");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromATA = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
        )

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toATA = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        )

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            fromATA.address,
            toATA.address,
            keypair.publicKey,
            10 * 10 ** 6
        )
        console.log(`Your transfer txid: ${tx}`);

    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();