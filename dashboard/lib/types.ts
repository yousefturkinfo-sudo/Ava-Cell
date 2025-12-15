
export interface Country {
    id: string
    iso_code: string
    name: string
    lat: number
    lng: number
}

export interface CountryRWAStats {
    id: string
    country_id: string
    total_value_usd: number
    asset_count: number
    risk_score: number // 0-100
    updated_at: string
}

export interface Event {
    id: string
    type: 'mint' | 'burn' | 'transfer' | 'compliance' | 'alert'
    country_id?: string
    asset_id?: string
    message: string
    severity: 'low' | 'medium' | 'high'
    created_at: string
}

export interface Asset {
    id: string
    name: string
    country_id: string
    type: 'real_estate' | 'commodity' | 'bond' | 'equity'
    value_usd: number
    status: 'active' | 'pending' | 'frozen'
    risk_score: number
    updated_at: string
}

// For the Globe component
export interface GlobePoint {
    lat: number
    lng: number
    value: number // Normalized 0-1 for size
    risk: number // Normalized 0-1 for color
    countryName: string
    country_id: string
}
