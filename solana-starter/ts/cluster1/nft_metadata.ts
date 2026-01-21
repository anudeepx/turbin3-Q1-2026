import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://gateway.irys.xyz/5iNPN7178ijBKFTkb5XtRXSqu5PKHBM9xNuo7C8tAwFy"
        const genericFile = createGenericFile(image, "generug.png", {
            contentType: "image/png"
        });

        const [imageUri] = await umi.uploader.upload([genericFile]);
        console.log("Your image URI: ", imageUri);
        const metadata = {
            name: "anudeeps generug",
            symbol: "ANG",
            description: "turbin3 Q1 2026 generug NFT",
            image: "" + imageUri,
            attributes: [
                { trait_type: 'anudeep', value: '10' }
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "" + imageUri
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
