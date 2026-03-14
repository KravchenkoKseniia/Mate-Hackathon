export interface ScenePreset {
  id: string;
  name: string;
  prompt: string;
}

export interface GeneratedScene {
  scene_name: string;
  images: string[];
}

export type AppStep = 0 | 1 | 2 | 3 | 4;
