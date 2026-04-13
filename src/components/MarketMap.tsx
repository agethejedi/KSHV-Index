import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import usStates from 'us-atlas/states-10m.json';
import type { MetroDefinition } from '../types';

export function MarketMap({ metros, selectedMetroId, onSelectMetro }: { metros: MetroDefinition[]; selectedMetroId: string; onSelectMetro: (metroId: string) => void; }) {
  return (
    <div className="card map-card">
      <div className="card-header">
        <h3>KS Market Explorer</h3>
        <span>Click a metro to recalculate the curve and score</span>
      </div>
      <ComposableMap projection="geoAlbersUsa" className="us-map">
        <Geographies geography={usStates}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => (
              <Geography key={geo.rsmKey} geography={geo} className="state-geo" />
            ))
          }
        </Geographies>
        {metros.map((metro) => {
          const selected = metro.id === selectedMetroId;
          return (
            <Marker key={metro.id} coordinates={[metro.longitude, metro.latitude]}>
              <g onClick={() => onSelectMetro(metro.id)} className={`metro-marker ${selected ? 'selected' : ''}`}>
                <circle r={selected ? 8 : 6} />
                <text textAnchor="middle" y={selected ? -14 : -12}>{metro.label}</text>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
