import type { AIModel, ShotType, EcommercePack, PackShot, Expression, Fabric } from '../types';

export const MODELS_LIBRARY: AIModel[] = [
    {
        id: 'm1',
        name: 'Ryan',
        gender: 'Male',
        thumbnail: '/models/model-american-male-young-1.png',
        description: 'A professional young American male model in his mid-20s, with a clean-cut appearance and confident expression. Perfect for business and formal wear. Caucasian ethnicity.',
        region: 'European',
        country: 'USA',
        age: 25
    },
    {
        id: 'm2',
        name: 'Emma',
        gender: 'Female',
        thumbnail: '/models/model-american-female-young-1.png',
        description: 'A vibrant young American female model in her early 20s, with a friendly smile and natural beauty. Ideal for commercial and lifestyle fashion. Caucasian ethnicity.',
        region: 'European',
        country: 'USA',
        age: 22
    },
    {
        id: 'm3',
        name: 'Robert',
        gender: 'Male',
        thumbnail: '/models/model-american-male-old-1.png',
        description: 'A distinguished mature American male model in his late 50s, with salt-and-pepper hair and a confident, professional appearance. Perfect for luxury and executive brands. Caucasian ethnicity.',
        region: 'European',
        country: 'USA',
        age: 58
    },
    {
        id: 'm4',
        name: 'Patricia',
        gender: 'Female',
        thumbnail: '/models/model-american-female-old-1.png',
        description: 'An elegant mature American female model in her late 50s, with sophisticated style and refined presence. Ideal for luxury and mature fashion markets. Caucasian ethnicity.',
        region: 'European',
        country: 'USA',
        age: 57
    },
    {
        id: 'm5',
        name: 'Arjun',
        gender: 'Male',
        thumbnail: '/models/model-indian-male-young-1.png',
        description: 'A confident young Indian male model in his mid-20s, with South Asian features and a professional appearance. Perfect for contemporary and traditional fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India',
        age: 26
    },
    {
        id: 'm6',
        name: 'Kavya',
        gender: 'Female',
        thumbnail: '/models/model-indian-female-young-1.png',
        description: 'A beautiful young Indian female model in her early 20s, with South Asian features and a warm, engaging smile. Ideal for both traditional and modern fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India',
        age: 23
    },
    {
        id: 'm7',
        name: 'Vikram',
        gender: 'Male',
        thumbnail: '/models/model-indian-male-old-1.png',
        description: 'A distinguished mature Indian male model in his late 50s, with salt-and-pepper beard and a confident, professional appearance. Perfect for luxury and executive brands. Indian ethnicity.',
        region: 'Asian',
        country: 'India',
        age: 59
    },
    {
        id: 'm8',
        name: 'Meera',
        gender: 'Female',
        thumbnail: '/models/model-indian-female-old-1.png',
        description: 'An elegant mature Indian female model in her late 50s, with sophisticated South Asian features and traditional elegance. Ideal for luxury and traditional fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India',
        age: 56
    },
    {
        id: 'm9',
        name: 'Tyler',
        gender: 'Male',
        thumbnail: '/models/model-american-male-young-2.png',
        description: 'A versatile young American male model in his mid-20s, with an athletic build and casual confident look. Perfect for lifestyle and sportswear brands. Caucasian ethnicity.',
        region: 'European',
        country: 'USA',
        age: 24
    },
    {
        id: 'm10',
        name: 'Sophia',
        gender: 'Female',
        thumbnail: '/models/model-american-female-young-2.png',
        description: 'A vibrant young American female model in her early 20s, with a modern style and engaging personality. Ideal for contemporary and trendy fashion. Caucasian ethnicity.',
        region: 'European',
        country: 'USA',
        age: 21
    },
    {
        id: 'm11',
        name: 'Rohan',
        gender: 'Male',
        thumbnail: '/models/model-indian-male-young-2.png',
        description: 'A professional young Indian male model in his mid-20s, with a contemporary South Asian look and modern style. Perfect for business and contemporary fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India',
        age: 25
    },
    {
        id: 'm12',
        name: 'Ananya',
        gender: 'Female',
        thumbnail: '/models/model-indian-female-young-2.png',
        description: 'A stunning young Indian female model in her early 20s, with contemporary South Asian beauty and modern fashion sense. Ideal for contemporary and fusion fashion. Indian ethnicity.',
        region: 'Asian',
        country: 'India',
        age: 22
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