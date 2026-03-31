import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const B = "https://cdn.dummyjson.com/product-images";

// Verified working URLs from DummyJSON API
const IMGS = {
  // Kitchen
  blender:      `${B}/kitchen-accessories/boxed-blender/thumbnail.webp`,
  spatula:      `${B}/kitchen-accessories/bamboo-spatula/thumbnail.webp`,
  whisk:        `${B}/kitchen-accessories/black-whisk/thumbnail.webp`,
  cup:          `${B}/kitchen-accessories/black-aluminium-cup/thumbnail.webp`,
  knife:        `${B}/kitchen-accessories/knife/thumbnail.webp`,
  pan:          `${B}/kitchen-accessories/pan/thumbnail.webp`,
  lunchbox:     `${B}/kitchen-accessories/lunch-box/thumbnail.webp`,
  spiceRack:    `${B}/kitchen-accessories/spice-rack/thumbnail.webp`,
  microwave:    `${B}/kitchen-accessories/microwave-oven/thumbnail.webp`,
  iceCube:      `${B}/kitchen-accessories/ice-cube-tray/thumbnail.webp`,
  grater:       `${B}/kitchen-accessories/grater-black/thumbnail.webp`,
  strainer:     `${B}/kitchen-accessories/fine-mesh-strainer/thumbnail.webp`,
  pot:          `${B}/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp`,
  peeler:       `${B}/kitchen-accessories/yellow-peeler/thumbnail.webp`,
  plate:        `${B}/kitchen-accessories/plate/thumbnail.webp`,
  tray:         `${B}/kitchen-accessories/tray/thumbnail.webp`,
  // Sports
  football:     `${B}/sports-accessories/american-football/thumbnail.webp`,
  baseball:     `${B}/sports-accessories/baseball-ball/thumbnail.webp`,
  glove:        `${B}/sports-accessories/baseball-glove/thumbnail.webp`,
  // Beauty
  mascara:      `${B}/beauty/essence-mascara-lash-princess/thumbnail.webp`,
  eyeshadow:    `${B}/beauty/eyeshadow-palette-with-mirror/thumbnail.webp`,
  powder:       `${B}/beauty/powder-canister/thumbnail.webp`,
  lipstick:     `${B}/beauty/red-lipstick/thumbnail.webp`,
  nailPolish:   `${B}/beauty/red-nail-polish/thumbnail.webp`,
  // Skincare
  soap:         `${B}/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp`,
  bodyWash:     `${B}/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp`,
  lotion:       `${B}/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp`,
  // Fragrances
  perfumeCK:    `${B}/fragrances/calvin-klein-ck-one/thumbnail.webp`,
  perfumeDior:  `${B}/fragrances/dior-j'adore/thumbnail.webp`,
  perfumeGucci: `${B}/fragrances/gucci-bloom-eau-de/thumbnail.webp`,
  // Home decoration
  swing:        `${B}/home-decoration/decoration-swing/thumbnail.webp`,
  photoFrame:   `${B}/home-decoration/family-tree-photo-frame/thumbnail.webp`,
  plant:        `${B}/home-decoration/house-showpiece-plant/thumbnail.webp`,
  // Furniture
  bed:          `${B}/furniture/annibale-colombo-bed/thumbnail.webp`,
  sofa:         `${B}/furniture/annibale-colombo-sofa/thumbnail.webp`,
  table:        `${B}/furniture/bedside-table-african-cherry/thumbnail.webp`,
  // Electronics
  macbook:      `${B}/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp`,
  laptop2:      `${B}/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp`,
  iphone:       `${B}/smartphones/iphone-13-pro/thumbnail.webp`,
  ipad:         `${B}/tablets/ipad-mini-2021-starlight/thumbnail.webp`,
  echo:         `${B}/mobile-accessories/amazon-echo-plus/thumbnail.webp`,
  airpods:      `${B}/mobile-accessories/apple-airpods/thumbnail.webp`,
  airpodsMax:   `${B}/mobile-accessories/apple-airpods-max-silver/thumbnail.webp`,
  // Watches
  watchM:       `${B}/mens-watches/brown-leather-belt-watch/thumbnail.webp`,
  watchRolex:   `${B}/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp`,
  watchW:       `${B}/womens-watches/rolex-datejust-women/thumbnail.webp`,
  // Clothing
  shirt:        `${B}/mens-shirts/blue-&-black-check-shirt/thumbnail.webp`,
  tshirt:       `${B}/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp`,
  dress:        `${B}/womens-dresses/black-women's-gown/thumbnail.webp`,
  blueDress:    `${B}/tops/blue-frock/thumbnail.webp`,
  // Shoes
  sneakers:     `${B}/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp`,
  wShoes:       `${B}/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp`,
  // Bags & accessories
  handbag:      `${B}/womens-bags/prada-women-bag/thumbnail.webp`,
  bag2:         `${B}/womens-bags/blue-women's-handbag/thumbnail.webp`,
  sunglasses:   `${B}/sunglasses/black-sun-glasses/thumbnail.webp`,
  jewellery:    `${B}/womens-jewellery/green-crystal-earring/thumbnail.webp`,
  // Vehicle
  car:          `${B}/vehicle/dodge-hornet-gt-plus/thumbnail.webp`,
  car2:         `${B}/vehicle/300-touring/thumbnail.webp`,
  motorcycle:   `${B}/motorcycle/kawasaki-z800/thumbnail.webp`,
  // Groceries
  apple:        `${B}/groceries/apple/thumbnail.webp`,
};

// Keyword matching rules — from most specific to most general
const RULES: [string[], string][] = [
  // Kitchen / cooking
  [["vegetable chop","food chopper","chopper"],   IMGS.blender],
  [["blender","juicer","smoothie"],               IMGS.blender],
  [["coffee","espresso","frother","brew","milk frother"], IMGS.cup],
  [["wine opener","bottle opener","corkscrew"],   IMGS.cup],
  [["knife","cutter","blade"],                    IMGS.knife],
  [["pan","wok","skillet","cookware","frying"],   IMGS.pan],
  [["pot","casserole","dutch oven"],              IMGS.pot],
  [["lunch box","bento","food container"],        IMGS.lunchbox],
  [["spice","salt","pepper shaker"],              IMGS.spiceRack],
  [["microwave","toaster oven","air fryer"],      IMGS.microwave],
  [["ice cube","ice tray"],                       IMGS.iceCube],
  [["grater","slicer","mandoline"],              IMGS.grater],
  [["strainer","sieve","colander"],              IMGS.strainer],
  [["peeler","vegetable peeler"],                IMGS.peeler],
  [["spatula","turner","flipper"],               IMGS.spatula],
  [["whisk","egg beater"],                       IMGS.whisk],
  [["plate","dish","dinnerware"],               IMGS.plate],
  [["tray","serving tray"],                     IMGS.tray],
  [["kitchen","cooking tool","utensil"],        IMGS.spatula],

  // Sports & fitness
  [["yoga mat","exercise mat","workout mat"],   IMGS.football],
  [["resistance band","exercise band"],         IMGS.football],
  [["jump rope","skipping rope"],               IMGS.baseball],
  [["dumbbell","weight","kettlebell"],          IMGS.glove],
  [["waist pack","running belt","fanny pack"],  IMGS.glove],
  [["knee brace","knee support","knee pad"],    IMGS.football],
  [["posture corrector","posture brace"],       IMGS.football],
  [["sport","fitness","gym","athletic"],        IMGS.football],

  // Beauty / personal care
  [["mascara","lash","eyelash"],               IMGS.mascara],
  [["eyeshadow","eye palette","makeup palette"],IMGS.eyeshadow],
  [["lipstick","lip gloss","lip balm"],        IMGS.lipstick],
  [["nail polish","nail art","nail gel"],      IMGS.nailPolish],
  [["powder","foundation","blush","bronzer"], IMGS.powder],
  [["hair brush","hairbrush","detangling","comb"], IMGS.powder],
  [["face roller","ice roller","jade roller"], IMGS.soap],
  [["serum","vitamin c","retinol","skin care","skincare"], IMGS.lotion],
  [["lotion","moisturizer","cream","body wash","shea butter"], IMGS.bodyWash],
  [["soap","cleanser","face wash"],           IMGS.soap],
  [["shaver","electric shaver","razor","trimmer"], IMGS.powder],

  // Fragrance
  [["perfume","cologne","eau de","fragrance","scent"], IMGS.perfumeCK],

  // Home / decor / furniture
  [["pillow","cushion","memory foam","lumbar"],IMGS.sofa],
  [["sofa","couch","loveseat"],               IMGS.sofa],
  [["bed","mattress","headboard"],            IMGS.bed],
  [["table","desk","nightstand","side table"],IMGS.table],
  [["shelf","rack","organizer","storage unit"],IMGS.swing],
  [["photo frame","picture frame","wall frame"],IMGS.photoFrame],
  [["plant","succulent","garden","bonsai"],   IMGS.plant],
  [["candle","wax melt","diffuser","aroma"], IMGS.swing],
  [["smart lock","door lock","keyless","deadbolt"], IMGS.table],
  [["mosquito","bug zapper","pest","insect"], IMGS.swing],
  [["home","decor","decoration","ornament"],  IMGS.swing],

  // Electronics & gadgets
  [["earbuds","airpods","headphone","earbud","tws"], IMGS.airpods],
  [["speaker","bluetooth speaker","mini speaker"],  IMGS.echo],
  [["smart speaker","echo","alexa"],               IMGS.echo],
  [["wireless charger","charging pad","charger"],  IMGS.airpods],
  [["phone mount","phone holder","car mount","dashboard"], IMGS.iphone],
  [["keyboard","mouse","combo","wireless keyboard"], IMGS.macbook],
  [["laptop","notebook","macbook","chromebook"],    IMGS.macbook],
  [["tablet","ipad","android tablet"],             IMGS.ipad],
  [["baby monitor","camera wifi","security camera"],IMGS.ipad],
  [["ring light","selfie light","clip light","led light"], IMGS.echo],
  [["smart watch","smartwatch","fitness band","fitness tracker"], IMGS.watchM],
  [["vacuum","cordless vacuum","handheld vacuum"],  IMGS.macbook],

  // Watches
  [["women watch","ladies watch","female watch"],  IMGS.watchW],
  [["watch","wristwatch","timepiece"],             IMGS.watchM],

  // Clothing
  [["dress","gown","frock","maxi"],              IMGS.dress],
  [["t-shirt","tee shirt","graphic tee"],        IMGS.tshirt],
  [["shirt","button down","plaid shirt"],        IMGS.shirt],
  [["jacket","hoodie","coat","sweater","sweatshirt"], IMGS.shirt],
  [["leggings","yoga pants","activewear"],       IMGS.blueDress],
  [["top","blouse","tank top"],                  IMGS.blueDress],

  // Shoes
  [["sneaker","trainer","running shoe","athletic shoe"], IMGS.sneakers],
  [["women shoe","heels","pump","sandal","women's shoe"], IMGS.wShoes],
  [["shoe","footwear","boot"],                  IMGS.sneakers],

  // Bags & accessories
  [["handbag","purse","tote","shoulder bag"],    IMGS.handbag],
  [["backpack","rucksack"],                      IMGS.bag2],
  [["sunglasses","shades","eyewear"],            IMGS.sunglasses],
  [["necklace","bracelet","ring","jewellery","jewelry","earring"], IMGS.jewellery],

  // Vehicle / automotive
  [["car headrest","car pillow","neck pillow"],  IMGS.car],
  [["car","vehicle","auto","dashboard","seat cover"], IMGS.car],
  [["motorcycle","bike","scooter"],              IMGS.motorcycle],

  // Groceries
  [["food","snack","healthy snack","organic"],   IMGS.apple],
  [["water bottle","bottle","flask","tumbler","thermos"], IMGS.cup],
];

function pickImage(title: string): string {
  const lower = title.toLowerCase();
  for (const [keywords, img] of RULES) {
    if (keywords.some(k => lower.includes(k))) return img;
  }
  // Default fallback by first word
  return IMGS.tray;
}

async function main() {
  console.log("Fetching trending products from Supabase...");
  // Trending flag lives in product_metadata; join via product_id
  const { data: meta, error: metaErr } = await supabase
    .from("product_metadata")
    .select("product_id")
    .eq("is_trending", true);
  if (metaErr || !meta) { console.error("Metadata error:", metaErr); process.exit(1); }
  const ids = meta.map(m => m.product_id);
  console.log(`Found ${ids.length} trending product IDs`);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title")
    .in("id", ids);

  if (error || !products) { console.error("Error:", error); process.exit(1); }
  console.log(`Found ${products.length} trending products\n`);

  let updated = 0;
  for (const p of products) {
    const img = pickImage(p.title);
    const { error: upErr } = await supabase
      .from("products")
      .update({ image: img })
      .eq("id", p.id);
    if (upErr) {
      console.error(`[error] "${p.title}":`, upErr.message);
    } else {
      const label = img.split("/").slice(-2, -1)[0];
      console.log(`[ok] "${p.title}" → ${label}`);
      updated++;
    }
  }
  console.log(`\nDone: ${updated}/${products.length} updated.`);
}

main().catch(console.error);
