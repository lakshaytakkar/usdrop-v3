-- Amazon Bestseller Products Import
-- Generated on 2025-12-15T07:00:47.547Z
-- Total products: 100

-- First, ensure categories exist
INSERT INTO categories (id, name, slug, description, trending, product_count, created_at, updated_at)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gadgets', 'gadgets', 'Electronics and tech gadgets', true, 0, NOW(), NOW()),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Home Decor', 'home-decor', 'Home decoration and furnishing', true, 0, NOW(), NOW()),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Kitchen', 'kitchen', 'Kitchen appliances and tools', false, 0, NOW(), NOW()),
  ('d4e5f6a7-b8c9-0123-def1-234567890123', 'Home & Garden', 'home-garden', 'Garden and outdoor products', false, 0, NOW(), NOW()),
  ('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Beauty', 'beauty', 'Beauty and personal care', true, 0, NOW(), NOW()),
  ('f6a7b8c9-d0e1-2345-f123-456789012345', 'Sports & Fitness', 'sports-fitness', 'Sports and fitness equipment', false, 0, NOW(), NOW()),
  ('a7b8c9d0-e1f2-3456-0123-567890123456', 'Fashion', 'fashion', 'Clothing and accessories', true, 0, NOW(), NOW()),
  ('b8c9d0e1-f2a3-4567-1234-678901234567', 'Pets', 'pets', 'Pet supplies and accessories', false, 0, NOW(), NOW()),
  ('c9d0e1f2-a3b4-5678-2345-789012345678', 'Mother & Kids', 'mother-kids', 'Baby and kids products', false, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Insert products

-- Product 1: L5B83H Replacement Voice Remote Control (2nd Gen) ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000001',
  'L5B83H Replacement Voice Remote Control (2nd Gen) with Power and Volume Control fit for AMZ 2nd Gen Fire Smart TVs Stick,AMZ TV Cube 2nd Gen and 1st Gen, AMZ Smart TV Stick 4K, and 3rd Gen AMZ TV',
  'https://m.media-amazon.com/images/I/612mK-DaNmL.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.08,
  11.98,
  6.90,
  ARRAY[]::text[],
  NULL,
  4.5,
  73,
  ARRAY[741, 650, 620, 750, 715, 707, 733]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000001',
  '11111111-1111-1111-1111-000000000001',
  'scraped',
  'B0CR9TDHCT',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000001',
  '11111111-1111-1111-1111-000000000001',
  true,
  false,
  57.6,
  2124,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 2: Pink Graduation Decorations Backdrop Banner Gradua...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000002',
  'Pink Graduation Decorations Backdrop Banner Graduation Decorations Class of 2024 Pink Graduation Party Decorations Party Favors Backdrop Photography Background for Congrats Grad',
  'https://m.media-amazon.com/images/I/71N-BEYzm9L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  8.06,
  13.99,
  5.93,
  ARRAY[]::text[],
  NULL,
  4.7,
  8,
  ARRAY[116, 287, 273, 218, 202, 266, 110]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000002',
  '11111111-1111-1111-1111-000000000002',
  'scraped',
  'B0CZ99YTX7',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000002',
  '11111111-1111-1111-1111-000000000002',
  true,
  false,
  42.4,
  4651,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 3: Wireless av Transmitter and Receiver measy AV530 T...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000003',
  'Wireless av Transmitter and Receiver measy AV530 TV Transmitter and Receiver up to 300m/1000ft to Camera,Monitor,TV - Silver, RCA Extender',
  'https://m.media-amazon.com/images/I/51TKFZ9ECgL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  27.63,
  67.99,
  40.36,
  ARRAY[]::text[],
  NULL,
  3.9,
  169,
  ARRAY[749, 712, 739, 819, 750, 750, 714]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000003',
  '11111111-1111-1111-1111-000000000003',
  'scraped',
  'B07L9PKCJL',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000003',
  '11111111-1111-1111-1111-000000000003',
  false,
  false,
  59.4,
  242,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 4: Fingerprint Card Holder | For FD-258 Cards | Secur...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000004',
  'Fingerprint Card Holder | For FD-258 Cards | Securely Locks Card in Place | Durable, Sturdy Plastic Construction',
  'https://m.media-amazon.com/images/I/61Ssokcjp8L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6.64,
  15.00,
  8.36,
  ARRAY[]::text[],
  NULL,
  2.2,
  2,
  ARRAY[853, 817, 981, 930, 984, 987, 819]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000004',
  '11111111-1111-1111-1111-000000000004',
  'scraped',
  'B0BWSHXFFP',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000004',
  '11111111-1111-1111-1111-000000000004',
  false,
  false,
  55.7,
  1146,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 5: Lightning to 3.5mm Audio Cable iPhone Headphones J...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000005',
  'Lightning to 3.5mm Audio Cable iPhone Headphones Jack Lightning Aux Cord Compatible with iPhone 14 13 12 11 XS X 8 7 6 iPad iPod for Car Home Stereo, Speaker, Headphone(3.3FT), Black',
  'https://m.media-amazon.com/images/I/41B0U7GfsYL._SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3.34,
  5.99,
  2.65,
  ARRAY[]::text[],
  NULL,
  4.9,
  16,
  ARRAY[979, 917, 1014, 996, 989, 910, 879]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000005',
  '11111111-1111-1111-1111-000000000005',
  'scraped',
  'B0D22SK7G5',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000005',
  '11111111-1111-1111-1111-000000000005',
  false,
  false,
  44.2,
  717,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 6: Pyle Universal Car Dual Headrest Monitor - 9.4 Inc...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000006',
  'Pyle Universal Car Dual Headrest Monitor - 9.4 Inch Vehicle Multimedia CD DVD Player with Wireless Headphones - Audio Video Entertainment w/HDMI, Wide TV LCD Screen, Mounting Bracket - PLHRDVD90KT',
  'https://m.media-amazon.com/images/I/81WnWRbTJ5L.__AC_SY300_SX300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  116.42,
  238.65,
  122.23,
  ARRAY[]::text[],
  NULL,
  3.9,
  282,
  ARRAY[1083, 1049, 1028, 984, 1042, 1087, 1150]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000006',
  '11111111-1111-1111-1111-000000000006',
  'scraped',
  'B07BSMLVG1',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000006',
  '11111111-1111-1111-1111-000000000006',
  true,
  false,
  51.2,
  3895,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 7: iFixit Screen Digitizer Compatible with iPad 6 - R...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000007',
  'iFixit Screen Digitizer Compatible with iPad 6 - Repair Kit - Black',
  'https://m.media-amazon.com/images/I/71Va5i6F+9L._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  18.47,
  44.99,
  26.52,
  ARRAY[]::text[],
  NULL,
  4.2,
  14,
  ARRAY[196, 148, 93, 159, 53, 61, 159]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000007',
  '11111111-1111-1111-1111-000000000007',
  'scraped',
  'B08R5YMDJV',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000007',
  '11111111-1111-1111-1111-000000000007',
  true,
  false,
  58.9,
  1944,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 8: Mobile Film Scanner, 35mm Positive & Negative Scan...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000008',
  'Mobile Film Scanner, 35mm Positive & Negative Scanner, Slide Scanner for Old Slides Using Your Smartphone Camera, Novelty Rugged Plastic Folding Slide Scanner with LED Backlight',
  'https://m.media-amazon.com/images/I/713cJrzr7tL.__AC_SY300_SX300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4.18,
  8.99,
  4.81,
  ARRAY[]::text[],
  NULL,
  3.5,
  159,
  ARRAY[838, 789, 839, 934, 876, 800, 836]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000008',
  '11111111-1111-1111-1111-000000000008',
  'scraped',
  'B0CVVX3X73',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000008',
  '11111111-1111-1111-1111-000000000008',
  true,
  false,
  53.5,
  111,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 9: Headband Magnifier Glasses LED Watch Repair Magnif...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000009',
  'Headband Magnifier Glasses LED Watch Repair Magnifier Loupe Jeweler Glasses Tool Set with LED Light 10 X 15X 20 X 25X',
  'https://m.media-amazon.com/images/I/51vA0PY82KL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  11.60,
  20.99,
  9.39,
  ARRAY[]::text[],
  NULL,
  4.8,
  246,
  ARRAY[822, 722, 830, 737, 812, 875, 842]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000009',
  '11111111-1111-1111-1111-000000000009',
  'scraped',
  'B09XB11BK8',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000009',
  '11111111-1111-1111-1111-000000000009',
  false,
  false,
  44.7,
  4457,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 10: Mission Machines S-100 Business Phone System: Adva...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000010',
  'Mission Machines S-100 Business Phone System: Advanced Pack - Auto Attendant/Voicemail, Cell & Remote Phone Extensions, Call Recording & Mission Machines Phone Service for 2 Month (6 Phone Bundle)',
  'https://m.media-amazon.com/images/I/71b0vu6gl2S.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  548.63,
  999.88,
  451.25,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[852, 754, 828, 765, 707, 739, 854]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000010',
  '11111111-1111-1111-1111-000000000010',
  'scraped',
  'B096WJJP1P',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000010',
  '11111111-1111-1111-1111-000000000010',
  false,
  false,
  45.1,
  1969,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 11: FALUBS USB C to HDMI Adapter, 4K Video Converter w...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000011',
  'FALUBS USB C to HDMI Adapter, 4K Video Converter with 3.0 and Type-C Charging Port, USB-C Digital AV Multiport Adapter for Mac Devices (Silver)',
  'https://m.media-amazon.com/images/I/61Ym+ZMdkXL._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  9.13,
  19.99,
  10.86,
  ARRAY[]::text[],
  NULL,
  4.8,
  19746,
  ARRAY[564, 658, 659, 652, 491, 478, 610]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000011',
  '11111111-1111-1111-1111-000000000011',
  'scraped',
  'B0BLQJX17Z',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000011',
  '11111111-1111-1111-1111-000000000011',
  false,
  false,
  54.3,
  4169,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 12: Smart Board, 65 Interactive Digital Whiteboard, El...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000012',
  'Smart Board, 65 Interactive Digital Whiteboard, Electronic Smartboard with Dual System, 4K Touchscreen, Built-in 20MP Camera, for Classroom Office Home (Wall Mount Included)',
  'https://m.media-amazon.com/images/I/71kg6ZJzHqL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  988.96,
  2299.99,
  1311.03,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[590, 626, 707, 705, 549, 551, 690]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000012',
  '11111111-1111-1111-1111-000000000012',
  'scraped',
  'B0DJ6XDS8F',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000012',
  '11111111-1111-1111-1111-000000000012',
  false,
  false,
  57.0,
  1089,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 13: Copper Wires PS/2 Extension Cable, Mini Din 6pin M...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000013',
  'Copper Wires PS/2 Extension Cable, Mini Din 6pin Male to Female Cable for Computer PC Keyboard/Mouse/KVM & More 6ft（ M/F 2M）',
  'https://m.media-amazon.com/images/I/41ekTnmTwqL._SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.73,
  9.99,
  4.26,
  ARRAY[]::text[],
  NULL,
  4.5,
  140,
  ARRAY[576, 685, 695, 578, 666, 620, 681]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000013',
  '11111111-1111-1111-1111-000000000013',
  'scraped',
  'B092S74DPR',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000013',
  '11111111-1111-1111-1111-000000000013',
  false,
  false,
  42.6,
  4200,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 14: GeekShare Cat Paw Controller Skin Grips Set Anti-S...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000014',
  'GeekShare Cat Paw Controller Skin Grips Set Anti-Slip Silicone Protective Cover Skin Case Compatible with Xbox Series X Controller with 2 Thumb Grip Caps and 1 Sticker (Grey)',
  'https://m.media-amazon.com/images/I/61PpjMHW1+L._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6.83,
  16.14,
  9.31,
  ARRAY[]::text[],
  NULL,
  4.9,
  319,
  ARRAY[989, 1067, 1160, 1052, 1156, 1058, 1134]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000014',
  '11111111-1111-1111-1111-000000000014',
  'scraped',
  'B0C4KZQN3V',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000014',
  '11111111-1111-1111-1111-000000000014',
  true,
  false,
  57.7,
  1346,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 15: Canon imagePROGRAF TC-20 – Single Function Printer...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000015',
  'Canon imagePROGRAF TC-20 – Single Function Printer | 24 Large Format Poster & Plotter Printer - Automatic Roll & Cut Sheet Paper Feeder, USB, Wi-Fi, LAN,White',
  'https://m.media-amazon.com/images/I/71AucuuWrdL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  369.11,
  699.00,
  329.89,
  ARRAY[]::text[],
  NULL,
  3.9,
  116,
  ARRAY[275, 278, 161, 261, 149, 253, 257]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000015',
  '11111111-1111-1111-1111-000000000015',
  'scraped',
  'B0BSTTZR1Y',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000015',
  '11111111-1111-1111-1111-000000000015',
  false,
  false,
  47.2,
  2260,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 16: ESSLNB Digital Night Vision Monocular, Travel Infr...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000016',
  'ESSLNB Digital Night Vision Monocular, Travel Infrared Monocular for 100% Darkness, Portable Night Vision Goggles for Day & Night Hunting, Camping, Surveillance, 1080P Full HD Photo & Video',
  'https://m.media-amazon.com/images/I/916HSKzdGIL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  35.68,
  75.99,
  40.31,
  ARRAY[]::text[],
  NULL,
  3.9,
  529,
  ARRAY[1073, 1021, 1016, 1053, 1011, 1044, 1123]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000016',
  '11111111-1111-1111-1111-000000000016',
  'scraped',
  'B0BTCNS4ZN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000016',
  '11111111-1111-1111-1111-000000000016',
  false,
  false,
  53.0,
  4111,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 17: Smart Ring Fitness Tracker Ring for Women Men, Mul...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000017',
  'Smart Ring Fitness Tracker Ring for Women Men, Multiple Sport Modes Fitness Ring with Heart Rate Sleep Monitor, IP68 Waterproof Step Counter Calorie Tracking Ring for Android iOS Phone,Gold-9',
  'https://m.media-amazon.com/images/I/71Zyg9ccacL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  19.08,
  39.99,
  20.91,
  ARRAY[]::text[],
  NULL,
  5.0,
  8,
  ARRAY[803, 856, 914, 813, 797, 808, 796]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000017',
  '11111111-1111-1111-1111-000000000017',
  'scraped',
  'B0D2J45BR7',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000017',
  '11111111-1111-1111-1111-000000000017',
  false,
  false,
  52.3,
  3130,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 18: 24V AC/DC Adapter for Microsoft Xbox 360 X809215-0...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000018',
  '24V AC/DC Adapter for Microsoft Xbox 360 X809215-001 X Box 360 X809215001 X813207-001 Steering Wheel 24VDC Power Cord Charger PSU',
  'https://m.media-amazon.com/images/I/515qanCHvwL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2.83,
  6.99,
  4.16,
  ARRAY[]::text[],
  NULL,
  4.7,
  89,
  ARRAY[780, 716, 681, 770, 786, 722, 642]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000018',
  '11111111-1111-1111-1111-000000000018',
  'scraped',
  'B087RGRM4L',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000018',
  '11111111-1111-1111-1111-000000000018',
  false,
  false,
  59.5,
  2943,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 19: Remote Control for Smart LightRaise 60wi Projector...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000019',
  'Remote Control for Smart LightRaise 60wi Projector',
  'https://m.media-amazon.com/images/I/51uO-VOBo3L.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  18.55,
  31.11,
  12.56,
  ARRAY[]::text[],
  NULL,
  3.9,
  299,
  ARRAY[637, 721, 717, 702, 663, 738, 666]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000019',
  '11111111-1111-1111-1111-000000000019',
  'scraped',
  'B07FZPGS81',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000019',
  '11111111-1111-1111-1111-000000000019',
  false,
  false,
  40.4,
  2025,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 20: PS5 Skin - Disc Edition Anime Console and Controll...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000020',
  'PS5 Skin - Disc Edition Anime Console and Controller Accessories Cover Skins PS5 Controller Skin Gift ps5 Skins for Console Full Set Blue and Orange ps5 Skin',
  'https://m.media-amazon.com/images/I/61EIWc3dOAL.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  7.57,
  17.98,
  10.41,
  ARRAY[]::text[],
  NULL,
  4.2,
  193,
  ARRAY[416, 370, 387, 456, 319, 411, 355]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000020',
  '11111111-1111-1111-1111-000000000020',
  'scraped',
  'B0BTSP1XRJ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000020',
  '11111111-1111-1111-1111-000000000020',
  false,
  false,
  57.9,
  867,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 21: Charger for Nintendo Switch, Fast Travel Charger C...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000021',
  'Charger for Nintendo Switch, Fast Travel Charger Compatible with Nintendo Switch/Switch Lite/Switch OLED/Switch Dock',
  'https://m.media-amazon.com/images/I/61fgZC1jsJL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4.65,
  8.99,
  4.34,
  ARRAY[]::text[],
  NULL,
  4.4,
  169,
  ARRAY[844, 887, 868, 779, 887, 927, 863]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000021',
  '11111111-1111-1111-1111-000000000021',
  'scraped',
  'B0C53TM8ZB',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000021',
  '11111111-1111-1111-1111-000000000021',
  true,
  false,
  48.3,
  1921,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 22: Pioneer AVH-2400NEX 7 inches DVD Receiver Apple Ca...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000022',
  'Pioneer AVH-2400NEX 7 inches DVD Receiver Apple CarPlay & Android Auto Compatible (Renewed)',
  'https://m.media-amazon.com/images/I/41ATTljLeXL.__AC_SY300_SX300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  158.21,
  349.99,
  191.78,
  ARRAY[]::text[],
  NULL,
  4.4,
  39,
  ARRAY[138, 203, 230, 191, 192, 161, 204]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000022',
  '11111111-1111-1111-1111-000000000022',
  'scraped',
  'B082YFPGVN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000022',
  '11111111-1111-1111-1111-000000000022',
  true,
  false,
  54.8,
  3846,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 23: Canon EOS 90D DSLR Camera w/EF-S 18-55mm F/4-5.6 S...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000023',
  'Canon EOS 90D DSLR Camera w/EF-S 18-55mm F/4-5.6 STM + 75-300mm F/4-5.6 III + 128GB Pro Speed Memory + Led Video Light + DME 100 Microphone +Case + Tripod + Software Pack-Video Bundle',
  'https://m.media-amazon.com/images/I/91bvG7LBB2L.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  712.92,
  1379.00,
  666.08,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[1097, 1073, 1018, 1079, 1102, 1099, 988]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000023',
  '11111111-1111-1111-1111-000000000023',
  'scraped',
  'B0CJJWP62L',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000023',
  '11111111-1111-1111-1111-000000000023',
  true,
  false,
  48.3,
  500,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 24: E-MOD GAMING 13 in 1 Metal Thumbsticks, D-Pads and...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000024',
  'E-MOD GAMING 13 in 1 Metal Thumbsticks, D-Pads and Paddles with Tools for Elite Series 2 Controller Xbox One - Black',
  'https://m.media-amazon.com/images/I/61gYjDwHkqL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  11.36,
  23.99,
  12.63,
  ARRAY[]::text[],
  NULL,
  4.4,
  562,
  ARRAY[122, 156, 180, 268, 86, 124, 115]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000024',
  '11111111-1111-1111-1111-000000000024',
  'scraped',
  'B088BHLJFL',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000024',
  '11111111-1111-1111-1111-000000000024',
  true,
  false,
  52.6,
  2951,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 25: 12V Car Heater Fan,Portable Fast Heating Auto Car ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000025',
  '12V Car Heater Fan,Portable Fast Heating Auto Car Heater Defroster Windshield Defogger Automobile Windscreen Heater Plug in Cigarette Lighter 360 Degree Rotary (Red&Black)',
  'https://m.media-amazon.com/images/I/718jvUyUbpL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  10.51,
  23.99,
  13.48,
  ARRAY[]::text[],
  NULL,
  5.0,
  3,
  ARRAY[746, 798, 823, 789, 816, 781, 843]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000025',
  '11111111-1111-1111-1111-000000000025',
  'scraped',
  'B0DR2LV3FS',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000025',
  '11111111-1111-1111-1111-000000000025',
  false,
  false,
  56.2,
  3653,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 26: USB Cable Charging Cable for Razer Raiju PS4 Gamin...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000026',
  'USB Cable Charging Cable for Razer Raiju PS4 Gaming Controller and Razer Wolverine Xbox One Gaming Controller',
  'https://m.media-amazon.com/images/I/41BAPezEUuL._SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  9.59,
  15.99,
  6.40,
  ARRAY[]::text[],
  NULL,
  3.7,
  23,
  ARRAY[906, 853, 1006, 844, 899, 893, 890]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000026',
  '11111111-1111-1111-1111-000000000026',
  'scraped',
  'B08DY6K7H1',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000026',
  '11111111-1111-1111-1111-000000000026',
  false,
  false,
  40.0,
  2062,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 27: Digital Camera, FHD 1080P Kids Camera with 32GB Ca...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000027',
  'Digital Camera, FHD 1080P Kids Camera with 32GB Card, Digital Point and Shoot Cameras with 16X Zoom Anti Shake, 48MP 2.8 Inch LCD Screen, Gift for Teens Boys Girls',
  'https://m.media-amazon.com/images/I/61xURl84xOL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  24.76,
  49.99,
  25.23,
  ARRAY[]::text[],
  NULL,
  4.3,
  99,
  ARRAY[255, 203, 249, 265, 124, 280, 140]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000027',
  '11111111-1111-1111-1111-000000000027',
  'scraped',
  'B0CY49TV77',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000027',
  '11111111-1111-1111-1111-000000000027',
  false,
  false,
  50.5,
  3712,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 28: 2PCS CF1015H12D 12V 0.42A 95MM RX 580 Nitro Mining...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000028',
  '2PCS CF1015H12D 12V 0.42A 95MM RX 580 Nitro Mining Edition VGA Fan for Sapphire RX 470 480 570 580 590 Graphics Card Cooling Fan (2PCS Blue LED Fan)',
  'https://m.media-amazon.com/images/I/51T9NK57KXL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  9.53,
  19.98,
  10.45,
  ARRAY[]::text[],
  NULL,
  4.6,
  36,
  ARRAY[613, 591, 577, 517, 533, 630, 542]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000028',
  '11111111-1111-1111-1111-000000000028',
  'scraped',
  'B08L6QTZXY',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000028',
  '11111111-1111-1111-1111-000000000028',
  true,
  false,
  52.3,
  4323,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 29: AmScope T720 40X-1000X Plan Infinity Kohler Labora...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000029',
  'AmScope T720 40X-1000X Plan Infinity Kohler Laboratory Trinocular Compound Microscope',
  'https://m.media-amazon.com/images/I/71QrHAm43tL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  382.54,
  868.99,
  486.45,
  ARRAY[]::text[],
  NULL,
  2.2,
  3,
  ARRAY[269, 320, 277, 282, 300, 268, 164]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000029',
  '11111111-1111-1111-1111-000000000029',
  'scraped',
  'B00VTUF3BG',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000029',
  '11111111-1111-1111-1111-000000000029',
  false,
  false,
  56.0,
  2022,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 30: Bike Phone Mount - Phone Holder for Bike, Phone St...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000030',
  'Bike Phone Mount - Phone Holder for Bike, Phone Stand for Motorcycle, Silicone Phone Holder for Handlebar Compatible with iPhone/ Samsung/ Huawei/GPS, Adjustable 360 Degree Rotation Phone Stroller',
  'https://m.media-amazon.com/images/I/61HsbwzByKL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4.86,
  9.99,
  5.13,
  ARRAY[]::text[],
  NULL,
  4.3,
  592,
  ARRAY[350, 296, 271, 313, 380, 287, 343]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000030',
  '11111111-1111-1111-1111-000000000030',
  'scraped',
  'B08B4HTG79',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000030',
  '11111111-1111-1111-1111-000000000030',
  false,
  false,
  51.4,
  4367,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 31: Hard Case Compatible with Texas Instruments TI-84 ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000031',
  'Hard Case Compatible with Texas Instruments TI-84 Plus CE/TI-84 Plus/TI-Nspire CX II CAS/TI-Nspire CX II/TI-83 Plus/TI-85 /TI-86 /TI30xs /TI36X Pro/TI 34 Color Graphing Calculator by XANAD (Black)',
  'https://m.media-amazon.com/images/I/81Gc4+eLl-L._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.90,
  12.99,
  7.09,
  ARRAY[]::text[],
  NULL,
  4.4,
  63,
  ARRAY[1063, 1048, 874, 983, 949, 927, 992]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000031',
  '11111111-1111-1111-1111-000000000031',
  'scraped',
  'B0C5RJYHRG',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000031',
  '11111111-1111-1111-1111-000000000031',
  false,
  false,
  54.6,
  1815,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 32: TRUMiRR Titanium Band for Fenix 7 Pro Sapphire Sol...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000032',
  'TRUMiRR Titanium Band for Fenix 7 Pro Sapphire Solar / 6 Pro / 5 Plus, 22mm Quick Fit Watchband Integrated Buckle Strap for Garmin Fenix 7 6 5 / Epix Pro 47mm / Instinct 2 / Approach S70 / Forerunner ',
  'https://m.media-amazon.com/images/I/71JwLCbudXL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  19.96,
  37.99,
  18.03,
  ARRAY[]::text[],
  NULL,
  4.1,
  29,
  ARRAY[538, 541, 551, 575, 585, 687, 589]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000032',
  '11111111-1111-1111-1111-000000000032',
  'scraped',
  'B0CDWQ3HSR',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000032',
  '11111111-1111-1111-1111-000000000032',
  true,
  false,
  47.5,
  1871,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 33: zzovito Wall Mount Phone Holder, Adjustable Extend...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000033',
  'zzovito Wall Mount Phone Holder, Adjustable Extendable Shower/Mirror Cellphone Holder/Mount/Stand, Stable Anti-Slip High Adhesion Sturdy, Compatible with iPhone Series or Other Smartphones',
  'https://m.media-amazon.com/images/I/61KjZym3ujL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2.55,
  5.99,
  3.44,
  ARRAY[]::text[],
  NULL,
  3.9,
  402,
  ARRAY[429, 278, 280, 241, 398, 417, 290]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000033',
  '11111111-1111-1111-1111-000000000033',
  'scraped',
  'B09YY3LRRR',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000033',
  '11111111-1111-1111-1111-000000000033',
  false,
  false,
  57.4,
  1973,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 34: Microsoft Xbox Wireless Controller Stellar Shift -...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000034',
  'Microsoft Xbox Wireless Controller Stellar Shift - Wireless & Bluetooth Connectivity - New Hybrid D-Pad - New Share Button - Featuring Textured Grip - Easily Pair & Switch Between Devices',
  'https://m.media-amazon.com/images/I/41U1Tjn0X4L._SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  29.51,
  69.99,
  40.48,
  ARRAY[]::text[],
  NULL,
  4.7,
  3485,
  ARRAY[1015, 920, 915, 966, 1015, 1060, 922]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000034',
  '11111111-1111-1111-1111-000000000034',
  'scraped',
  'B0BV55WWMW',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000034',
  '11111111-1111-1111-1111-000000000034',
  false,
  false,
  57.8,
  3163,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 35: CAVEGER USB Microphone for Computer, PC/Laptop Mic...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000035',
  'CAVEGER USB Microphone for Computer, PC/Laptop Mic, Mute Button with LED Indicator, Plug &Play Desktop Microphone for Streaming, Recording, Dictation, Podcasting, YouTube, Skype, Games',
  'https://m.media-amazon.com/images/I/51oYmgarLaL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.99,
  13.99,
  8.00,
  ARRAY[]::text[],
  NULL,
  4.3,
  75,
  ARRAY[24, 121, 13, 200, 71, 167, 25]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000035',
  '11111111-1111-1111-1111-000000000035',
  'scraped',
  'B0C1NBTPKB',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000035',
  '11111111-1111-1111-1111-000000000035',
  false,
  false,
  57.2,
  2549,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 36: Car Heater Portable Car Heater Auto Heater Auto Po...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000036',
  'Car Heater Portable Car Heater Auto Heater Auto Portable Heater Plug Into Cigarette Lighter 2 in 1 Heating & Cooling Fan 12V 150W Car Heater 360°Rotatable Windshield Defrost Defogger for Cars (Black)',
  'https://m.media-amazon.com/images/I/610L3r1E-KL.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  10.24,
  20.99,
  10.75,
  ARRAY[]::text[],
  NULL,
  1.0,
  1,
  ARRAY[535, 654, 687, 530, 625, 581, 640]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000036',
  '11111111-1111-1111-1111-000000000036',
  'scraped',
  'B0D87KWFBZ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000036',
  '11111111-1111-1111-1111-000000000036',
  true,
  false,
  51.2,
  698,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 37: KUPO Front Box MOUNTING Plate for CONVI CLAMP (KG7...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000037',
  'KUPO Front Box MOUNTING Plate for CONVI CLAMP (KG705011)',
  'https://m.media-amazon.com/images/I/81eupQw3F-L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  17.45,
  38.95,
  21.50,
  ARRAY[]::text[],
  NULL,
  4.0,
  2,
  ARRAY[525, 473, 566, 529, 606, 535, 610]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000037',
  '11111111-1111-1111-1111-000000000037',
  'scraped',
  'B06XFQSQYT',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000037',
  '11111111-1111-1111-1111-000000000037',
  false,
  false,
  55.2,
  393,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 38: TP-Link Omada EAP650-Wall WiFi 6 AX3000 Access Poi...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000038',
  'TP-Link Omada EAP650-Wall WiFi 6 AX3000 Access Point, 1 Gigabit Ethernet Port, PoE Support 802.3af/at, Transparent Roaming, Omada Mesh',
  'https://m.media-amazon.com/images/I/51vwf0LSi2L.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  53.27,
  110.61,
  57.34,
  ARRAY[]::text[],
  NULL,
  4.3,
  8,
  ARRAY[800, 773, 936, 897, 949, 836, 918]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000038',
  '11111111-1111-1111-1111-000000000038',
  'scraped',
  'B0B8X3Y6RZ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000038',
  '11111111-1111-1111-1111-000000000038',
  false,
  false,
  51.8,
  896,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 39: Bone Conduction Headphones Amplifier Bluetooth 5.3...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000039',
  'Bone Conduction Headphones Amplifier Bluetooth 5.3 for Mild Hearing Impaired, Open Ear Wireless Headset, Hearing Amplifier Devices for Communication, Listen',
  'https://m.media-amazon.com/images/I/31ysQasZ4dL._SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  18.85,
  44.99,
  26.14,
  ARRAY[]::text[],
  NULL,
  4.1,
  41,
  ARRAY[1157, 1076, 1162, 1123, 1055, 1099, 975]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000039',
  '11111111-1111-1111-1111-000000000039',
  'scraped',
  'B0CR2Y747Q',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000039',
  '11111111-1111-1111-1111-000000000039',
  false,
  false,
  58.1,
  2322,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 40: BL-FP240E /SP.78V01GC01 Projector Lamp with Housin...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000040',
  'BL-FP240E /SP.78V01GC01 Projector Lamp with Housing for Optoma UHD60 UHD65 UHD50 UHD51A UHD51 UHD40 UHD300X UHD550X UHD400X Replacement Lamp',
  'https://m.media-amazon.com/images/I/61n0E1vUvZL.__AC_SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  20.92,
  36.88,
  15.96,
  ARRAY[]::text[],
  NULL,
  4.6,
  3,
  ARRAY[612, 517, 619, 598, 633, 656, 564]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000040',
  '11111111-1111-1111-1111-000000000040',
  'scraped',
  'B09W973RRL',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000040',
  '11111111-1111-1111-1111-000000000040',
  false,
  false,
  43.3,
  4441,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 41: Lenovo 2023 IdeaCentre Newest All-in-One Business ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000041',
  'Lenovo 2023 IdeaCentre Newest All-in-One Business Desktop, 27 FHD Touchscreen, Intel Core i7-13620H, 64GB RAM, 2TB SSD, Webcam, HDMI, Wi-Fi 6, Wireless Mouse & Keyboard, Windows 11 Pro',
  'https://m.media-amazon.com/images/I/61+TawMReHL._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  426.85,
  1065.00,
  638.15,
  ARRAY[]::text[],
  NULL,
  3.8,
  10,
  ARRAY[931, 1022, 912, 853, 886, 975, 982]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000041',
  '11111111-1111-1111-1111-000000000041',
  'scraped',
  'B0C6RDPVP1',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000041',
  '11111111-1111-1111-1111-000000000041',
  false,
  false,
  59.9,
  1874,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 42: XINRUISEN 3Pack Screen Protector for Steam Deck, T...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000042',
  'XINRUISEN 3Pack Screen Protector for Steam Deck, Tempered Glass Screen Protection Full Coverage Flim for Steam Deck 7inch, Ultra HD Bubble Free 9H Hardness Anti Scratch Easy to Install',
  'https://m.media-amazon.com/images/I/61ORl5A02aL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3.38,
  6.59,
  3.21,
  ARRAY[]::text[],
  NULL,
  4.5,
  122,
  ARRAY[142, 159, 158, 178, 66, 68, 67]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000042',
  '11111111-1111-1111-1111-000000000042',
  'scraped',
  'B09Y1L872F',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000042',
  '11111111-1111-1111-1111-000000000042',
  true,
  false,
  48.7,
  4205,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 43: LG SP2 2.1 Channel 100W Sound Bar with Built-in Su...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000043',
  'LG SP2 2.1 Channel 100W Sound Bar with Built-in Subwoofer in Fabric Wrapped Design – Black',
  'https://m.media-amazon.com/images/I/61dCmgjnuRS.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  58.33,
  139.99,
  81.66,
  ARRAY[]::text[],
  NULL,
  4.2,
  198,
  ARRAY[421, 333, 503, 340, 352, 483, 504]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000043',
  '11111111-1111-1111-1111-000000000043',
  'scraped',
  'B08ZCQRGR9',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000043',
  '11111111-1111-1111-1111-000000000043',
  true,
  false,
  58.3,
  3099,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 44: Maxell MiniDV 60 8-Pack...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000044',
  'Maxell MiniDV 60 8-Pack',
  'https://m.media-amazon.com/images/I/91kb8ojRqSL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  30.65,
  65.99,
  35.34,
  ARRAY[]::text[],
  NULL,
  4.4,
  21,
  ARRAY[67, 222, 231, 193, 58, 136, 101]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000044',
  '11111111-1111-1111-1111-000000000044',
  'scraped',
  'B000IM6LF8',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000044',
  '11111111-1111-1111-1111-000000000044',
  false,
  false,
  53.6,
  4701,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 45: Navionics NASA010R - Central America & Caribbean -...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000045',
  'Navionics NASA010R - Central America & Caribbean - Navionics+',
  'https://m.media-amazon.com/images/I/51Q1uPJCD1L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  48.83,
  95.02,
  46.19,
  ARRAY[]::text[],
  NULL,
  4.8,
  63,
  ARRAY[230, 146, 293, 262, 229, 271, 269]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000045',
  '11111111-1111-1111-1111-000000000045',
  'scraped',
  'B0CWYWWLK4',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000045',
  '11111111-1111-1111-1111-000000000045',
  false,
  false,
  48.6,
  3887,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 46: Fstop Labs 2 Pack Wall Ceiling Cabinet Mount Holde...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000046',
  'Fstop Labs 2 Pack Wall Ceiling Cabinet Mount Holder Stand Clip for Google Nest Home Mini Gen 1, Gen 2, Round Speaker Accessories (White) 2 Pack',
  'https://m.media-amazon.com/images/I/71N+p0x+HDL._AC_SX300_SY300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3.80,
  7.99,
  4.19,
  ARRAY[]::text[],
  NULL,
  4.7,
  2464,
  ARRAY[379, 481, 372, 441, 386, 369, 393]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000046',
  '11111111-1111-1111-1111-000000000046',
  'scraped',
  'B07B46JHJJ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000046',
  '11111111-1111-1111-1111-000000000046',
  false,
  false,
  52.4,
  3434,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 47: Avaya/Nortel M-Style Compatible Handset Black...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000047',
  'Avaya/Nortel M-Style Compatible Handset Black',
  'https://m.media-amazon.com/images/I/310OWLqvlgL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3.95,
  8.99,
  5.04,
  ARRAY[]::text[],
  NULL,
  4.8,
  7,
  ARRAY[428, 451, 303, 458, 408, 449, 325]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000047',
  '11111111-1111-1111-1111-000000000047',
  'scraped',
  'B076VNJG2C',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000047',
  '11111111-1111-1111-1111-000000000047',
  false,
  false,
  56.1,
  4069,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 48: Cameron Sino KCDE Replacement Battery for Garmin V...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000048',
  'Cameron Sino KCDE Replacement Battery for Garmin Vivoactive 3, Vivoactive 3 Music(160mAh / 0.59Wh)',
  'https://m.media-amazon.com/images/I/51DdGFMd8xL.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6.33,
  11.89,
  5.56,
  ARRAY[]::text[],
  NULL,
  4.8,
  373,
  ARRAY[1128, 1068, 1022, 1180, 1138, 1007, 1056]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000048',
  '11111111-1111-1111-1111-000000000048',
  'scraped',
  'B0CFY8D7VY',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000048',
  '11111111-1111-1111-1111-000000000048',
  false,
  false,
  46.8,
  4128,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 49: Succlin Hard Carrying Case for Quest 3, VR Headset...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000049',
  'Succlin Hard Carrying Case for Quest 3, VR Headset Travel Case for Quest 3 Accessories,Suitable for Travel and Home Storage',
  'https://m.media-amazon.com/images/I/41eWLP+aCFL._SX342_SY445_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  14.99,
  25.99,
  11.00,
  ARRAY[]::text[],
  NULL,
  4.9,
  53,
  ARRAY[524, 522, 612, 585, 614, 565, 522]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000049',
  '11111111-1111-1111-1111-000000000049',
  'scraped',
  'B0CJM7S5Y4',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000049',
  '11111111-1111-1111-1111-000000000049',
  true,
  false,
  42.3,
  4492,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 50: 2000mAh SOS Alarm Emergency Weather Radio, 3LED Ty...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000050',
  '2000mAh SOS Alarm Emergency Weather Radio, 3LED Type-C Hand Crank Solar Battery Operated Wind Up Radio Flashlight, NOAA AM FM Portable Radio Cell Phone Charger Survival Kit (Red)',
  'https://m.media-amazon.com/images/I/71pYBxdtRYL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  8.92,
  19.99,
  11.07,
  ARRAY[]::text[],
  NULL,
  4.5,
  1359,
  ARRAY[981, 938, 921, 990, 933, 1004, 1064]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000050',
  '11111111-1111-1111-1111-000000000050',
  'scraped',
  'B0888S823X',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000050',
  '11111111-1111-1111-1111-000000000050',
  false,
  false,
  55.4,
  4757,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 51: AIMSA Large Gaming Mouse Pad Set, Keyboard Wrist R...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000051',
  'AIMSA Large Gaming Mouse Pad Set, Keyboard Wrist Rest Support+ Extended Mousepad+ Mouse Wrist Cushion+Coaster, Ergonomic Multifunctional Desk Mat 35x15.7in, Butterfly Flowers Moon Phases',
  'https://m.media-amazon.com/images/I/81V9boqjfzL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  10.55,
  24.99,
  14.44,
  ARRAY[]::text[],
  NULL,
  4.7,
  340,
  ARRAY[131, 158, 91, 252, 247, 202, 189]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000051',
  '11111111-1111-1111-1111-000000000051',
  'scraped',
  'B0CPF5XMXN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000051',
  '11111111-1111-1111-1111-000000000051',
  false,
  false,
  57.8,
  1736,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 52: SolarLite Solar Filter for Telescope, fits Celestr...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000052',
  'SolarLite Solar Filter for Telescope, fits Celestron and Meade 8 Schmidt Cassegrain',
  'https://m.media-amazon.com/images/I/61muflKXovL.__AC_SY300_SX300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  59.61,
  124.00,
  64.39,
  ARRAY[]::text[],
  NULL,
  4.4,
  79,
  ARRAY[451, 506, 500, 488, 521, 429, 424]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000052',
  '11111111-1111-1111-1111-000000000052',
  'scraped',
  'B01LWMQKIU',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000052',
  '11111111-1111-1111-1111-000000000052',
  false,
  false,
  51.9,
  1095,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 53: Hagibis USB-C Hub with Hard Drive Enclosure, 2-in-...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000053',
  'Hagibis USB-C Hub with Hard Drive Enclosure, 2-in-1 Type-C Docking Station & 2.5-inch SATA External Hard Drive Enclosure, USB A/C to USB 3.0, HDMI, PD, SD/TF Card Slots for MacBook Pro (MC30 Pro)',
  'https://m.media-amazon.com/images/I/519kvNgv+XL._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  25.44,
  42.99,
  17.55,
  ARRAY[]::text[],
  NULL,
  4.2,
  138,
  ARRAY[394, 332, 271, 243, 235, 366, 343]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000053',
  '11111111-1111-1111-1111-000000000053',
  'scraped',
  'B09TSYCQRQ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000053',
  '11111111-1111-1111-1111-000000000053',
  false,
  false,
  40.8,
  1752,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 54: Apple Lightning to HDMI Digital AV Adapter,[Apple ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000054',
  'Apple Lightning to HDMI Digital AV Adapter,[Apple MFi Certified] 1080P HDMI Sync Screen Digital Audio AV Converter with Charging Port for iPhone, iPad, iPod on HDTV/Projector/Monitor, Support All iOS',
  'https://m.media-amazon.com/images/I/61yn+pIEglL._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  7.47,
  13.99,
  6.52,
  ARRAY[]::text[],
  NULL,
  3.6,
  3541,
  ARRAY[408, 451, 359, 356, 361, 542, 514]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000054',
  '11111111-1111-1111-1111-000000000054',
  'scraped',
  'B0881N2VCV',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000054',
  '11111111-1111-1111-1111-000000000054',
  false,
  false,
  46.6,
  4038,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 55: Premium Microfiber Cleaning Cloth 6x6 - Soft Suede...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000055',
  'Premium Microfiber Cleaning Cloth 6x6 - Soft Suede-Like Lint Free Cloths Clean Glass, Touch Screen, TV, Eyeglasses, Glasses, Camera Lens, Phone, Tablet, Compatible with iPhone, iPad (48 Small, Pink)',
  'https://m.media-amazon.com/images/I/81QuL7feEHL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  12.21,
  26.96,
  14.75,
  ARRAY[]::text[],
  NULL,
  4.5,
  340,
  ARRAY[510, 493, 315, 317, 325, 350, 478]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000055',
  '11111111-1111-1111-1111-000000000055',
  'scraped',
  'B07K6PBBYT',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000055',
  '11111111-1111-1111-1111-000000000055',
  true,
  false,
  54.7,
  3094,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 56: Controller for Nintendo Switch Controller Compatib...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000056',
  'Controller for Nintendo Switch Controller Compatible with Switch/Lite/OLED, Replacement Switch Controllers with Motion Control/Dual Vibration/Wake-up/Screenshot',
  'https://m.media-amazon.com/images/I/41MLpj6gJ7L._SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  18.13,
  33.99,
  15.86,
  ARRAY[]::text[],
  NULL,
  5.0,
  3,
  ARRAY[772, 699, 762, 710, 683, 645, 677]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000056',
  '11111111-1111-1111-1111-000000000056',
  'scraped',
  'B0DJW1LS52',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000056',
  '11111111-1111-1111-1111-000000000056',
  false,
  false,
  46.7,
  502,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 57: M-Tronics Replacement Counter Belt for Revox A-77,...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000057',
  'M-Tronics Replacement Counter Belt for Revox A-77, B-77, PR-99 MKI, G-36',
  'https://m.media-amazon.com/images/I/51gBPkc6TGL.__AC_SY300_SX300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.59,
  12.50,
  6.91,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[984, 1135, 963, 1123, 1084, 1092, 989]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000057',
  '11111111-1111-1111-1111-000000000057',
  'scraped',
  'B0BPM6GCFF',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000057',
  '11111111-1111-1111-1111-000000000057',
  true,
  false,
  55.3,
  4130,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 58: kwmobile Carrying Case Compatible with Nintendo 3D...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000058',
  'kwmobile Carrying Case Compatible with Nintendo 3DS XL - Neoprene Console Pouch with Zipper - Dusty Pink',
  'https://m.media-amazon.com/images/I/81G6ZgWOxSL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.07,
  11.59,
  6.52,
  ARRAY[]::text[],
  NULL,
  3.7,
  257,
  ARRAY[499, 388, 413, 357, 367, 380, 410]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000058',
  '11111111-1111-1111-1111-000000000058',
  'scraped',
  'B0C7RBYRW5',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000058',
  '11111111-1111-1111-1111-000000000058',
  true,
  false,
  56.3,
  2724,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 59: 100 PCS Music Stickers Vinyl Waterproof Stickers f...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000059',
  '100 PCS Music Stickers Vinyl Waterproof Stickers for Water Bottle Laptop Skateboard Car Bumper Computer for Boys Girls Teens',
  'https://m.media-amazon.com/images/I/81fSfWPPyXL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2.96,
  6.99,
  4.03,
  ARRAY[]::text[],
  NULL,
  5.0,
  13,
  ARRAY[228, 239, 216, 173, 218, 266, 246]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000059',
  '11111111-1111-1111-1111-000000000059',
  'scraped',
  'B0DHVH89KX',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000059',
  '11111111-1111-1111-1111-000000000059',
  false,
  false,
  57.7,
  2431,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 60: soyond Power Distribution Block (2 Pack) Car Auto ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000060',
  'soyond Power Distribution Block (2 Pack) Car Auto Audio Amplifier Vehicle 0/2/4 Gauge in 2/4/8 Gauge Out Amp Power Ground Distributor Blocks Car Amplifier Audio Splitter (1 in 2 Out)',
  'https://m.media-amazon.com/images/I/41KlAX1nP5L._SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.06,
  11.99,
  6.93,
  ARRAY[]::text[],
  NULL,
  4.5,
  361,
  ARRAY[629, 580, 616, 507, 512, 570, 618]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000060',
  '11111111-1111-1111-1111-000000000060',
  'scraped',
  'B08DTMLXY8',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000060',
  '11111111-1111-1111-1111-000000000060',
  false,
  false,
  57.8,
  3139,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 61: Metra AX-MLOC720 2 Chl Mini 80 Watt Loc WTurn On...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000061',
  'Metra AX-MLOC720 2 Chl Mini 80 Watt Loc WTurn On',
  'https://m.media-amazon.com/images/I/613n1U4WBVL.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  13.07,
  23.02,
  9.95,
  ARRAY[]::text[],
  NULL,
  4.2,
  4,
  ARRAY[393, 422, 373, 561, 421, 491, 555]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000061',
  '11111111-1111-1111-1111-000000000061',
  'scraped',
  'B00JMMWYWO',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000061',
  '11111111-1111-1111-1111-000000000061',
  false,
  false,
  43.2,
  2870,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 62: Sticker Wrap Vinyl Decal Pre-Cut Skin | Raiden Sho...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000062',
  'Sticker Wrap Vinyl Decal Pre-Cut Skin | Raiden Shogun | Compatible with Nintendo Switch OLED (2021 Model)',
  'https://m.media-amazon.com/images/I/61Cc9ZRak0L.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  7.26,
  13.99,
  6.73,
  ARRAY[]::text[],
  NULL,
  5.0,
  2,
  ARRAY[549, 534, 507, 554, 429, 453, 465]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000062',
  '11111111-1111-1111-1111-000000000062',
  'scraped',
  'B0BBG15KCQ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000062',
  '11111111-1111-1111-1111-000000000062',
  false,
  false,
  48.1,
  3455,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 63: Nikon LF-4 Rear Lens Cap...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000063',
  'Nikon LF-4 Rear Lens Cap',
  'https://m.media-amazon.com/images/I/91jnQU-79TL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1.98,
  4.49,
  2.51,
  ARRAY[]::text[],
  NULL,
  4.8,
  3730,
  ARRAY[989, 950, 850, 946, 930, 909, 940]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000063',
  '11111111-1111-1111-1111-000000000063',
  'scraped',
  'B0045TYDNC',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000063',
  '11111111-1111-1111-1111-000000000063',
  false,
  false,
  55.9,
  1873,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 64: Radio Receiver, ATS-25Max SI4732 Full Radio DSP FM...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000064',
  'Radio Receiver, ATS-25Max SI4732 Full Radio DSP FM LW MW SW SSB 2.4 Receiver with 2.4 Touch Screen',
  'https://m.media-amazon.com/images/I/515gr6eTACL.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  66.05,
  144.98,
  78.93,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[980, 1107, 1079, 997, 1147, 1035, 1044]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000064',
  '11111111-1111-1111-1111-000000000064',
  'scraped',
  'B0CFL1YM2K',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000064',
  '11111111-1111-1111-1111-000000000064',
  false,
  false,
  54.4,
  1088,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 65: Herfair Component Cable VGA to RCA (YPbPr) Compone...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000065',
  'Herfair Component Cable VGA to RCA (YPbPr) Component Adapter Cord [NOT AV Composite] 15Pin VGA to Component Converter Wire for TV, LCD Projector, Set-top Box, DVD Player, More (5FT)',
  'https://m.media-amazon.com/images/I/51CyWF197VL._SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4.42,
  9.99,
  5.57,
  ARRAY[]::text[],
  NULL,
  3.8,
  295,
  ARRAY[69, 122, 129, 152, 64, 124, 140]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000065',
  '11111111-1111-1111-1111-000000000065',
  'scraped',
  'B07Q27DLLH',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000065',
  '11111111-1111-1111-1111-000000000065',
  true,
  false,
  55.8,
  395,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 66: COSTWAY Vinyl Turntable with Socket, Side Table on...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000066',
  'COSTWAY Vinyl Turntable with Socket, Side Table on Wheels with Charging Station, 2 Sockets, 1 USB, 1 Type-C, Sofa End, Industrial Turntable Holder (Grey)',
  'https://m.media-amazon.com/images/I/71VaC0RACrL.__AC_SX300_SY300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  38.95,
  87.99,
  49.04,
  ARRAY[]::text[],
  NULL,
  4.7,
  31,
  ARRAY[601, 654, 533, 660, 620, 588, 488]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000066',
  '11111111-1111-1111-1111-000000000066',
  'scraped',
  'B0DGQDVGYG',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000066',
  '11111111-1111-1111-1111-000000000066',
  false,
  false,
  55.7,
  190,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 67: Solar Powered Fake Security Camera, Bullet Dummy S...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000067',
  'Solar Powered Fake Security Camera, Bullet Dummy Simulated Surveillance Security Cameras with Realistic Red LED Flashing Light for Home & Business Use',
  'https://m.media-amazon.com/images/I/61NfIf3zo0L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  12.14,
  26.99,
  14.85,
  ARRAY[]::text[],
  NULL,
  3.8,
  457,
  ARRAY[971, 932, 817, 895, 900, 1006, 993]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000067',
  '11111111-1111-1111-1111-000000000067',
  'scraped',
  'B0C94XFNRJ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000067',
  '11111111-1111-1111-1111-000000000067',
  false,
  false,
  55.0,
  4239,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 68: External Blu-ray Drive, USB 3.0 and Type-C Blu-Ray...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000068',
  'External Blu-ray Drive, USB 3.0 and Type-C Blu-Ray Burner Slim 3D Optical Blu-Ray DVD CD Drive Compatible with Windows XP/7/8/10/11 MacOS for MacBook Laptop Desktop',
  'https://m.media-amazon.com/images/I/61eJJyRQpCL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  21.59,
  49.99,
  28.40,
  ARRAY[]::text[],
  NULL,
  3.7,
  235,
  ARRAY[367, 488, 533, 433, 446, 522, 457]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000068',
  '11111111-1111-1111-1111-000000000068',
  'scraped',
  'B0D5CFWHPL',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000068',
  '11111111-1111-1111-1111-000000000068',
  false,
  false,
  56.8,
  3831,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 69: InstallGear 12 Gauge Wire AWG Speaker Wire (100ft ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000069',
  'InstallGear 12 Gauge Wire AWG Speaker Wire (100ft - Red/Black) | Speaker Cable for Car Speakers Stereos, Home Theater Speakers, Surround Sound, Radio, Automotive Wire, Outdoor | Speaker Wire 12 Gauge',
  'https://m.media-amazon.com/images/I/519BxL1VIlL._SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  11.23,
  26.99,
  15.76,
  ARRAY[]::text[],
  NULL,
  4.7,
  3778,
  ARRAY[477, 500, 476, 442, 442, 404, 359]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000069',
  '11111111-1111-1111-1111-000000000069',
  'scraped',
  'B07LCRHG86',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000069',
  '11111111-1111-1111-1111-000000000069',
  false,
  false,
  58.4,
  1153,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 70: OWC OWC6400DDR2S6GP Internal Memory DDR2 So-DIMM 6...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000070',
  'OWC OWC6400DDR2S6GP Internal Memory DDR2 So-DIMM 6 GB 800 MHz',
  'https://m.media-amazon.com/images/I/71Rj+7otaDL._AC_SX300_SY300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  48.98,
  85.41,
  36.43,
  ARRAY[]::text[],
  NULL,
  4.5,
  64,
  ARRAY[791, 822, 768, 731, 814, 807, 751]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000070',
  '11111111-1111-1111-1111-000000000070',
  'scraped',
  'B00KHZEKS6',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000070',
  '11111111-1111-1111-1111-000000000070',
  false,
  false,
  42.7,
  3479,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 71: Treela 10 Pack Disposable Camera for Wedding 35mm ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000071',
  'Treela 10 Pack Disposable Camera for Wedding 35mm Single Use Film Camera with Flash 27 Exposures 400 ISO Bulk Film Camera for Concert Travel Anniversary Birthday Party Supply Guest Gift (Pink Style)',
  'https://m.media-amazon.com/images/I/814RKVy31bL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  73.66,
  139.99,
  66.33,
  ARRAY[]::text[],
  NULL,
  5.0,
  3,
  ARRAY[951, 867, 1030, 1003, 903, 1000, 946]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000071',
  '11111111-1111-1111-1111-000000000071',
  'scraped',
  'B0C811WJVY',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000071',
  '11111111-1111-1111-1111-000000000071',
  false,
  false,
  47.4,
  1431,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 72: MP3 Player, Music Player with 16GB Micro SD Card, ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000072',
  'MP3 Player, Music Player with 16GB Micro SD Card, Build-in Speaker/Photo/Video Play/FM Radio/Voice Recorder/E-Book Reader, Supports up to 128GB',
  'https://m.media-amazon.com/images/I/71nPMSDCl4L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6.65,
  11.99,
  5.34,
  ARRAY[]::text[],
  NULL,
  4.9,
  40,
  ARRAY[835, 810, 761, 829, 873, 727, 884]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000072',
  '11111111-1111-1111-1111-000000000072',
  'scraped',
  'B0D7PQNPLY',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000072',
  '11111111-1111-1111-1111-000000000072',
  false,
  false,
  44.5,
  1164,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 73: Monitor Light Bar RGB USB Voice Activated Lights f...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000073',
  'Monitor Light Bar RGB USB Voice Activated Lights for Computer - Clip on Monitor Backlight RGB Sound Control Pickup Rhythm Lights for Home Office Gaming Reading Decoration Ambience (Voice)',
  'https://m.media-amazon.com/images/I/61bU0L6USRL.__AC_SY445_SX342_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.29,
  9.99,
  4.70,
  ARRAY[]::text[],
  NULL,
  4.7,
  424,
  ARRAY[1182, 1021, 1147, 1183, 1000, 1046, 1020]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000073',
  '11111111-1111-1111-1111-000000000073',
  'scraped',
  'B0D5MK2ZWZ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000073',
  '11111111-1111-1111-1111-000000000073',
  false,
  false,
  47.0,
  747,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 74: Fireproof CD Case, 64 Capacity DVD Case Holder Org...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000074',
  'Fireproof CD Case, 64 Capacity DVD Case Holder Organizer, EVA Protective Wallet Storage Organizer, Portable CD Storage Case for Car Travel Home Office',
  'https://m.media-amazon.com/images/I/71Tn0C72uCL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  7.19,
  11.99,
  4.80,
  ARRAY[]::text[],
  NULL,
  4.3,
  63,
  ARRAY[626, 640, 706, 581, 555, 673, 619]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000074',
  '11111111-1111-1111-1111-000000000074',
  'scraped',
  'B0BW2ZHDG8',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000074',
  '11111111-1111-1111-1111-000000000074',
  false,
  false,
  40.0,
  4034,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 75: SA-60 High Bias Type II Blank Tape (Discontinued b...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000075',
  'SA-60 High Bias Type II Blank Tape (Discontinued by Manufacturer)',
  'https://m.media-amazon.com/images/I/71emA+WxTkL._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  14.68,
  27.30,
  12.62,
  ARRAY[]::text[],
  NULL,
  4.3,
  28,
  ARRAY[993, 1038, 1069, 1118, 1023, 1086, 1104]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000075',
  '11111111-1111-1111-1111-000000000075',
  'scraped',
  'B00017YHM4',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000075',
  '11111111-1111-1111-1111-000000000075',
  false,
  false,
  46.2,
  588,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 76: LCD Protective Film for PLENUE 2/2 MK2 / L (Screen...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000076',
  'LCD Protective Film for PLENUE 2/2 MK2 / L (Screen Protector, Anti-Scratch, Anti-Fingerprint)',
  'https://m.media-amazon.com/images/I/51PaWWBxsWL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6.26,
  14.90,
  8.64,
  ARRAY[]::text[],
  NULL,
  4.6,
  3,
  ARRAY[388, 271, 362, 252, 300, 329, 340]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000076',
  '11111111-1111-1111-1111-000000000076',
  'scraped',
  'B071GD8W8Y',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000076',
  '11111111-1111-1111-1111-000000000076',
  false,
  false,
  58.0,
  856,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 77: for Microsoft Surface Pro 3 LCD Screen Sticker Tap...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000077',
  'for Microsoft Surface Pro 3 LCD Screen Sticker Tape Adhesive Stripe Paper Replacement',
  'https://m.media-amazon.com/images/I/51ag6lV4HCL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6.28,
  10.89,
  4.61,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[109, 233, 164, 292, 195, 255, 141]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000077',
  '11111111-1111-1111-1111-000000000077',
  'scraped',
  'B0BYD45LHT',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000077',
  '11111111-1111-1111-1111-000000000077',
  false,
  false,
  42.3,
  3086,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 78: TV Antenna Signal Strength Meter, Digital TV Signa...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000078',
  'TV Antenna Signal Strength Meter, Digital TV Signal Star Finder, Digital Satellite Finder with Compass, Powerful Sensitive Mini Portable Digital TV Signal Finder for Satellite Signal',
  'https://m.media-amazon.com/images/I/61UuBnND3RL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  14.03,
  25.19,
  11.16,
  ARRAY[]::text[],
  NULL,
  4.9,
  164,
  ARRAY[153, 239, 147, 158, 257, 187, 320]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000078',
  '11111111-1111-1111-1111-000000000078',
  'scraped',
  'B0CDSVX9S6',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000078',
  '11111111-1111-1111-1111-000000000078',
  true,
  false,
  44.3,
  2184,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 79: FreedConn Motorcycle Helmet Bluetooth intercom Acc...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000079',
  'FreedConn Motorcycle Helmet Bluetooth intercom Accessories,Motorbike Accessories Including Microphone Headset Set,Suit Old Version TCOM VB and TCOM SC TMAX,0.5m,Mini USB interface-8Pin',
  'https://m.media-amazon.com/images/I/51rP-Onm1rL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  8.23,
  15.99,
  7.76,
  ARRAY[]::text[],
  NULL,
  3.9,
  38,
  ARRAY[273, 311, 401, 433, 428, 316, 449]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000079',
  '11111111-1111-1111-1111-000000000079',
  'scraped',
  'B07RCWZR85',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000079',
  '11111111-1111-1111-1111-000000000079',
  false,
  false,
  48.5,
  0,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 80: [USB to PS/2 Adapter] - Keyboard and Mouse Convert...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000080',
  '[USB to PS/2 Adapter] - Keyboard and Mouse Converter with PS/2 Interface - USB Male to PS/2 Female Connector - Seamlessly Connect Your Keyboard and Mouse via USB to PS/2 Port',
  'https://m.media-amazon.com/images/I/611j5RjVWnL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2.45,
  5.99,
  3.54,
  ARRAY[]::text[],
  NULL,
  4.3,
  68,
  ARRAY[897, 898, 863, 991, 1009, 943, 914]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000080',
  '11111111-1111-1111-1111-000000000080',
  'scraped',
  'B0CBLF4PP8',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000080',
  '11111111-1111-1111-1111-000000000080',
  false,
  false,
  59.1,
  138,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 81: Personal Safety Alarm for Women - 140dB Self Defen...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000081',
  'Personal Safety Alarm for Women - 140dB Self Defense Keychains Siren Whistle with Sos LED Strobe Light Personal Emergency Security Safe Devices Key Chain Alarms in 5 Pop Colors - Red',
  'https://m.media-amazon.com/images/I/61+OOk4NhzL._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4.31,
  9.99,
  5.68,
  ARRAY[]::text[],
  NULL,
  4.5,
  199,
  ARRAY[655, 727, 709, 547, 589, 577, 701]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000081',
  '11111111-1111-1111-1111-000000000081',
  'scraped',
  'B0CPDKH3HN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000081',
  '11111111-1111-1111-1111-000000000081',
  false,
  false,
  56.9,
  4365,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 82: AWESAFE Android Car Stereo for Dodge RAM 1500 2500...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000082',
  'AWESAFE Android Car Stereo for Dodge RAM 1500 2500 3500 2013 2014 2015 2016 2017 2018, Android Touch Screen Radio Replacement with Wireless CarPlay Android Auto - 2+32GB (Only fit Manual AC)',
  'https://m.media-amazon.com/images/I/618GyeMiUnL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  91.53,
  189.99,
  98.46,
  ARRAY[]::text[],
  NULL,
  4.0,
  53,
  ARRAY[684, 689, 846, 772, 778, 763, 705]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000082',
  '11111111-1111-1111-1111-000000000082',
  'scraped',
  'B0CGV88XWV',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000082',
  '11111111-1111-1111-1111-000000000082',
  true,
  false,
  51.8,
  1026,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 83: USB 3.0 External 2012 Compatible for MacBook AIR M...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000083',
  'USB 3.0 External 2012 Compatible for MacBook AIR MD223-224 MD231-232 SSD Case',
  'https://m.media-amazon.com/images/I/31pHWxxit2L.__AC_SY300_SX300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  9.61,
  19.75,
  10.14,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[904, 1013, 869, 926, 896, 987, 833]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000083',
  '11111111-1111-1111-1111-000000000083',
  'scraped',
  'B01GIF6V8A',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000083',
  '11111111-1111-1111-1111-000000000083',
  false,
  false,
  51.3,
  1645,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 84: Waterproof Shower & Cycling Bike Universal Phone H...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000084',
  'Waterproof Shower & Cycling Bike Universal Phone Holder Case, Suction Cup Mount for Bathroom, Clamp for Bicycle, 360 Rotatable, Tilt & Height Adjustable of Cellphone/Smartphone/iPhone',
  'https://m.media-amazon.com/images/I/71OwvPqrPGL.__AC_SY300_SX300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3.71,
  6.90,
  3.19,
  ARRAY[]::text[],
  NULL,
  2.9,
  4,
  ARRAY[601, 553, 598, 499, 462, 616, 558]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000084',
  '11111111-1111-1111-1111-000000000084',
  'scraped',
  'B0B9NHNSNT',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000084',
  '11111111-1111-1111-1111-000000000084',
  false,
  false,
  46.2,
  3048,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 85: TV Antenna for Smart TV，Antenna for TV Without Cab...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000085',
  'TV Antenna for Smart TV，Antenna for TV Without Cable with 560+ Miles Coverage Range,Amplified Signal Booster Support Smart TV and All Older TV''s,with High Performance Coax Cable.',
  'https://m.media-amazon.com/images/I/61Xd9TVnGRL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  11.05,
  25.99,
  14.94,
  ARRAY[]::text[],
  NULL,
  5.0,
  1,
  ARRAY[881, 783, 776, 708, 884, 799, 760]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000085',
  '11111111-1111-1111-1111-000000000085',
  'scraped',
  'B0DLN5SDKN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000085',
  '11111111-1111-1111-1111-000000000085',
  false,
  false,
  57.5,
  2188,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 86: Leypian Game Case for Nintendo Switch OLED Cover,C...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000086',
  'Leypian Game Case for Nintendo Switch OLED Cover,Carrying Case for Protective Switch & Switch Lite,Portable switch accessories and game Travel Bag,style5',
  'https://m.media-amazon.com/images/I/41qAKJuReWL._SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  12.53,
  23.99,
  11.46,
  ARRAY[]::text[],
  NULL,
  3.7,
  0,
  ARRAY[837, 1009, 942, 919, 934, 1029, 981]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000086',
  '11111111-1111-1111-1111-000000000086',
  'scraped',
  'B0D816FS53',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000086',
  '11111111-1111-1111-1111-000000000086',
  false,
  false,
  47.8,
  1588,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 87: Night Vision Goggles | Hunting Accessories and Gea...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000087',
  'Night Vision Goggles | Hunting Accessories and Gear | Night Vision Binoculars for Adults High Powered | Tactical Gear with 8X Zoom | Rechargeable 4K Night Vision Glasses with 3.2 Display',
  'https://m.media-amazon.com/images/I/51XqTqor4+L._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  18.13,
  39.00,
  20.87,
  ARRAY[]::text[],
  NULL,
  4.0,
  33,
  ARRAY[828, 897, 928, 796, 798, 933, 805]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000087',
  '11111111-1111-1111-1111-000000000087',
  'scraped',
  'B0CJMQSJ4N',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000087',
  '11111111-1111-1111-1111-000000000087',
  false,
  false,
  53.5,
  4807,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 88: Genuine HP 62Xl High Yield Black and High Yield Tr...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000088',
  'Genuine HP 62Xl High Yield Black and High Yield Tri-Color Jetdirect Print Cartridges',
  'https://m.media-amazon.com/images/I/613rxtBE06L.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  38.20,
  87.00,
  48.80,
  ARRAY[]::text[],
  NULL,
  4.5,
  72,
  ARRAY[607, 620, 687, 607, 734, 782, 645]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000088',
  '11111111-1111-1111-1111-000000000088',
  'scraped',
  'B00BKESGS8',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000088',
  '11111111-1111-1111-1111-000000000088',
  false,
  false,
  56.1,
  496,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 89: Sea-Doo New OEM, BRP 50 Watt Portable Audio System...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000089',
  'Sea-Doo New OEM, BRP 50 Watt Portable Audio System With BlueTooth, 295100866',
  'https://m.media-amazon.com/images/I/51u9Q+1hpcS._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  388.75,
  819.98,
  431.23,
  ARRAY[]::text[],
  NULL,
  3.7,
  32,
  ARRAY[192, 333, 293, 320, 200, 218, 356]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000089',
  '11111111-1111-1111-1111-000000000089',
  'scraped',
  'B07YNKHPKN',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000089',
  '11111111-1111-1111-1111-000000000089',
  false,
  false,
  52.6,
  2599,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 90: Nintendo Switch™ - OLED Model: Super Smash Bros.™ ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000090',
  'Nintendo Switch™ - OLED Model: Super Smash Bros.™ Ultimate Bundle (Full Game Download + 3 Mo. Nintendo Switch Online Membership Included)',
  'https://m.media-amazon.com/images/I/41Dn8Z5xKFL._SY300_SX300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  300.75,
  529.00,
  228.25,
  ARRAY[]::text[],
  NULL,
  4.7,
  745,
  ARRAY[278, 261, 252, 251, 208, 244, 229]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000090',
  '11111111-1111-1111-1111-000000000090',
  'scraped',
  'B0CKY4YKNY',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000090',
  '11111111-1111-1111-1111-000000000090',
  false,
  false,
  43.1,
  1285,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 91: XIWBSY Support De Trépied pour Mini-Projecteur Sup...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000091',
  'XIWBSY Support De Trépied pour Mini-Projecteur Support De Table De Bureau Support De Caméra',
  'https://m.media-amazon.com/images/I/41pgO8YzTdL.__AC_SY300_SX300_QL70_ML2_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5.28,
  9.99,
  4.71,
  ARRAY[]::text[],
  NULL,
  4.4,
  40,
  ARRAY[339, 293, 300, 417, 239, 404, 331]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000091',
  '11111111-1111-1111-1111-000000000091',
  'scraped',
  'B0DD3M3CKB',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000091',
  '11111111-1111-1111-1111-000000000091',
  false,
  false,
  47.1,
  3595,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 92: 10Ft Switch Replacement Charger for Nintendo Switc...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000092',
  '10Ft Switch Replacement Charger for Nintendo Switch PD Power Charger Cord Adapter, Fast Charger Intened for Nintendo Switch/Switch Lite/Switch OLED,with 10Ft USB C Cable',
  'https://m.media-amazon.com/images/I/51C6H8+MNAL._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6.91,
  12.99,
  6.08,
  ARRAY[]::text[],
  NULL,
  4.5,
  65,
  ARRAY[414, 288, 346, 257, 286, 414, 249]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000092',
  '11111111-1111-1111-1111-000000000092',
  'scraped',
  'B0BN3GDKK2',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000092',
  '11111111-1111-1111-1111-000000000092',
  false,
  false,
  46.8,
  3323,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 93: Binoculars 12x25 for Adults and Kids Night Vision ...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000093',
  'Binoculars 12x25 for Adults and Kids Night Vision Binoculars Compact Large Eyepiece Waterproof Binocular Easy Focus Wide Field of View & Long Eye Relief for Bird Watching,Hiking,Concert',
  'https://m.media-amazon.com/images/I/71K9ReQaVZL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  30.23,
  69.99,
  39.76,
  ARRAY[]::text[],
  NULL,
  4.7,
  341,
  ARRAY[478, 400, 530, 506, 526, 523, 563]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000093',
  '11111111-1111-1111-1111-000000000093',
  'scraped',
  'B0DGTJK6ZF',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000093',
  '11111111-1111-1111-1111-000000000093',
  false,
  false,
  56.8,
  3509,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 94: Replacement LCD Touch Screen Assembly,Compatible w...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000094',
  'Replacement LCD Touch Screen Assembly,Compatible with IPAD Mini 5(Black),Model A2133 A2124 A2126 A2125 + Free Teardown Tool',
  'https://m.media-amazon.com/images/I/31nepe0zPLS.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  51.38,
  99.99,
  48.61,
  ARRAY[]::text[],
  NULL,
  3.7,
  3,
  ARRAY[945, 776, 917, 884, 816, 970, 941]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000094',
  '11111111-1111-1111-1111-000000000094',
  'scraped',
  'B091Q7XS7D',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000094',
  '11111111-1111-1111-1111-000000000094',
  true,
  false,
  48.6,
  1761,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 95: Mini S Underwater Drone with a 4K+EIS Image Stabil...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000095',
  'Mini S Underwater Drone with a 4K+EIS Image Stabilization Camera for Real Time Viewing Depth and Temperature Data, Direct-Connect Remote Controller, Dive to 330ft Underwater, Portable ROV',
  'https://m.media-amazon.com/images/I/51H5+k1UH2L._AC_SY300_SX300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  475.23,
  1159.99,
  684.76,
  ARRAY[]::text[],
  NULL,
  3.0,
  13,
  ARRAY[537, 551, 525, 527, 685, 580, 620]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000095',
  '11111111-1111-1111-1111-000000000095',
  'scraped',
  'B09C1P7SHK',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000095',
  '11111111-1111-1111-1111-000000000095',
  false,
  false,
  59.0,
  1296,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 96: 64G Compact Camera, spy Camera, Hidden Full HD Sur...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000096',
  '64G Compact Camera, spy Camera, Hidden Full HD Surveillance Camera, Rechargeable Watch, Hidden Nanny Camera, Night Vision, Duration Recording and Video Recording. (Black)',
  'https://m.media-amazon.com/images/I/71+EFRkDeWL._AC_SX300_SY300_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  32.22,
  69.99,
  37.77,
  ARRAY[]::text[],
  NULL,
  3.1,
  32,
  ARRAY[967, 1074, 899, 953, 950, 1020, 983]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000096',
  '11111111-1111-1111-1111-000000000096',
  'scraped',
  'B0DCZQZ5F3',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000096',
  '11111111-1111-1111-1111-000000000096',
  true,
  false,
  54.0,
  2110,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 97: SV-3 Slide and Film Viewer - 35mm Slide Viewer wit...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000097',
  'SV-3 Slide and Film Viewer - 35mm Slide Viewer with 3X Magnification, LED Lighted Viewing – for 35mm Slides & Film Negatives,USB Powered or Battery Powered.',
  'https://m.media-amazon.com/images/I/615S94krvVL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  16.13,
  26.99,
  10.86,
  ARRAY[]::text[],
  NULL,
  4.6,
  11,
  ARRAY[932, 919, 952, 973, 874, 796, 816]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000097',
  '11111111-1111-1111-1111-000000000097',
  'scraped',
  'B08SMB3HFB',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000097',
  '11111111-1111-1111-1111-000000000097',
  false,
  false,
  40.2,
  29,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 98: SopiGuard Sticker Skin for Backbone One Controller...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000098',
  'SopiGuard Sticker Skin for Backbone One Controller Full Body Wrap (Digital Stealth)',
  'https://m.media-amazon.com/images/I/51C-hDEAhmL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  7.18,
  12.99,
  5.81,
  ARRAY[]::text[],
  NULL,
  3.2,
  26,
  ARRAY[626, 518, 558, 513, 681, 540, 612]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000098',
  '11111111-1111-1111-1111-000000000098',
  'scraped',
  'B0BB2LHH8D',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000098',
  '11111111-1111-1111-1111-000000000098',
  false,
  false,
  44.7,
  4120,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 99: Generic Super Classic Mini Retro Game Console,Clas...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000099',
  'Generic Super Classic Mini Retro Game Console,Classic Video Game System Built in 5000+ Different Classic Games,4k HD Output and Dual Wired Controllers,Advanced Game Solution. (Grey)',
  'https://m.media-amazon.com/images/I/71h0UImVARL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  43.71,
  79.99,
  36.28,
  ARRAY[]::text[],
  NULL,
  5.0,
  3,
  ARRAY[462, 517, 525, 601, 529, 610, 494]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000099',
  '11111111-1111-1111-1111-000000000099',
  'scraped',
  'B0D88M6SHJ',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000099',
  '11111111-1111-1111-1111-000000000099',
  false,
  false,
  45.4,
  2940,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product 100: Yottamaster 24 Slots Portable SD Micro SD Memory C...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-000000000100',
  'Yottamaster 24 Slots Portable SD Micro SD Memory Card Case, Water-Resistant Anti-Shock SD SDHC SDXC TF Card Holder Storage Organizer for 6 SD Cards & 18 Micro SD Cards with EVA Foam Interior [B7-2]',
  'https://m.media-amazon.com/images/I/71MIIJApVML.__AC_SX300_SY300_QL70_FMwebp_.jpg',
  NULL,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2.00,
  4.99,
  2.99,
  ARRAY[]::text[],
  NULL,
  4.2,
  160,
  ARRAY[327, 406, 388, 423, 288, 396, 316]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-000000000100',
  '11111111-1111-1111-1111-000000000100',
  'scraped',
  'B09V25WJXG',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-000000000100',
  '11111111-1111-1111-1111-000000000100',
  false,
  false,
  59.9,
  4553,
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Update category product counts
UPDATE categories SET product_count = (
  SELECT COUNT(*) FROM products WHERE category_id = categories.id
), updated_at = NOW();

-- Summary
-- Total products inserted: 100
