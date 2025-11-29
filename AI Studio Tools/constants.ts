import React from 'react';
import { Square, RectangleVertical, RectangleHorizontal } from 'lucide-react';
import type { AIModel, Background, Lighting, Expression, Aperture, AspectRatio, FocalLength, Fabric, ColorGrade, ShotType, CameraAngle, LightingDirection, LightQuality, CatchlightStyle, Surface, EcommercePack, PackShot, DesignPlacement, MockupStyle, FabricStyle, DesignLightingStyle, DesignCameraAngle, PrintStyle, Material, ProductEcommercePack, ProductPackShot, ProductSceneTemplate, DesignSceneTemplate, ProductInteraction } from './types';

export const MODELS_LIBRARY: AIModel[] = [
    { 
        id: 'm1', 
        name: 'Sasha', 
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A professional female fashion model in her early 20s, with long, straight blonde hair, sharp cheekbones, and a confident gaze. She has a slender, athletic build. European ethnicity.',
        region: 'European',
        country: 'Germany'
    },
    { 
        id: 'm2', 
        name: 'Kenji', 
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A male streetwear model in his mid-20s, with short, dark, curly hair and a friendly smile. He has a lean build and a cool, relaxed demeanor. East Asian ethnicity.',
        region: 'Asian',
        country: 'Japan'
    },
    { 
        id: 'm3', 
        name: 'Maria', 
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/3778223/pexels-photo-3778223.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A versatile female commercial model in her late 20s, with warm brown skin, shoulder-length wavy dark hair, and expressive brown eyes. She has an average build and a warm, approachable look. Latina/Hispanic ethnicity.',
        region: 'Latin',
        country: 'Mexico'
    },
     { 
        id: 'm4', 
        name: 'David', 
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/936043/pexels-photo-936043.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A rugged male model in his early 30s, with a short beard, piercing blue eyes, and light brown hair. He has a muscular build, suitable for outdoor or workwear brands. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    { 
        id: 'm5', 
        name: 'Priya', 
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A graceful female fashion model in her mid-20s, with long, dark wavy hair, expressive almond-shaped brown eyes, and warm olive skin. She has a poised and elegant presence. South Asian/Indian ethnicity.',
        region: 'Asian',
        country: 'India'
    },
    { 
        id: 'm6', 
        name: 'Chloe', 
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/3220617/pexels-photo-3220617.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'An approachable female model in her early 20s with freckles, red curly hair, and green eyes. She has a slim build and a cheerful, friendly vibe. Irish ethnicity.',
        region: 'European',
        country: 'Ireland'
    },
    { 
        id: 'm7', 
        name: 'Jamal', 
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/1853542/pexels-photo-1853542.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A sharp male model in his late 20s with short, well-groomed dreadlocks and a confident expression. He has a strong jawline and an athletic build. African-American ethnicity.',
        region: 'African',
        country: 'USA'
    },
    { 
        id: 'm8', 
        name: 'Isabella', 
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A high-fashion female model in her early 20s, with sleek, black hair in a bob cut, sharp angular features, and a sophisticated look. She has a tall, slender frame. Brazilian ethnicity.',
        region: 'Latin',
        country: 'Brazil'
    },
    { 
        id: 'm9', 
        name: 'Omar', 
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A mature male model in his late 30s with salt-and-pepper hair, a well-maintained short beard, and kind eyes. He has a distinguished and trustworthy appearance. Middle Eastern ethnicity.',
        region: 'Middle Eastern',
        country: 'Egypt'
    },
    { 
        id: 'm10', 
        name: 'Anja', 
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2', 
        description: 'A striking female model with platinum blonde short hair, bold eyebrows, and an androgynous look. She is in her mid-20s with a lean, strong physique. Scandinavian ethnicity.',
        region: 'European',
        country: 'Sweden'
    },
    {
        id: 'm11',
        name: 'Aisha',
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'A vibrant female model from Mumbai in her early 20s, with expressive dark eyes, long black hair, and a warm, engaging smile. Perfect for both traditional and contemporary fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India'
    },
    {
        id: 'm12',
        name: 'Jackson',
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'A male model from California in his mid-20s, with a sun-kissed look, blonde hair, and a laid-back, athletic vibe. Ideal for lifestyle and sportswear brands. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    {
        id: 'm13',
        name: 'Amélie',
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'An elegant female model from Paris in her late 20s, with chic brunette hair, classic features, and a sophisticated aura. Embodies effortless French style. European ethnicity.',
        region: 'European',
        country: 'France'
    },
    {
        id: 'm14',
        name: 'Li Wei',
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/2896434/pexels-photo-2896434.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'A sharp, high-fashion male model from Shanghai in his early 20s. Features striking, angular features, and a modern, edgy look. East Asian ethnicity.',
        region: 'Asian',
        country: 'China'
    },
    {
        id: 'm15',
        name: 'Sofia',
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'A charismatic female model from Colombia with tan skin, voluminous curly brown hair, and a joyful, energetic presence. Perfect for vibrant and summer collections. Latina ethnicity.',
        region: 'Latin',
        country: 'Colombia'
    },
    {
        id: 'm16',
        name: 'Khalid',
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'A luxurious male model from Dubai in his early 30s, with a perfectly groomed beard, intense gaze, and a polished, upscale look. Suited for luxury and formal wear. Emirati ethnicity.',
        region: 'Middle Eastern',
        country: 'UAE'
    },
    {
        id: 'm17',
        name: 'Adanna',
        gender: 'Female',
        thumbnail: 'https://images.pexels.com/photos/2776353/pexels-photo-2776353.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'A stunning female model from Nigeria with rich dark skin, braided hair, and a powerful, regal presence. Ideal for bold and couture fashion. Nigerian ethnicity.',
        region: 'African',
        country: 'Nigeria'
    },
    {
        id: 'm18',
        name: 'Mike',
        gender: 'Male',
        thumbnail: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=200&h=300&dpr=2',
        description: 'A strong male model from New York, with a confident attitude, and a versatile look that fits both streetwear and high fashion. African-American ethnicity.',
        region: 'African',
        country: 'USA'
    }
];

export const MODEL_REGIONS: readonly string[] = ['All', 'European', 'Asian', 'African', 'Latin', 'Middle Eastern'];


export const SHOT_TYPES_LIBRARY: ShotType[] = [
  // Standard E-commerce shots
  { id: 'st1', name: 'Full Body Front', category: 'Standard', description: 'in a full-body shot from the front, standing confidently, shot at eye-level.' },
  { id: 'st18', name: 'Hand on Hip', category: 'Standard', description: 'standing with one hand confidently placed on the hip, a classic fashion pose.' },
  { id: 'st2', name: 'Back View', category: 'Standard', description: 'in a full-body shot from the back to showcase the rear of the garment, shot at eye-level.' },
  { id: 'st3', name: '3/4 View', category: 'Standard', description: 'in a three-quarters view, showing the front and side of the outfit, shot at eye-level.' },
  { id: 'st16', name: 'Profile View', category: 'Standard', description: 'in a full-body shot from the side (profile view), showcasing the silhouette of the garment.' },
  { id: 'st4', name: 'Waist-Up', category: 'Standard', description: 'in a medium shot from the waist-up, focusing on the details of the upper garment.' },
  
  // Creative & Lifestyle shots
  { id: 'st5', name: 'Walking Motion', category: 'Creative', description: 'captured in a dynamic walking pose, as if in mid-stride on a city street.' },
  { id: 'st6', name: 'Elegant Lean', category: 'Creative', description: 'leaning elegantly against a surface, creating a relaxed but poised look.' },
  { id: 'st7', name: 'Sitting Pose', category: 'Creative', description: 'seated gracefully on a simple stool or chair, allowing the garment to drape naturally.' },
  { id: 'st8', name: 'Candid Look', category: 'Creative', description: 'looking away from the camera with a relaxed posture, creating a candid, lifestyle feel.' },
  { id: 'st9', name: 'Hero Pose', category: 'Creative', description: 'standing in a powerful pose, shot from a slightly low angle to convey confidence.' },
  { id: 'st10', name: 'Action Pose', category: 'Creative', description: 'in a dynamic, energetic pose like a jump or a sharp turn, showcasing the garment\'s movement.' },
  { id: 'st12', name: 'Looking Over Shoulder', category: 'Creative', description: 'glancing back over the shoulder, creating a dynamic and engaging look.' },
  { id: 'st14', name: 'Leaning Forward', category: 'Creative', description: 'leaning forward towards the camera with intensity, creating a dynamic and engaging composition.' },
  { id: 'st15', name: 'Hands in Pockets', category: 'Creative', description: 'casually standing with hands in pockets, conveying a relaxed and cool attitude.' },
  { id: 'st17', name: 'Dynamic Twirl', category: 'Creative', description: 'in a dynamic twirling motion, showcasing the movement and flow of the garment.' },
  // FIX: Added missing POV shot types for the 'pov' e-commerce pack.
  { id: 'st19', name: 'POV Selfie', category: 'Creative', description: 'in a point-of-view selfie shot, holding the camera, with a wide-angle lens effect.' },
  { id: 'st21', name: 'POV Mirror Selfie', category: 'Creative', description: 'taking a selfie in a large mirror, showcasing the full outfit in a casual setting.' },
  { id: 'st22', name: 'POV Action', category: 'Creative', description: 'from a first-person point of view, with hands holding an object like a coffee cup or phone, with the outfit visible in the frame.' },

  // Detail shots
  { id: 'st11', name: 'Close-up Detail', category: 'Detail', description: 'in a close-up shot focusing on a specific detail of the apparel, like the texture of the fabric, a button, or a collar.' },
  { id: 'st13', name: 'Accessory Focus', category: 'Detail', description: 'a close-up focused specifically on an accessory like a handbag, shoes, or jewelry, with the model partially visible.' },
  { id: 'st20', name: 'POV Outfit Check', category: 'Detail', description: 'shot from a high angle looking down at the outfit, as if checking it out from the wearer\'s point of view.' },
];

export const ECOMMERCE_PACKS: Record<EcommercePack, { name: string; description: string; shots: PackShot[] }> = {
    'none': { name: 'None', description: '', shots: [] },
    'essential': { 
        name: 'Essential Pack', 
        description: '4 standard shots with natural expressions.',
        shots: [
            { shotId: 'st1', expressionId: 'e2', name: 'Front (Smile)' },
            { shotId: 'st3', expressionId: 'e1', name: '3/4 View' },
            { shotId: 'st2', expressionId: 'e1', name: 'Back View' },
            { shotId: 'st11', expressionId: 'e1', name: 'Detail Shot' }
        ]
    },
    'plus': { 
        name: 'Plus Pack', 
        description: '6 varied shots for a complete look.',
        shots: [
            { shotId: 'st1', expressionId: 'e2', name: 'Front (Smile)' },
            { shotId: 'st3', expressionId: 'e3', name: '3/4 View (Confident)' },
            { shotId: 'st2', expressionId: 'e1', name: 'Back View' },
            { shotId: 'st16', expressionId: 'e1', name: 'Profile View' },
            { shotId: 'st4', expressionId: 'e2', name: 'Waist-Up (Smile)' },
            { shotId: 'st11', expressionId: 'e1', name: 'Detail Shot' }
        ]
    },
    'dynamic': { 
        name: 'Dynamic Pack', 
        description: '6 engaging lifestyle shots with personality.',
        shots: [
            { shotId: 'st1', expressionId: 'e3', name: 'Front (Confident)' },
            { shotId: 'st18', expressionId: 'e3', name: 'Hand on Hip' },
            { shotId: 'st5', expressionId: 'e4', name: 'Walking Motion' },
            { shotId: 'st12', expressionId: 'e6', name: 'Look Over Shoulder' },
            { shotId: 'st15', expressionId: 'e1', name: 'Hands in Pockets' },
            { shotId: 'st11', expressionId: 'e1', name: 'Detail Shot' }
        ]
    },
    'editorial': {
        name: 'Editorial Pack',
        description: '4 high-fashion, artistic shots for campaigns.',
        shots: [
            { shotId: 'st9', expressionId: 'e5', cameraAngleId: 'ca2', name: 'Hero Pose (Low Angle)' },
            { shotId: 'st6', expressionId: 'e7', name: 'Elegant Lean' },
            { shotId: 'st17', expressionId: 'e4', name: 'Dynamic Twirl' },
            { shotId: 'st14', expressionId: 'e5', cameraAngleId: 'ca1', name: 'Leaning Forward (Intense)' },
        ]
    },
    // FIX: Add missing 'pov' property to satisfy the EcommercePack type.
    'pov': {
        name: 'POV Pack',
        description: '4 casual, point-of-view shots for social media.',
        shots: [
            { shotId: 'st19', expressionId: 'e3', cameraAngleId: 'ca2', name: 'POV Selfie (Confident)' },
            { shotId: 'st20', expressionId: 'e1', cameraAngleId: 'ca3', name: 'Outfit Check' },
            { shotId: 'st21', expressionId: 'e6', name: 'Mirror Selfie' },
            { shotId: 'st22', expressionId: 'e1', name: 'Action POV' }
        ]
    }
};

export const SOCIAL_MEDIA_PACK_SHOT_IDS: readonly string[] = ['st8', 'st12']; // Two poses, will be generated in 1:1 and 9:16 = 4 images

export const BACKGROUNDS_LIBRARY: Background[] = [
  // Studio & Minimal
  { id: 'b1', name: 'Studio White', type: 'color', value: '#FFFFFF', category: 'Studio & Minimal' },
  { id: 'b2', name: 'Studio Grey', type: 'color', value: '#E0E0E0', category: 'Studio & Minimal' },
  { id: 'b10', name: 'Studio Black', type: 'color', value: '#111111', category: 'Studio & Minimal' },
  { id: 'b11', name: 'Pastel Gradient', type: 'gradient', value: 'linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%)', category: 'Studio & Minimal' },
  { id: 'b3', name: 'Sunset Gradient', type: 'gradient', value: 'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', category: 'Studio & Minimal' },
  { id: 'b13', name: 'Minimalist Gallery', type: 'image', value: 'https://picsum.photos/seed/gallery/1920/1080', category: 'Studio & Minimal' },

  // Architectural & Urban
  { id: 'b4', name: 'City Street', type: 'image', value: 'https://picsum.photos/seed/city/1920/1080', category: 'Architectural & Urban' },
  { id: 'b5', name: 'Modern Interior', type: 'image', value: 'https://picsum.photos/seed/interior/1920/1080', category: 'Architectural & Urban' },
  { id: 'b8', name: 'Brutalist Arch', type: 'image', value: 'https://picsum.photos/seed/architecture/1920/1080', category: 'Architectural & Urban' },
  { id: 'b9', name: 'Cozy Cafe', type: 'image', value: 'https://picsum.photos/seed/cafe/1920/1080', category: 'Architectural & Urban' },
  { id: 'b14', name: 'Industrial Loft', type: 'image', value: 'https://picsum.photos/seed/loft/1920/1080', category: 'Architectural & Urban' },
  { id: 'b16', name: 'Neon Cityscape', type: 'image', value: 'https://picsum.photos/seed/neon/1920/1080', category: 'Architectural & Urban' },
  { id: 'lbn9', name: 'Rooftop at Sunset', type: 'image', value: 'https://picsum.photos/seed/rooftop2/1920/1080', category: 'Architectural & Urban' },
  { id: 'lbn11', name: 'Luxury Hotel Lobby', type: 'image', value: 'https://picsum.photos/seed/hotellobby/1920/1080', category: 'Architectural & Urban' },

  // Nature & Outdoors
  { id: 'b6', name: 'Sunny Beach', type: 'image', value: 'https://picsum.photos/seed/beach/1920/1080', category: 'Nature & Outdoors' },
  { id: 'b7', name: 'Lush Forest', type: 'image', value: 'https://picsum.photos/seed/forest/1920/1080', category: 'Nature & Outdoors' },
  { id: 'b12', name: 'Rooftop Garden', type: 'image', value: 'https://picsum.photos/seed/rooftop/1920/1080', category: 'Nature & Outdoors' },
  { id: 'b15', name: 'Desert Dune', type: 'image', value: 'https://picsum.photos/seed/desert/1920/1080', category: 'Nature & Outdoors' },
  { id: 'lbn1', name: 'Mountain Vista', type: 'image', value: 'https://picsum.photos/seed/mountain/1920/1080', category: 'Nature & Outdoors' },
  { id: 'lbn2', name: 'Flower Field', type: 'image', value: 'https://picsum.photos/seed/flowers/1920/1080', category: 'Nature & Outdoors' },
  { id: 'lbn8', name: 'Autumn Forest', type: 'image', value: 'https://picsum.photos/seed/autumn/1920/1080', category: 'Nature & Outdoors' },
  
  // Themed & Artistic
  { id: 'b17', name: 'Old Library', type: 'image', value: 'https://picsum.photos/seed/library/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn3', name: 'Surreal Dreamscape', type: 'image', value: 'https://picsum.photos/seed/surreal/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn4', name: 'Abstract Shapes', type: 'image', value: 'https://picsum.photos/seed/abstract/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn5', name: 'Vintage Room', type: 'image', value: 'https://picsum.photos/seed/vintage/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn6', name: 'Sci-Fi Corridor', type: 'image', value: 'https://picsum.photos/seed/scifi/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn7', name: 'Graffiti Wall', type: 'image', value: 'https://picsum.photos/seed/graffiti/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn10', name: 'Art Deco Lobby', type: 'image', value: 'https://picsum.photos/seed/artdeco/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn12', name: 'Cyberpunk Alley', type: 'image', value: 'https://picsum.photos/seed/cyberpunk/1920/1080', category: 'Themed & Artistic' },
  { id: 'lbn13', name: 'Bohemian Cafe', type: 'image', value: 'https://picsum.photos/seed/bohemiancafe/1920/1080', category: 'Themed & Artistic' },
];

export const LIGHTING_PRESETS: Lighting[] = [
  { id: 'l_match', name: "Match Model's Lighting", description: 'lighting style dynamically analyzed from the uploaded model image.', isDynamic: true },
  { id: 'l1', name: 'Studio Softbox', description: 'soft, diffused studio lighting from the front.' },
  { id: 'l7', name: 'Flat & Even', description: 'bright, even, and nearly shadowless lighting, perfect for clear e-commerce shots.' },
  { id: 'l2', name: 'Golden Hour', description: 'warm, golden hour sunlight from the side.' },
  { id: 'l3', name: 'Dramatic Hard Light', description: 'dramatic hard lighting creating strong shadows.' },
  { id: 'l8', name: 'Midday Sun', description: 'bright, direct midday sun creating harsh, defined shadows.' },
  { id: 'l9', name: 'Overcast Day', description: 'soft, diffused light from an overcast sky, minimizing shadows.' },
  { id: 'l10', name: 'Blue Hour', description: 'cool, soft, ambient light during twilight (blue hour).' },
  { id: 'l5', name: 'Dappled Sunlight', description: 'natural, dappled sunlight filtering through leaves, creating soft patterns.' },
  { id: 'l15', name: 'Window Light', description: 'soft, directional light as if from a large window, creating a classic Rembrandt-style look.' },
  { id: 'l4', name: 'Rim Light', description: 'strong backlighting to create a bright outline around the model.' },
  { id: 'l6', name: 'Neon Glow', description: 'vibrant, colorful light as if from neon signs, casting pink and blue hues.' },
  { id: 'l11', name: 'Moonlight', description: 'a cool, low-light scene illuminated by moonlight, creating a mysterious mood.' },
  { id: 'l12', name: 'Split Lighting', description: 'classic portrait lighting that splits the face into light and shadow, creating a dramatic, moody effect.' },
  { id: 'l13', name: 'Candlelight', description: 'a very warm, soft, and flickering light as if from a single candle, creating an intimate and historic mood.' },
  { id: 'l14', name: 'Projector Light', description: 'artistic lighting where patterns or images from a projector are cast onto the model and background.' },
  { id: 'l16', name: 'Gobo Patterns', description: 'light projected through a patterned screen (a gobo) to create artistic shadows, like Venetian blinds or foliage.' },
];

export const TIME_OF_DAY_OPTIONS: { readonly id: string; readonly name: 'None' | 'Sunrise' | 'Midday' | 'Golden Hour' | 'Twilight' | 'Night'; }[] = [
    { id: 'tod_none', name: 'None' },
    { id: 'tod_sunrise', name: 'Sunrise' },
    { id: 'tod_midday', name: 'Midday' },
    { id: 'tod_golden_hour', name: 'Golden Hour' },
    { id: 'tod_twilight', name: 'Twilight' },
    { id: 'tod_night', name: 'Night' },
];

export const EXPRESSIONS: Expression[] = [
  { id: 'e1', name: 'Neutral', description: 'a neutral, high-fashion expression.' },
  { id: 'e2', name: 'Soft Smile', description: 'a gentle, soft smile.' },
  { id: 'e3', name: 'Confident', description: 'a confident and strong expression.' },
  { id: 'e4', name: 'Joyful', description: 'a joyful, laughing expression.' },
  { id: 'e5', name: 'Serious', description: 'a serious, intense, high-fashion expression.' },
  { id: 'e6', name: 'Playful', description: 'a playful, winking, or smirking expression.' },
  { id: 'e7', name: 'Serene', description: 'a serene, calm, and peaceful expression.' },
];

export const APERTURES_LIBRARY: Aperture[] = [
  { id: 'ap1', name: 'Shallow (f/1.8)', description: 'using a wide aperture (like f/1.8) to create a beautifully blurred background (bokeh)' },
  { id: 'ap2', name: 'Mid-Range (f/4)', description: 'using a mid-range aperture (like f/4) for a moderately sharp background' },
  { id: 'ap3', name: 'Deep (f/8)', description: 'using a narrow aperture (like f/8) to keep both the model and the background in sharp focus' },
];

export const ASPECT_RATIOS_LIBRARY: AspectRatio[] = [
    { id: 'ar1', name: 'Portrait', value: '3:4', icon: React.createElement(RectangleVertical, { size: 18 }) },
    { id: 'ar2', name: 'Square', value: '1:1', icon: React.createElement(Square, { size: 16 }) },
    { id: 'ar3', name: 'Landscape', value: '4:3', icon: React.createElement(RectangleHorizontal, { size: 18 }) },
    { id: 'ar4', name: 'Stories', value: '9:16', icon: React.createElement(RectangleVertical, { size: 20 }) },
];

export const FOCAL_LENGTHS_LIBRARY: FocalLength[] = [
  { id: 'fl4', name: '24mm (Ultra-Wide)', description: 'a 24mm ultra-wide lens, creating a dramatic, expansive look that emphasizes the environment.' },
  { id: 'fl1', name: '35mm (Wide)', description: 'a 35mm wide-angle lens, capturing more of the environment' },
  { id: 'fl2', name: '50mm (Standard)', description: 'a 50mm standard lens, mimicking human eyesight for a natural look' },
  { id: 'fl3', name: '85mm (Portrait)', description: 'an 85mm portrait lens, slightly compressing the background for a flattering look' },
  { id: 'fl5', name: '135mm (Telephoto)', description: 'a 135mm telephoto lens, creating a highly compressed, intimate, and professional portrait look.' },
];

export const CAMERA_ANGLES_LIBRARY: CameraAngle[] = [
    { id: 'ca1', name: 'Eye-Level', description: 'shot from a neutral, eye-level angle.' },
    { id: 'ca2', name: 'Low Angle', description: 'shot from a low angle, looking up at the model to create a sense of power and height.' },
    { id: 'ca3', name: 'High Angle', description: 'shot from a high angle, looking down at the model for a more artistic or vulnerable feel.' },
    { id: 'ca4', 'name': 'Dutch Angle', 'description': 'shot with the camera tilted to one side, creating a sense of unease or dynamism.' },
    { id: 'ca5', name: "Worm's Eye View", description: 'shot from an extremely low angle, close to the ground, for a highly dramatic and imposing perspective.' },
    { id: 'ca6', name: "Bird's Eye View", description: 'shot from a high overhead angle, but not directly top-down, as if from a balcony.' },
];

export const FABRIC_TYPES_LIBRARY: Fabric[] = [
    { id: 'fab1', name: 'As Described', description: 'The AI will infer the fabric from the garment description.' },
    { id: 'fab2', name: 'Cotton', description: 'a crisp, breathable cotton texture.' },
    { id: 'fab3', name: 'Silk', description: 'a smooth, lustrous silk with soft highlights.' },
    { id: 'fab4', name: 'Denim', description: 'a sturdy, textured denim material.' },
    { id: 'fab5', name: 'Wool', description: 'a soft, slightly fuzzy wool knit.' },
    { id: 'fab6', name: 'Leather', description: 'a sleek leather texture with sharp highlights.' },
    { id: 'fab7', name: 'Linen', description: 'a lightweight, breathable linen texture with characteristic subtle wrinkles.' },
    { id: 'fab8', name: 'Velvet', description: 'a plush, soft velvet that absorbs light, with deep, rich tones.' },
];

export const COLOR_GRADING_PRESETS: ColorGrade[] = [
    { id: 'cg_none', name: 'None', description: 'A natural, unstyled color grade.' },
    { id: 'cg1', name: 'Cinematic Teal & Orange', description: 'a cinematic look with teal shadows and orange skin tones.' },
    { id: 'cg2', name: 'Vintage Film', description: 'a warm, faded look with slightly desaturated colors and soft grain, reminiscent of old film stock.' },
    { id: 'cg3', name: 'High-Contrast B&W', description: 'a dramatic black and white conversion with deep blacks and bright whites.' },
    { id: 'cg4', name: 'Vibrant & Punchy', description: 'a vibrant, high-saturation look that makes colors pop.' },
    { id: 'cg5', name: 'Muted & Moody', description: 'a desaturated, moody look with deep shadows and a slightly green or blue tint, ideal for dramatic storytelling.' },
    { id: 'cg6', name: 'Warm & Golden', description: 'a warm, golden-toned grade that enhances skin tones and creates a sunny, inviting atmosphere.' },
    { id: 'cg7', name: 'Cool & Crisp', description: 'a cool-toned grade with crisp whites and blues, giving a clean, modern, and fresh feel.' },
];

export const IMAGE_COUNT_OPTIONS: { readonly id: string; readonly name: string; }[] = [
    { id: 'img_count_1', name: '1' },
    { id: 'img_count_2', name: '2' },
    { id: 'img_count_4', name: '4' },
    { id: 'img_count_6', name: '6' },
    { id: 'img_count_8', name: '8' },
];

export const LIGHTING_DIRECTIONS_LIBRARY: LightingDirection[] = [
    { id: 'ld1', name: 'As Described', description: 'determined by the lighting preset.' },
    { id: 'ld2', name: 'Front', description: 'from the front of the model.' },
    { id: 'ld3', name: 'Side Left', description: 'from the model\'s left side.' },
    { id: 'ld4', name: 'Side Right', description: 'from the model\'s right side.' },
    { id: 'ld5', name: 'Backlight (Rim)', description: 'from behind the model, creating a bright rim effect.' },
    { id: 'ld6', name: 'Top-down', description: 'from directly above the model.' },
];

export const LIGHT_QUALITIES_LIBRARY: LightQuality[] = [
    { id: 'lq1', name: 'As Described', description: 'determined by the lighting preset.' },
    { id: 'lq2', name: 'Soft (Diffused)', description: 'soft and diffused, creating gentle, wrapping shadows.' },
    { id: 'lq3', name: 'Hard (Direct)', description: 'direct and hard, creating sharp, defined shadows.' },
];

export const CATCHLIGHT_STYLES_LIBRARY: CatchlightStyle[] = [
    { id: 'cs1', name: 'Natural', description: 'natural-looking catchlights in the model\'s eyes, appropriate for the scene.' },
    { id: 'cs2', name: 'Ring Light', description: 'a distinct circular ring-light-style catchlight in the model\'s eyes.' },
    { id: 'cs3', name: 'None', description: 'no specific catchlight should be visible in the model\'s eyes.' },
];

export const PRODUCT_SHADOW_OPTIONS: { readonly id: 'None' | 'Soft' | 'Hard'; readonly name: string; description: string }[] = [
    { id: 'Soft', name: 'Soft', description: 'a soft, diffused shadow, as if from an overcast day or large studio light.' },
    { id: 'Hard', name: 'Hard', description: 'a hard, defined shadow, as if from direct sunlight.' },
    { id: 'None', name: 'None', description: 'no shadow should be cast by the product.' },
];

export const PRODUCT_ECOMMERCE_PACKS: Record<ProductEcommercePack, { name: string; description: string; shots: ProductPackShot[] }> = {
    'none': { name: 'None', description: '', shots: [] },
    'essential': { 
        name: 'Essential Pack', 
        description: '4 standard shots for product listings.',
        shots: [
            { name: 'Front View', cameraAngleId: 'cap1' }, // Eye-Level
            { name: '45-Degree View', cameraAngleId: 'cap4' }, // 45-Degree
            { name: 'Top-Down View', cameraAngleId: 'cap2' }, // Top-Down
            { name: 'Hero View', cameraAngleId: 'cap3' }, // Hero Shot (Low Angle)
        ]
    },
    'plus': { 
        name: 'Plus Pack', 
        description: '6 shots including detailed and side views.',
        shots: [
            { name: 'Front View', cameraAngleId: 'cap1', focalLengthId: 'fl2' }, // 50mm
            { name: 'Angled View (Left)', cameraAngleId: 'cap4', focalLengthId: 'fl2' }, // 45-Degree
            { name: 'Angled View (Right)', cameraAngleId: 'cap4', focalLengthId: 'fl2'}, // 45-Degree, prompt will need to specify right
            { name: 'Top-Down View', cameraAngleId: 'cap2', focalLengthId: 'fl2' }, // Top-Down
            { name: 'Hero View', cameraAngleId: 'cap3', focalLengthId: 'fl1' }, // Hero with Wide 35mm
            { name: 'Detail Shot', cameraAngleId: 'cap1', focalLengthId: 'fl5' } // Eye-Level with Telephoto 135mm for detail
        ]
    },
};

// --- PRODUCT-SPECIFIC LIBRARIES ---

export const PRODUCT_INTERACTION_LIBRARY: ProductInteraction[] = [
    { id: 'pi1', name: 'Holding', description: 'holding the product in their hands, presenting it towards the camera.' },
    { id: 'pi2', name: 'Wearing', description: 'wearing the product as it is intended to be worn (e.g., a watch on the wrist, a necklace around the neck).' },
    { id: 'pi3', name: 'Presenting', description: 'presenting the product on a tray or open palm.' },
    { id: 'pi4', name: 'Interacting', description: 'interacting with the product, such as opening a container or using a device.' },
    { id: 'custom', name: 'Custom...' },
];

export const SURFACE_LIBRARY: Surface[] = [
    { id: 'surf_none', name: 'None', description: 'is presented without a distinct surface, as if floating or on a simple plane.' },
    { id: 'surf1', name: 'Marble Slab', description: 'placed on a clean, white marble slab with subtle grey veining.' },
    { id: 'surf2', name: 'Polished Wood', description: 'placed on a dark, polished wood surface with rich grain.' },
    { id: 'surf3', name: 'Textured Concrete', description: 'placed on a neutral grey, textured concrete surface for a modern, industrial look.' },
    { id: 'surf4', name: 'Brushed Metal', description: 'placed on a brushed metal surface that catches the light with a soft sheen.' },
    { id: 'surf5', name: 'Black Slate', description: 'placed on a dark, matte black slate surface for a dramatic, high-contrast look.' },
];

export const PRODUCT_MATERIAL_LIBRARY: Material[] = [
    { id: 'mat1', name: 'Matte', description: 'a non-reflective, matte material finish.', category: 'Standard' },
    { id: 'mat2', name: 'Glossy', description: 'a shiny, glossy plastic or ceramic material.', category: 'Standard' },
    { id: 'mat3', name: 'Metallic', description: 'a reflective, brushed or polished metallic material.', category: 'Standard' },
    { id: 'mat4', name: 'Glass', description: 'a transparent or semi-transparent glass material.', category: 'Standard' },
    { id: 'mat_art_1', name: 'Shining Marble', description: 'an ultra-detailed sculpture made of shining marble. The surface should be smooth and reflective, emphasizing its luster. The lighting should enhance the sculpture\'s contours and textures.', category: 'Artistic' },
    { id: 'mat_art_2', name: 'Cast Bronze', description: 'a sculpture made of cast bronze with a slight patina. The lighting should catch the metallic sheen and highlight the form.', category: 'Artistic' },
    { id: 'mat_art_3', name: 'Carved Wood', description: 'an intricate sculpture hand-carved from a single piece of dark wood, showing the grain and texture of the material.', category: 'Artistic' },
];

export const CAMERA_ANGLES_LIBRARY_PRODUCT: CameraAngle[] = [
    { id: 'cap1', name: 'Eye-Level', description: 'shot from a neutral, eye-level angle, as if sitting on a table.' },
    { id: 'cap2', name: 'Top-Down (Flat Lay)', description: 'shot from directly above in a flat-lay composition.' },
    { id: 'cap3', name: 'Hero Shot (Low Angle)', description: 'shot from a slightly low angle to give the product a powerful, heroic presence.' },
    { id: 'cap4', name: '45-Degree E-commerce', description: 'shot from a standard 45-degree angle, a classic for e-commerce.' },
];

export const LIGHTING_PRESETS_PRODUCT: Lighting[] = [
  { id: 'lp1', name: 'Clean E-commerce', description: 'bright, even, and nearly shadowless lighting, perfect for clear catalog shots against a simple background.' },
  { id: 'lp2', name: 'Dramatic Product', description: 'a single, hard light source from the side, creating deep shadows and highlighting texture.' },
  { id: 'lp3', name: 'Natural Window Light', description: 'soft, diffused, directional light as if from a large nearby window.' },
  { id: 'lp4', name: 'Studio Ring Light', description: 'direct, even light from the front, creating a distinct circular catchlight on reflective surfaces.' },
  { id: 'lp5', name: 'Luxe & Moody', description: 'low-key lighting with soft, focused spotlights to create a luxurious and mysterious mood.' },
];

export const THEMED_SCENE_TEMPLATES: ProductSceneTemplate[] = [
    {
        id: 'theme_collector',
        name: "Collector's Desk",
        description: "Stages your product as a collectible figurine on an artist's desk.",
        scene: {
            lighting: LIGHTING_PRESETS_PRODUCT.find(l => l.id === 'lp3')!, // Natural Window Light
            background: BACKGROUNDS_LIBRARY.find(b => b.id === 'b9')!, // Cozy Cafe (proxy for desk)
        },
        controls: {
            productMaterial: PRODUCT_MATERIAL_LIBRARY.find(m => m.id === 'mat2')!, // Glossy
            surface: SURFACE_LIBRARY.find(s => s.id === 'surf2')!, // Polished Wood
            cameraAngle: CAMERA_ANGLES_LIBRARY_PRODUCT.find(c => c.id === 'cap4')!, // 45-degree
            focalLength: FOCAL_LENGTHS_LIBRARY.find(f => f.id === 'fl3')!, // 85mm Portrait
            aperture: APERTURES_LIBRARY.find(a => a.id === 'ap1')!, // Shallow
            customProps: 'The figurine is placed on a wooden artist’s desk, scattered with sketchbooks and paintbrushes. Next to it is a toy packaging box styled like an artbook, decorated with colorful concept sketches.'
        }
    }
];


// --- DESIGN-SPECIFIC LIBRARIES ---

export const DESIGN_SCENE_TEMPLATES: DesignSceneTemplate[] = [
    {
        id: 'scene_cafe',
        name: "Modern Cafe",
        description: "A relaxed, candid shot in a bright cafe with soft window light.",
        scene: {
            background: BACKGROUNDS_LIBRARY.find(b => b.id === 'b9')!, // Cozy Cafe
            lighting: LIGHTING_PRESETS.find(l => l.id === 'l15')!, // Window Light
        },
        photography: {
            lightingStyle: 'dramatic',
            cameraAngle: 'angled',
        }
    },
    {
        id: 'scene_loft',
        name: "Industrial Loft",
        description: "A clean, high-fashion look in a spacious industrial loft with diffused daylight.",
        scene: {
            background: BACKGROUNDS_LIBRARY.find(b => b.id === 'b14')!, // Industrial Loft
            lighting: LIGHTING_PRESETS.find(l => l.id === 'l9')!, // Overcast Day
        },
        photography: {
            lightingStyle: 'studio',
            cameraAngle: 'front',
        }
    },
    {
        id: 'scene_studio',
        name: "Sunlit Studio",
        description: "A warm, artistic shot in a minimalist gallery during golden hour.",
        scene: {
            background: BACKGROUNDS_LIBRARY.find(b => b.id === 'b13')!, // Minimalist Gallery
            lighting: LIGHTING_PRESETS.find(l => l.id === 'l2')!, // Golden Hour
        },
        photography: {
            lightingStyle: 'dramatic',
            cameraAngle: 'hero',
        }
    },
    {
        id: 'scene_street',
        name: "Urban Street Style",
        description: "An edgy, vibrant shot against a graffiti wall with bright, direct sun.",
        scene: {
            background: BACKGROUNDS_LIBRARY.find(b => b.id === 'lbn7')!, // Graffiti Wall
            lighting: LIGHTING_PRESETS.find(l => l.id === 'l8')!, // Midday Sun
        },
        photography: {
            lightingStyle: 'dramatic',
            cameraAngle: 'angled',
        }
    }
];

export const PRINT_STYLE_OPTIONS: { readonly id: PrintStyle; readonly name: string; }[] = [
    { id: 'screen', name: 'Screen Print' },
    { id: 'embroidery', name: 'Embroidery' },
    { id: 'vintage', name: 'Vintage/Cracked' },
    { id: 'puff', name: 'Puff Print' },
];

export const DESIGN_PLACEMENT_OPTIONS: { readonly id: DesignPlacement; readonly name: string; readonly defaultScale: number; }[] = [
    { id: 'frontTopCenter', name: 'Top Center', defaultScale: 30 },
    { id: 'leftChest', name: 'Left Chest', defaultScale: 25 },
    { id: 'rightChest', name: 'Right Chest', defaultScale: 25 },
    { id: 'frontCenter', name: 'Front Center (Middle)', defaultScale: 80 },
    { id: 'fullFront', name: 'Full Front', defaultScale: 110 },
    { id: 'leftSleeve', name: 'Left Sleeve', defaultScale: 20 },
    { id: 'backCenter', name: 'Back Center', defaultScale: 85 },
];

export const MOCKUP_STYLE_OPTIONS: { readonly id: MockupStyle; readonly name: string; }[] = [
    { id: 'hanging', name: 'Hanging' },
    { id: 'flatLay', name: 'Flat Lay' },
    { id: 'folded', name: 'Folded' },
];

export const FABRIC_STYLE_OPTIONS: { readonly id: FabricStyle; readonly name: string; }[] = [
    { id: 'standard', name: 'Standard Jersey' },
    { id: 'heavy', name: 'Heavy Cotton' },
    { id: 'vintage', name: 'Vintage Wash' },
    { id: 'acidWash', name: 'Acid Wash' },
];

export const DESIGN_LIGHTING_STYLE_OPTIONS: { readonly id: DesignLightingStyle; readonly name: string; }[] = [
    { id: 'studio', name: 'Studio Softbox' },
    { id: 'dramatic', name: 'Dramatic Side' },
    { id: 'topDown', name: 'Top-Down' },
];

export const DESIGN_CAMERA_ANGLE_OPTIONS: { readonly id: DesignCameraAngle; readonly name: string; }[] = [
    { id: 'front', name: 'Eye-Level Front' },
    { id: 'back', name: 'Eye-Level Back' },
    { id: 'angled', name: 'Angled View' },
    { id: 'hero', name: 'Hero Shot' },
    { id: 'detail', name: 'Design Close-up' },
];

export const MOCKUP_PACK_SHOTS_3: { name: string; angle: DesignCameraAngle; lighting: DesignLightingStyle; view: 'front' }[] = [
    { name: 'Front View', angle: 'front', lighting: 'studio', view: 'front' },
    { name: 'Angled View', angle: 'angled', lighting: 'studio', view: 'front' },
    { name: 'Detail View', angle: 'detail', lighting: 'dramatic', view: 'front' },
];

export const MOCKUP_PACK_SHOTS_4: { name: string; angle: DesignCameraAngle; lighting: DesignLightingStyle; view: 'front' | 'back' }[] = [
    { name: 'Front View', angle: 'front', lighting: 'studio', view: 'front' },
    { name: 'Back View', angle: 'back', lighting: 'studio', view: 'back' },
    { name: 'Angled View', angle: 'angled', lighting: 'studio', view: 'front' },
    { name: 'Detail View (Front)', angle: 'detail', lighting: 'dramatic', view: 'front' },
];