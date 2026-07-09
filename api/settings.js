import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://alvwqkqsokaiarrmweht.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdndxa3Fzb2thaWFycm13ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTcyNjQsImV4cCI6MjA5ODk3MzI2NH0.fR2O_DvLGcDxUC3Ld4DrRafKJH4kEJhCUScswKaUKfA';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'Key is required' });

    const slug = '_site_settings_' + key;
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    
    if (error) {
        return res.status(404).json({ error: 'Settings not found', details: error.message });
    }
    
    try {
        const settingsObj = JSON.parse(data.features || '{}');
        return res.status(200).json(settingsObj);
    } catch(err) {
        return res.status(500).json({ error: 'Failed to parse settings JSON' });
    }
  }

  if (req.method === 'POST') {
    const { key, value } = req.body;
    if (!key || !value) return res.status(400).json({ error: 'Key and value are required' });

    const slug = '_site_settings_' + key;
    const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);

    // Check if settings already exist
    const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).single();

    if (existing) {
        // Update
        const { data, error } = await supabase.from('products').update({ features: stringifiedValue }).eq('id', existing.id).select();
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ success: true, message: 'Settings updated' });
    } else {
        // Insert new dummy product to hold settings
        const { data, error } = await supabase.from('products').insert([{
            slug,
            name: 'Site Settings: ' + key,
            price: 0,
            stock: 0,
            categories: 'Settings',
            features: stringifiedValue
        }]).select();
        
        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json({ success: true, message: 'Settings created' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
