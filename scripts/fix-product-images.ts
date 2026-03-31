import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Real Unsplash photo IDs curated per product category
const imageMap: Record<string, string> = {
  // Fitness / Health
  'yoga': 'photo-1601925228869-d66e9a4e97d7',
  'knee brace': 'photo-1571019613454-1cb2f99b2d8b',
  'posture corrector': 'photo-1571019613454-1cb2f99b2d8b',
  'resistance bands': 'photo-1517836357463-d25dfeac3438',
  'pull up bar': 'photo-1517836357463-d25dfeac3438',
  'jump rope': 'photo-1517836357463-d25dfeac3438',
  'massage gun': 'photo-1571019613454-1cb2f99b2d8b',
  'acupressure': 'photo-1571019613454-1cb2f99b2d8b',
  'knee compression': 'photo-1571019613454-1cb2f99b2d8b',
  'running belt': 'photo-1476480862126-209bfaa8edc8',
  'smart watch': 'photo-1523275335684-37898b6baf30',
  'fitness tracker': 'photo-1523275335684-37898b6baf30',
  'body fat scale': 'photo-1571019613454-1cb2f99b2d8b',

  // Beauty / Skincare
  'eyelash curler': 'photo-1596462502278-27bfdc403348',
  'teeth whitening': 'photo-1606107557195-0e29a4b5b4aa',
  'derma roller': 'photo-1612817288484-6f916006741a',
  'magnetic eyelash': 'photo-1596462502278-27bfdc403348',
  'eye massager': 'photo-1612817288484-6f916006741a',
  'jade gua sha': 'photo-1612817288484-6f916006741a',
  'vitamin c serum': 'photo-1612817288484-6f916006741a',
  'ice roller': 'photo-1612817288484-6f916006741a',
  'facial cleansing': 'photo-1612817288484-6f916006741a',
  'scalp massager': 'photo-1612817288484-6f916006741a',
  'heated eye mask': 'photo-1612817288484-6f916006741a',
  'foot file': 'photo-1608248543803-ba4f8c70ae0b',

  // Kitchen / Home
  'soap dispenser': 'photo-1584464491033-06628f3a6b7b',
  'vegetable chopper': 'photo-1556909114-f6e7ad7d3136',
  'electric kettle': 'photo-1544787219-7f47ccb76574',
  'portable blender': 'photo-1570197788417-0e82375c9371',
  'salt pepper grinder': 'photo-1556909114-f6e7ad7d3136',
  'baby food maker': 'photo-1555252333-9f8e92e65df9',
  'milk frother': 'photo-1495474472287-4d71bcdd2085',
  'collapsible water bottle': 'photo-1523362628745-0c100150b504',
  'insulated tumbler': 'photo-1596755389378-c31d21fd1273',
  'silicone stretch lids': 'photo-1556909114-f6e7ad7d3136',
  'electric lunch box': 'photo-1556909114-f6e7ad7d3136',
  'food warmer': 'photo-1556909114-f6e7ad7d3136',

  // Baby / Kids
  'baby bib': 'photo-1555252333-9f8e92e65df9',
  'baby monitor': 'photo-1555252333-9f8e92e65df9',
  'baby nasal': 'photo-1555252333-9f8e92e65df9',
  'baby milestone': 'photo-1555252333-9f8e92e65df9',
  'kids drawing': 'photo-1503676260728-1c00da094a0b',
  'montessori': 'photo-1503676260728-1c00da094a0b',
  'inflatable': 'photo-1503676260728-1c00da094a0b',
  'plush kids toy': 'photo-1558618666-fcd25c85cd64',
  'kids toy': 'photo-1558618666-fcd25c85cd64',

  // Car / Vehicle
  'car headrest': 'photo-1503376780353-7e6692767b70',
  'car vacuum': 'photo-1503376780353-7e6692767b70',
  'car phone holder': 'photo-1502877338535-766e1452684a',
  'magnetic phone mount': 'photo-1502877338535-766e1452684a',
  'car trunk': 'photo-1503376780353-7e6692767b70',
  'dash cam': 'photo-1503376780353-7e6692767b70',
  'tire inflator': 'photo-1503376780353-7e6692767b70',
  'air pump': 'photo-1503376780353-7e6692767b70',

  // Tech / Electronics
  'bluetooth speaker': 'photo-1608043152269-423dbba4e7e1',
  'fingerprint padlock': 'photo-1558618666-fcd25c85cd64',
  'smart door lock': 'photo-1558618666-fcd25c85cd64',
  'led strip': 'photo-1558618666-fcd25c85cd64',
  'wireless charging': 'photo-1587829741301-dc798b83add3',
  'usb c hub': 'photo-1587829741301-dc798b83add3',
  'wireless keyboard': 'photo-1587829741301-dc798b83add3',
  'wireless earbuds': 'photo-1572635196237-14b3f281503f',
  'noise cancellation': 'photo-1572635196237-14b3f281503f',
  'mini projector': 'photo-1595079676339-1534801ad6cf',
  'phone tripod': 'photo-1502982720700-bfff97f2ecac',
  'ring light': 'photo-1502982720700-bfff97f2ecac',
  'led bathroom mirror': 'photo-1614622596809-c73d4afc9c5a',
  'led sunset': 'photo-1533090161767-e6ffed986c88',
  'cloud led night light': 'photo-1533090161767-e6ffed986c88',
  'uv phone sanitizer': 'photo-1587829741301-dc798b83add3',
  'uv sterilizer': 'photo-1587829741301-dc798b83add3',
  'wifi security camera': 'photo-1558618666-fcd25c85cd64',
  'smart water bottle': 'photo-1523362628745-0c100150b504',
  'smart plant': 'photo-1416879595882-3373a0480b5b',
  'smart body': 'photo-1571019613454-1cb2f99b2d8b',

  // Clothing / Accessories
  'winter gloves': 'photo-1553531384-411a247ccd73',
  'anti-theft backpack': 'photo-1553531384-411a247ccd73',
  'crossbody': 'photo-1553531384-411a247ccd73',
  'neck pillow': 'photo-1591672299888-e16a08b6c7ce',
  'heated blanket': 'photo-1591672299888-e16a08b6c7ce',

  // Pet
  'pet water fountain': 'photo-1548199973-03cce0bbc87b',
  'cat scratching': 'photo-1548199973-03cce0bbc87b',
  'interactive cat': 'photo-1548199973-03cce0bbc87b',
  'dog leash': 'photo-1548199973-03cce0bbc87b',
  'dog collar': 'photo-1548199973-03cce0bbc87b',
  'dog paw cleaner': 'photo-1548199973-03cce0bbc87b',
  'pet hair remover': 'photo-1548199973-03cce0bbc87b',
  'automatic cat feeder': 'photo-1548199973-03cce0bbc87b',
  'automatic pet': 'photo-1548199973-03cce0bbc87b',

  // Home / Bedroom
  'laptop stand': 'photo-1593642632559-0c6d3fc62b89',
  'under desk foot': 'photo-1593642632559-0c6d3fc62b89',
  'portable neck fan': 'photo-1621905252507-b35492cc74b4',
  'clothes steamer': 'photo-1620799140408-edc6dcb6d633',
  'fabric shaver': 'photo-1620799140408-edc6dcb6d633',
  'hair brush': 'photo-1596462502278-27bfdc403348',
  'makeup organizer': 'photo-1596462502278-27bfdc403348',
  'bamboo wireless': 'photo-1587829741301-dc798b83add3',
  'wireless charging mouse': 'photo-1587829741301-dc798b83add3',
  'air purifier': 'photo-1621905252507-b35492cc74b4',

  // Garden / Outdoor
  'solar powered garden': 'photo-1416879595882-3373a0480b5b',
  'camping chair': 'photo-1504280390367-361c6d9f38f4',
  'reusable mesh': 'photo-1584464491033-06628f3a6b7b',

  // Health / Medical
  'anti-snoring': 'photo-1591672299888-e16a08b6c7ce',
  'mosquito killer': 'photo-1621905252507-b35492cc74b4',
  'electric fly swatter': 'photo-1621905252507-b35492cc74b4',

  // Wine / Bar
  'wine opener': 'photo-1510812431401-41d2bd2722f3',

  // Office / Stationery
  'a4 paper': 'photo-1586281380349-632531db7ed4',

  // Default fallback
  'default': 'photo-1523275335684-37898b6baf30',
};

function getImageUrl(title: string): string {
  const t = title.toLowerCase();
  for (const [keyword, photoId] of Object.entries(imageMap)) {
    if (keyword === 'default') continue;
    if (t.includes(keyword)) {
      return `https://images.unsplash.com/${photoId}?w=400&q=80&fit=crop`;
    }
  }
  // Final fallback: use title hash to pick a varied generic product image
  const fallbacks = [
    'photo-1523275335684-37898b6baf30', // watch
    'photo-1608043152269-423dbba4e7e1', // speaker
    'photo-1556909114-f6e7ad7d3136',    // kitchen
    'photo-1587829741301-dc798b83add3', // tech
    'photo-1476480862126-209bfaa8edc8', // fitness
    'photo-1584813470613-5b1c1cad3d69', // home
    'photo-1612817288484-6f916006741a', // beauty
  ];
  const idx = title.charCodeAt(0) % fallbacks.length;
  return `https://images.unsplash.com/${fallbacks[idx]}?w=400&q=80&fit=crop`;
}

async function main() {
  console.log('Fetching all products from database...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, image');

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log(`Found ${products?.length} products. Updating images...`);
  let updated = 0;
  let skipped = 0;

  for (const product of (products || [])) {
    const newImageUrl = getImageUrl(product.title);
    const { error: updateError } = await supabase
      .from('products')
      .update({ image: newImageUrl })
      .eq('id', product.id);

    if (updateError) {
      console.error(`Failed to update ${product.title}:`, updateError.message);
    } else {
      console.log(`✓ ${product.title.slice(0, 50)}`);
      updated++;
    }
  }

  console.log(`\nDone! Updated ${updated} products, skipped ${skipped}.`);
}

main();
