module 0x0::art_nft {
    use std::string::String;
    use sui::object::{Self as object, UID};
    use sui::transfer;
    use sui::tx_context::{Self as tx_context, TxContext};

    struct Artwork has key {
        id: UID,
        name: String,
        description: String,
        url: String,
        is_human_verified: bool,
    }

    public entry fun mint_artwork(
        name: String,
        description: String,
        url: String,
        is_human_verified: bool,
        ctx: &mut TxContext,
    ) {
        let artwork = Artwork {
            id: object::new(ctx),
            name,
            description,
            url,
            is_human_verified,
        };

        transfer::transfer(artwork, tx_context::sender(ctx));
    }
}