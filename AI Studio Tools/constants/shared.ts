import React from 'react';
import { Square, RectangleVertical, RectangleHorizontal } from 'lucide-react';
import type { Background, Lighting, Aperture, Animation, AspectRatio, FocalLength, ColorGrade, CameraAngle, LightingDirection, LightQuality, CatchlightStyle } from '../types';

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

export const APERTURES_LIBRARY: Aperture[] = [
  { id: 'ap1', name: 'Shallow (f/1.8)', description: 'using a wide aperture (like f/1.8) to create a beautifully blurred background (bokeh)' },
  { id: 'ap2', name: 'Mid-Range (f/4)', description: 'using a mid-range aperture (like f/4) for a moderately sharp background' },
  { id: 'ap3', name: 'Deep (f/8)', description: 'using a narrow aperture (like f/8) to keep both the model and the background in sharp focus' },
];

export const ANIMATION_STYLES_LIBRARY: Animation[] = [
  { id: 'an1', name: 'Subtle Turn', description: 'making a slow, 3/4 turn to showcase the outfit.' },
  { id: 'an2', name: 'Gentle Sway', description: 'gently swaying, as if a light breeze is present.' },
  { id: 'an3', name: 'Catwalk Loop', description: 'walking in a short, seamless loop, as if on a catwalk.' },
  { id: 'an4', name: 'Slow Zoom In', description: 'a slow, cinematic zoom-in on the model.' },
  { id: 'an5', name: 'Hair in Wind', description: 'the model\'s hair is gently blowing in the wind.' },
  { id: 'an6', name: 'Joyful Laugh', description: 'a natural, joyful laughing motion.' },
  { id: 'an7', name: 'Look Around', description: 'the model slowly looks from side to side, as if observing the scene.' },
  { id: 'an8', name: 'Orbiting Camera', description: 'a smooth, orbiting camera shot that moves around the model.' },
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