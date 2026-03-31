import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getImageUrl(title: string): string {
  const t = title.toLowerCase();

  const rules: [string, string][] = [
    ['yoga',            'https://images.unsplash.com/photo-1601925228869-d66e9a4e97d7?w=400&q=80&fit=crop'],
    ['car headrest',    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80&fit=crop'],
    ['diffuser',        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80&fit=crop'],
    ['knee',            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop'],
    ['wine opener',     'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80&fit=crop'],
    ['soap dispenser',  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80&fit=crop'],
    ['vacuum',          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop'],
    ['foot file',       'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80&fit=crop'],
    ['eyelash',         'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&fit=crop'],
    ['padlock',         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop'],
    ['car trunk',       'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80&fit=crop'],
    ['teeth whitening', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&fit=crop'],
    ['door lock',       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop'],
    ['kettle',          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80&fit=crop'],
    ['baby bib',        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80&fit=crop'],
    ['phone holder',    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80&fit=crop'],
    ['blender',         'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80&fit=crop'],
    ['magnetic phone',  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80&fit=crop'],
    ['water bottle',    'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80&fit=crop'],
    ['foot hammock',    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80&fit=crop'],
    ['mirror',          'https://images.unsplash.com/photo-1614622596809-c73d4afc9c5a?w=400&q=80&fit=crop'],
    ['salt pepper',     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&fit=crop'],
    ['baby food',       'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80&fit=crop'],
    ['snoring',         'https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?w=400&q=80&fit=crop'],
    ['bluetooth speaker','https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80&fit=crop'],
    ['pet water',       'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
    ['plant',           'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80&fit=crop'],
    ['toothbrush',      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&fit=crop'],
    ['posture',         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop'],
    ['eye mask',        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop'],
    ['sunset lamp',     'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80&fit=crop'],
    ['projection lamp', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80&fit=crop'],
    ['screen door',     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop'],
    ['laptop stand',    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80&fit=crop'],
    ['led strip',       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop'],
    ['kids toy',        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&fit=crop'],
    ['inflatable',      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&fit=crop'],
    ['plush',           'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop'],
    ['vegetable chopper','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&fit=crop'],
    ['a4 paper',        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80&fit=crop'],
    ['neck pillow',     'https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?w=400&q=80&fit=crop'],
    ['gua sha',         'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop'],
    ['vibration',       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop'],
    ['leather',         'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=400&q=80&fit=crop'],
    ['derma roller',    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop'],
    ['eyelashes',       'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&fit=crop'],
    ['eye massager',    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop'],
    ['usb c hub',       'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop'],
    ['camping chair',   'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80&fit=crop'],
    ['dash cam',        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80&fit=crop'],
    ['cat toy',         'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
    ['tire inflator',   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80&fit=crop'],
    ['body fat scale',  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&fit=crop'],
    ['tripod',          'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400&q=80&fit=crop'],
    ['ring light',      'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400&q=80&fit=crop'],
    ['clothes steamer', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80&fit=crop'],
    ['night light',     'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80&fit=crop'],
    ['neck fan',        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80&fit=crop'],
    ['pull up',         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80&fit=crop'],
    ['pet hair',        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
    ['baby monitor',    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80&fit=crop'],
    ['montessori',      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&fit=crop'],
    ['security camera', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop'],
    ['dog leash',       'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
    ['winter gloves',   'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=400&q=80&fit=crop'],
    ['dog collar',      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
    ['hair brush',      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&fit=crop'],
    ['air purifier',    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80&fit=crop'],
    ['fabric shaver',   'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80&fit=crop'],
    ['uv sterilizer',   'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop'],
    ['heated blanket',  'https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?w=400&q=80&fit=crop'],
    ['makeup organizer','https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&fit=crop'],
    ['wireless charging','https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop'],
    ['cat scratching',  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
    ['vitamin c serum', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop'],
    ['resistance band', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80&fit=crop'],
    ['lunch box',       'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&fit=crop'],
    ['massage gun',     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop'],
    ['wireless keyboard','https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop'],
    ['silicone stretch', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&fit=crop'],
    ['solar',           'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80&fit=crop'],
    ['jump rope',       'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80&fit=crop'],
    ['baby nasal',      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80&fit=crop'],
    ['fly swatter',     'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80&fit=crop'],
    ['mosquito',        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80&fit=crop'],
    ['acupressure',     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop'],
    ['backpack',        'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=400&q=80&fit=crop'],
    ['reusable mesh',   'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=400&q=80&fit=crop'],
    ['earbuds',         'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80&fit=crop'],
    ['smart water',     'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80&fit=crop'],
    ['cat feeder',      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
    ['running belt',    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80&fit=crop'],
    ['projector',       'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&q=80&fit=crop'],
    ['knee compression','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop'],
    ['baby milestone',  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80&fit=crop'],
    ['tumbler',         'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80&fit=crop'],
    ['bamboo',          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop'],
    ['drawing tablet',  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&fit=crop'],
    ['milk frother',    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&fit=crop'],
    ['facial cleansing','https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop'],
    ['smart watch',     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&fit=crop'],
    ['scalp massager',  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&fit=crop'],
    ['ice roller',      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop'],
    ['phone sanitizer', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop'],
    ['dog paw',         'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80&fit=crop'],
  ];

  for (const [keyword, url] of rules) {
    if (t.includes(keyword)) return url;
  }

  // Varied fallback by first char
  const fallbacks = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&fit=crop',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&fit=crop',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80&fit=crop',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop',
  ];
  return fallbacks[title.charCodeAt(0) % fallbacks.length];
}

async function main() {
  // Only update trending products
  const { data: meta, error: metaError } = await supabase
    .from('product_metadata')
    .select('product_id')
    .eq('is_trending', true);

  if (metaError) { console.error(metaError); process.exit(1); }
  const ids = (meta || []).map((m: any) => m.product_id);
  console.log(`Found ${ids.length} trending products`);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title')
    .in('id', ids);

  if (error) { console.error(error); process.exit(1); }

  for (const product of (products || [])) {
    const url = getImageUrl(product.title);
    const { error: e } = await supabase.from('products').update({ image: url }).eq('id', product.id);
    if (e) console.error(`✗ ${product.title}:`, e.message);
    else console.log(`✓ ${product.title.slice(0, 50)}`);
  }
  console.log('Done!');
}

main();
