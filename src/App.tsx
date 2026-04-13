import { useMemo, useState } from 'react';
import './styles.css';
import { BellCurve } from './components/BellCurve';
import { DriversList } from './components/DriversList';
import { MarketMap } from './components/MarketMap';
import { MetricCards } from './components/MetricCards';
import { ProfileForm } from './components/ProfileForm';
import { ScorePanel } from './components/ScorePanel';
import { metros, metroById } from './data/metros';
import { loadMetroAcsStats } from './data/censusApi';
import { calculateKS } from './engine/scoreEngine';
import type { KSResult, UserProfile } from './types';
const initialProfile: UserProfile = { gender:'male', age:52, ethnicity:'black', metro:'dfw', income:120000, education:'bachelors', childrenCount:1, priorMarriages:1, heightFeet:5, heightInchesRemainder:10, weightLbs:190 };
export default function App(){ const [profile,setProfile]=useState<UserProfile>(initialProfile); const [result,setResult]=useState<KSResult|null>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null); const selectedMetroId=useMemo(()=>profile.metro,[profile.metro]); async function runCalculation(nextProfile:UserProfile){ const metro=metroById[nextProfile.metro]; if(!metro) return; setLoading(true); setError(null); try{ const acsStats=await loadMetroAcsStats(metro); setResult(calculateKS(nextProfile, acsStats)); } catch(err){ setError(err instanceof Error ? err.message : 'Failed to load ACS data.'); } finally { setLoading(false); } } return <div className="app-shell"><header className="hero"><div><p className="eyebrow">KS Engine</p><h1>Marriage and dating market analytics with a live ACS-backed metro model</h1><p className="hero-copy">This build pulls 2024 ACS 1-year metro data at runtime from the official Census API, then recomputes the bell curve, raw score, and market drivers every time the user changes metros.</p></div></header><ProfileForm value={profile} onChange={setProfile} onSubmit={()=>void runCalculation(profile)} isLoading={loading}/>{error && <div className="error-banner">{error}</div>}<section className="top-grid"><BellCurve result={result}/><ScorePanel result={result}/></section><MarketMap metros={metros} selectedMetroId={selectedMetroId} onSelectMetro={(metroId)=>{ const nextProfile={...profile, metro:metroId}; setProfile(nextProfile); void runCalculation(nextProfile); }}/><MetricCards result={result}/><DriversList result={result}/></div>; }
