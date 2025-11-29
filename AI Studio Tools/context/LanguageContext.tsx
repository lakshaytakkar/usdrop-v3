import React, { createContext, useContext, ReactNode } from 'react';

const translations = {
  en: {
    back: 'Back',
    photoshoot_title: 'Multipose Photoshoot',
    remove_image: 'Remove Image',
    photoshoot_uploader_title: 'Upload Source Image',
    photoshoot_uploader_subtitle: 'Drop a clear, high-quality photo of your model',
    photoshoot_concepts_title: '1. AI Art Director',
    photoshoot_concepts_generate_button: 'Generate Concepts',
    photoshoot_concepts_generating: 'Generating...',
    photoshoot_settings_title: '2. Photoshoot Settings',
    photoshoot_settings_placeholder: 'Advanced settings will be available here.',
    photoshoot_generate_button: 'Run Photoshoot',
    photoshoot_generating_button: 'Running Photoshoot...',
    photoshoot_results_title: 'Your Photoshoot Awaits',
    photoshoot_results_subtitle: 'Generated images will appear here once you run a photoshoot.',
    download: 'Download',
    retry: 'Retry',
    // FIX: Add missing translation key for photoshoot source image alt text.
    photoshoot_source_alt: 'Source image for photoshoot',
    // FIX: Add all missing translation keys for the Photoshoot component.
    'photoshoot.dropImage': 'Drop image here',
    'photoshoot.addImage': 'Add image',
    'photoshoot.noImagesGeneratedError': 'No images have been generated yet.',
    'photoshoot.waitForAllImagesError': 'Please wait for all images to finish generating.',
    'photoshoot.zipCreationError': 'Failed to create ZIP file.',
    'photoshoot.dropToUpload': 'Drop to upload',
    'photoshoot.originalClickToChange': 'Original — Click to change',
    'photoshoot.clickToUpload': 'Click to upload',
    'common.backToTools': 'Back to Tools',
    'app.photoshootTitle': 'Multipose Photoshoot',
    'photoshoot.subtitle': 'Generate multiple photorealistic views of your model.',
    'photoshoot.step1Title': 'Step 1: Your Model',
    'photoshoot.uploadTab': 'Upload',
    'photoshoot.generateTab': 'Generate',
    'photoshoot.uploadInstructions': 'Upload a clear, high-quality photo of your model.',
    'photoshoot.modelGenPlaceholder': 'e.g., A professional female fashion model, blonde hair, blue eyes...',
    'photoshoot.generatingModel': 'Generating Model...',
    'photoshoot.generateModel': 'Generate AI Model',
    'photoshoot.libraryTitle': 'Model Library',
    'photoshoot.libraryEmpty': 'Your recently used or generated models will appear here for quick access.',
    'photoshoot.step2Title': 'Step 2: Compose Your Scene',
    'photoshoot.step2Desc': 'Optionally, add extra elements to your scene for more creative control.',
    'photoshoot.outfit': 'Outfit',
    'photoshoot.object': 'Object',
    'photoshoot.background': 'Background',
    'photoshoot.conceptAssistant': 'AI Concept Assistant',
    'photoshoot.generatingConcepts': 'Generating Concepts...',
    'photoshoot.suggestConcepts': 'Suggest Concepts from Images',
    'photoshoot.conceptAppliedMessage': 'Concept Applied!',
    'photoshoot.step3Title': 'Step 3: Direct the Shoot',
    'photoshoot.step3Desc': 'Fine-tune the camera and color settings.',
    'photoshoot.cameraAngle': 'Camera Angle',
    'photoshoot.colorGrade': 'Color Grade',
    'photoshoot.step4Title': 'Step 4: Set Output',
    'photoshoot.step4Desc': 'Choose your desired image format.',
    'photoshoot.aspectRatio': 'Aspect Ratio',
    'photoshoot.step5Title': 'Step 5: Select Poses',
    'photoshoot.step5Desc': 'Choose one or more poses to generate.',
    'photoshoot.selectAll': 'Select All',
    'photoshoot.clearSelection': 'Clear Selection',
    'common.startOver': 'Start Over',
    'photoshoot.generatingButton': 'Generating...',
    'photoshoot.generateButton': 'Generate',
    'common.refineLabel': 'Refine & Regenerate',
    'common.refinePlaceholder': 'Optional: Add minor adjustments (e.g., "make the smile bigger", "change hair to red")...',
    'photoshoot.refineDesc': 'Add small tweaks to your prompt. Drastic changes may not work as expected. To regenerate a specific image, click its retry button.',
    'photoshoot.creatingZipButton': 'Creating ZIP...',
    'photoshoot.downloadAllButton': 'Download All (.zip)',
    'photoshoot.angles.eyeLevel': 'Eye-Level',
    'photoshoot.angles.lowAngle': 'Low Angle',
    'photoshoot.angles.highAngle': 'High Angle',
    'photoshoot.angles.dutchAngle': 'Dutch Angle',
    'photoshoot.angles.wormsEyeView': "Worm's Eye View",
    'photoshoot.angles.birdsEyeView': "Bird's Eye View",
    'photoshoot.grades.none': 'None',
    'photoshoot.grades.cinematic': 'Cinematic',
    'photoshoot.grades.vintage': 'Vintage',
    'photoshoot.grades.highContrast': 'B&W',
    'photoshoot.grades.vibrant': 'Vibrant',
    'photoshoot.grades.muted': 'Muted',
    'photoshoot.grades.warm': 'Warm',
    'photoshoot.grades.cool': 'Cool',

    'photoshoot.categories.Portraits & Close-ups': 'Portraits & Close-ups',
    'photoshoot.categories.Full & Medium Shots': 'Full & Medium Shots',
    'photoshoot.categories.Creative Angles & Perspectives': 'Creative Angles & Perspectives',
    'photoshoot.categories.Fashion & Editorial': 'Fashion & Editorial',
    'photoshoot.categories.Themed, Sitting & Lying Poses': 'Themed, Sitting & Lying Poses',
    'photoshoot.categories.Dynamic & Candid': 'Dynamic & Candid',

    'photoshoot.poses.smiling_portrait': 'Smiling Portrait',
    'photoshoot.poses.laughing_portrait': 'Laughing Portrait',
    'photoshoot.poses.serious_close_up': 'Serious Close-Up',
    'photoshoot.poses.thoughtful_look': 'Thoughtful Look',
    'photoshoot.poses.side_profile': 'Side Profile',
    'photoshoot.poses.head_tilt': 'Head Tilt',
    'photoshoot.poses.playful_wink': 'Playful Wink',
    'photoshoot.poses.soft_smile': 'Soft Smile',
    'photoshoot.poses.confident_full_body': 'Confident Full Body',
    'photoshoot.poses.walking_pose': 'Walking Pose',
    'photoshoot.poses.hands_in_pockets': 'Hands in Pockets',
    'photoshoot.poses.arms_crossed': 'Arms Crossed',
    'photoshoot.poses.hand_on_hip': 'Hand on Hip',
    'photoshoot.poses.leaning_pose': 'Leaning Pose',
    'photoshoot.poses.jumping_in_the_air': 'Jumping in the Air',
    'photoshoot.poses.twirling_shot': 'Twirling Shot',
    'photoshoot.poses.low_angle_shot': 'Low Angle Shot',
    'photoshoot.poses.high_angle_shot': 'High Angle Shot',
    'photoshoot.poses.from_below_face': 'From Below Face',
    'photoshoot.poses.over_the_shoulder_glance': 'Over the Shoulder Glance',
    'photoshoot.poses.looking_over_shoulder': 'Looking Over Shoulder',
    'photoshoot.poses.editorial_lean': 'Editorial Lean',
    'photoshoot.poses.power_stance': 'Power Stance',
    'photoshoot.poses.hand_on_collar': 'Hand on Collar',
    'photoshoot.poses.silhouette_pose': 'Silhouette Pose',
    'photoshoot.poses.motion_blur': 'Motion Blur',
    'photoshoot.poses.architectural_pose': 'Architectural Pose',
    'photoshoot.poses.lounging_elegantly': 'Lounging Elegantly',
    'photoshoot.poses.dramatic_gaze': 'Dramatic Gaze',
    'photoshoot.poses.sitting_pose': 'Sitting Pose',
    'photoshoot.poses.crouching_pose': 'Crouching Pose',
    'photoshoot.poses.lying_on_grass': 'Lying on Grass',
    'photoshoot.poses.hand_on_chin': 'Hand on Chin',
    'photoshoot.poses.holding_balloons': 'Holding Balloons',
    'photoshoot.poses.holding_flowers': 'Holding Flowers',
    'photoshoot.poses.candid_moment': 'Candid Moment',
    'photoshoot.poses.hair_in_motion': 'Hair in Motion',
    'photoshoot.poses.adjusting_jacket': 'Adjusting Jacket',
    'photoshoot.poses.hand_towards_camera': 'Hand Towards Camera',
    'photoshoot.poses.dancing_pose': 'Dancing Pose',
    'photoshoot.poses.shielding_eyes_from_sun': 'Shielding Eyes from Sun',
  },
};

type Language = 'en';
type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const language: Language = 'en';
  const t = (key: keyof Translations): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};