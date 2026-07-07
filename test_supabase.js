const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://alvwqkqsokaiarrmweht.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdndxa3Fzb2thaWFycm13ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTcyNjQsImV4cCI6MjA5ODk3MzI2NH0.fR2O_DvLGcDxUC3Ld4DrRafKJH4kEJhCUScswKaUKfA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error connecting to Supabase or table does not exist:', error.message);
    } else {
        console.log('Successfully connected to Supabase! Products found:', data.length);
    }
}

checkDatabase();
