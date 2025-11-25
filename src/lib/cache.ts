import { kv } from "@vercel/kv";

/**
 * Vercel KV caching utilities for GitHub API responses
 * Gracefully degrades when KV is unavailable
 */

// Cache TTLs (in seconds)
const TTL_FILE = 3600; // 1 hour
const TTL_REPO = 900; // 15 minutes
const TTL_PROFILE = 1800; // 30 minutes

// Helper to handle KV errors gracefully
async function safeKvOperation<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
        return await operation();
    } catch (error) {
        console.warn("KV operation failed (gracefully degrading):", error);
        return null;
    }
}

/**
 * Cache file content with SHA-based key for auto-invalidation
 */
export async function cacheFile(
    owner: string,
    repo: string,
    path: string,
    sha: string,
    content: string
): Promise<void> {
    const key = `file:${owner}/${repo}:${path}:${sha}`;
    await safeKvOperation(() => kv.setex(key, TTL_FILE, content));
}

/**
 * Get cached file content by SHA
 * Returns null if not found or KV unavailable
 */
export async function getCachedFile(
    owner: string,
    repo: string,
    path: string,
    sha: string
): Promise<string | null> {
    const key = `file:${owner}/${repo}:${path}:${sha}`;
    return await safeKvOperation(() => kv.get<string>(key));
}

/**
 * Cache repository metadata
 */
export async function cacheRepoMetadata(
    owner: string,
    repo: string,
    data: any,
    ttl: number = TTL_REPO
): Promise<void> {
    const key = `repo:${owner}/${repo}`;
    await safeKvOperation(() => kv.setex(key, ttl, data));
}

/**
 * Get cached repository metadata
 */
export async function getCachedRepoMetadata(
    owner: string,
    repo: string
): Promise<any | null> {
    const key = `repo:${owner}/${repo}`;
    return await safeKvOperation(() => kv.get<any>(key));
}

/**
 * Cache profile data
 */
export async function cacheProfileData(
    username: string,
    data: any,
    ttl: number = TTL_PROFILE
): Promise<void> {
    const key = `profile:${username}`;
    await safeKvOperation(() => kv.setex(key, ttl, data));
}

/**
 * Get cached profile data
 */
export async function getCachedProfileData(username: string): Promise<any | null> {
    const key = `profile:${username}`;
    return await safeKvOperation(() => kv.get<any>(key));
}

/**
 * Clear all cache for a repository (useful for manual invalidation)
 */
export async function clearRepoCache(owner: string, repo: string): Promise<void> {
    const pattern = `*:${owner}/${repo}:*`;
    // Note: Pattern-based deletion requires Redis SCAN, not all KV providers support it
    // This is a future enhancement placeholder
    console.log(`Cache clear requested for ${pattern} (not fully implemented)`);
}

/**
 * Get cache statistics (for DevTools)
 */
export async function getCacheStats(): Promise<{
    available: boolean;
    keys?: number;
}> {
    try {
        // Simple health check
        await kv.ping();
        return { available: true };
    } catch (error) {
        return { available: false };
    }
}
