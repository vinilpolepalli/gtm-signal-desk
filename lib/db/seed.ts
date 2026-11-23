import type { Db } from './index';

/**
 * The shared sample pipeline (accounts + signals) ships as static JSON in data/signals.json.
 * Per-owner action decisions start empty. Nothing to seed.
 */
export async function seedIfEmpty(_db: Db): Promise<void> {}
