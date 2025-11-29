import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { createApparelSlice, ApparelSlice } from './apparelStore';
import { createProductSlice, ProductSlice } from './productStore';
import { createDesignSlice, DesignSlice } from './designStore';
import { createSharedSlice, SharedSlice } from './sharedStore';
import { createReimagineSlice, ReimagineSlice } from './reimagineStore';
import { createPhotoshootSlice, PhotoshootSlice } from './photoshootStore';
import { createChatSlice, ChatSlice } from './chatStore';

/**
 * The combined store type, merging all individual slices.
 * This provides a single, unified interface for the entire application state.
 */
export type StudioStore = ApparelSlice & ProductSlice & DesignSlice & ReimagineSlice & SharedSlice & PhotoshootSlice & ChatSlice;

/**
 * A helper type for creating slices that are aware of the full store.
 * This allows actions in one slice to access state from another slice via `get()`.
 */
export type StudioStoreSlice<T> = StateCreator<StudioStore, [], [], T>;


// Create the main Zustand store by composing the individual slices.
// Each slice is passed the `set` and `get` functions from the store creator,
// allowing them to interact with the entire state.
export const useStudio = create<StudioStore>()((...a) => ({
    ...createApparelSlice(...a),
    ...createProductSlice(...a),
    ...createDesignSlice(...a),
    ...createReimagineSlice(...a),
    ...createSharedSlice(...a),
    ...createPhotoshootSlice(...a),
    ...createChatSlice(...a),
}));