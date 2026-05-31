const { createClient } = require('@supabase/supabase-js');
const { config } = require('../config/env');
const path = require('path');
const { v4: uuidv4 } = require('crypto');

let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) {
      throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.');
    }
    supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);
  }
  return supabase;
};

const generateFileName = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}${ext}`;
};

/**
 * Upload a file buffer to Supabase Storage.
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name (for extension)
 * @param {string} mimeType - MIME type
 * @param {string} folder - Folder within bucket
 * @returns {Promise<{url: string, path: string}>}
 */
const uploadToSupabase = async (buffer, originalName, mimeType, folder = 'products') => {
  const client = getSupabaseClient();
  const fileName = generateFileName(originalName);
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await client.storage
    .from(config.SUPABASE_BUCKET)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: urlData } = client.storage
    .from(config.SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
  };
};

/**
 * Delete a file from Supabase Storage by its public URL.
 * @param {string} fileUrl - Full public URL of the file
 */
const deleteFromSupabase = async (fileUrl) => {
  if (!fileUrl) return;

  const client = getSupabaseClient();

  // Extract path from URL: everything after /storage/v1/object/public/<bucket>/
  const bucketPrefix = `/storage/v1/object/public/${config.SUPABASE_BUCKET}/`;
  const idx = fileUrl.indexOf(bucketPrefix);
  if (idx === -1) {
    console.warn('Could not extract Supabase path from URL:', fileUrl);
    return;
  }

  const filePath = fileUrl.substring(idx + bucketPrefix.length);

  const { error } = await client.storage
    .from(config.SUPABASE_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error.message);
  }
};

module.exports = { uploadToSupabase, deleteFromSupabase };
