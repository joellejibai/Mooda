import { pipeline } from "@xenova/transformers";

let classifier = null;

export async function predictClothingCategory(imageData) {
    if (!imageData || typeof imageData !== "string") {
        throw new Error("Invalid imageData");
    }

    // Convert dataURL to blob
    const res = await fetch(imageData);
    const blob = await res.blob();

    if (!classifier) {
        classifier = await pipeline(
            "image-classification",
            "Xenova/vit-base-patch16-224"
        );
    }

    const predictions = await classifier(blob);

    const label = predictions?.[0]?.label?.toLowerCase() ?? "";

    return {
        category: label.match(
            /(hoodie|jacket|jeans|top|dress|skirt|tshirt|blazer|pants|shorts|sweater|hat|cap|shoes|heels|boots)/
        )?.[0] ?? "",
        color: label.match(
            /(black|white|pink|red|blue|green|beige|brown|grey|gray)/
        )?.[0] ?? "",
    };
}
