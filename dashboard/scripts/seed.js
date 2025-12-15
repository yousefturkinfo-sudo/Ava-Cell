const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const COUNTRIES = [
    { iso_code: 'US', name: 'United States', lat: 37.0902, lng: -95.7129 },
    { iso_code: 'GB', name: 'United Kingdom', lat: 55.3781, lng: -3.4360 },
    { iso_code: 'SG', name: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { iso_code: 'CH', name: 'Switzerland', lat: 46.8182, lng: 8.2275 },
    { iso_code: 'JP', name: 'Japan', lat: 36.2048, lng: 138.2529 },
    { iso_code: 'AE', name: 'United Arab Emirates', lat: 23.4241, lng: 53.8478 },
    { iso_code: 'AU', name: 'Australia', lat: -25.2744, lng: 133.7751 },
    { iso_code: 'BR', name: 'Brazil', lat: -14.2350, lng: -51.9253 },
]

async function seed() {
    console.log('🌱 Seeding Supabase...')

    // 1. Countries
    console.log('Inserting countries...')
    const { data: countries, error: countryError } = await supabase
        .from('countries')
        .upsert(COUNTRIES, { onConflict: 'iso_code' })
        .select()

    if (countryError) {
        console.error('Error inserting countries:', countryError)
        console.log('⚠️ Make sure tables exist! Run this SQL in Supabase SQL Editor:')
        console.log(`
      create table if not exists countries (
        id uuid default gen_random_uuid() primary key,
        iso_code text unique not null,
        name text not null,
        lat float not null,
        lng float not null
      );
      create table if not exists country_rwa_stats (
        id uuid default gen_random_uuid() primary key,
        country_id uuid references countries(id),
        total_value_usd numeric default 0,
        asset_count int default 0,
        risk_score int default 0,
        updated_at timestamptz default now()
      );
    `)
        return
    }

    // 2. Stats
    console.log('Inserting stats...')
    if (countries) {
        for (const c of countries) {
            const totalValue = Math.floor(Math.random() * 500_000_000) + 10_000_000
            const assetCount = Math.floor(Math.random() * 50) + 5
            const riskScore = Math.floor(Math.random() * 100)

            await supabase.from('country_rwa_stats').insert({
                country_id: c.id,
                total_value_usd: totalValue,
                asset_count: assetCount,
                risk_score: riskScore
            })
        }
    }

    console.log('✅ Seeding complete!')
}

seed()
