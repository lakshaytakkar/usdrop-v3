import type { AIModel, ShotType, EcommercePack, PackShot, Expression, Fabric } from '../types';

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
    },
    {
        id: 'm19',
        name: 'Ryan',
        gender: 'Male',
        thumbnail: '/models/model-american-male-young-1.png',
        description: 'A professional young American male model in his mid-20s, with a clean-cut appearance and confident expression. Perfect for business and formal wear. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    {
        id: 'm20',
        name: 'Emma',
        gender: 'Female',
        thumbnail: '/models/model-american-female-young-1.png',
        description: 'A vibrant young American female model in her early 20s, with a friendly smile and natural beauty. Ideal for commercial and lifestyle fashion. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    {
        id: 'm21',
        name: 'Robert',
        gender: 'Male',
        thumbnail: '/models/model-american-male-old-1.png',
        description: 'A distinguished mature American male model in his late 50s, with salt-and-pepper hair and a confident, professional appearance. Perfect for luxury and executive brands. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    {
        id: 'm22',
        name: 'Patricia',
        gender: 'Female',
        thumbnail: '/models/model-american-female-old-1.png',
        description: 'An elegant mature American female model in her late 50s, with sophisticated style and refined presence. Ideal for luxury and mature fashion markets. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    {
        id: 'm23',
        name: 'Arjun',
        gender: 'Male',
        thumbnail: '/models/model-indian-male-young-1.png',
        description: 'A confident young Indian male model in his mid-20s, with South Asian features and a professional appearance. Perfect for contemporary and traditional fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India'
    },
    {
        id: 'm24',
        name: 'Kavya',
        gender: 'Female',
        thumbnail: '/models/model-indian-female-young-1.png',
        description: 'A beautiful young Indian female model in her early 20s, with South Asian features and a warm, engaging smile. Ideal for both traditional and modern fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India'
    },
    {
        id: 'm25',
        name: 'Vikram',
        gender: 'Male',
        thumbnail: '/models/model-indian-male-old-1.png',
        description: 'A distinguished mature Indian male model in his late 50s, with salt-and-pepper beard and a confident, professional appearance. Perfect for luxury and executive brands. Indian ethnicity.',
        region: 'Asian',
        country: 'India'
    },
    {
        id: 'm26',
        name: 'Meera',
        gender: 'Female',
        thumbnail: '/models/model-indian-female-old-1.png',
        description: 'An elegant mature Indian female model in her late 50s, with sophisticated South Asian features and traditional elegance. Ideal for luxury and traditional fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India'
    },
    {
        id: 'm27',
        name: 'Tyler',
        gender: 'Male',
        thumbnail: '/models/model-american-male-young-2.png',
        description: 'A versatile young American male model in his mid-20s, with an athletic build and casual confident look. Perfect for lifestyle and sportswear brands. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    {
        id: 'm28',
        name: 'Sophia',
        gender: 'Female',
        thumbnail: '/models/model-american-female-young-2.png',
        description: 'A vibrant young American female model in her early 20s, with a modern style and engaging personality. Ideal for contemporary and trendy fashion. Caucasian ethnicity.',
        region: 'European',
        country: 'USA'
    },
    {
        id: 'm29',
        name: 'Rohan',
        gender: 'Male',
        thumbnail: '/models/model-indian-male-young-2.png',
        description: 'A professional young Indian male model in his mid-20s, with a contemporary South Asian look and modern style. Perfect for business and contemporary fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India'
    },
    {
        id: 'm30',
        name: 'Ananya',
        gender: 'Female',
        thumbnail: '/models/model-indian-female-young-2.png',
        description: 'A stunning young Indian female model in her early 20s, with contemporary South Asian beauty and modern fashion sense. Ideal for contemporary and fusion fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India'
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

export const EXPRESSIONS: Expression[] = [
  { id: 'e1', name: 'Neutral', description: 'a neutral, high-fashion expression.' },
  { id: 'e2', name: 'Soft Smile', description: 'a gentle, soft smile.' },
  { id: 'e3', name: 'Confident', description: 'a confident and strong expression.' },
  { id: 'e4', name: 'Joyful', description: 'a joyful, laughing expression.' },
  { id: 'e5', name: 'Serious', description: 'a serious, intense, high-fashion expression.' },
  { id: 'e6', name: 'Playful', description: 'a playful, winking, or smirking expression.' },
  { id: 'e7', name: 'Serene', description: 'a serene, calm, and peaceful expression.' },
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