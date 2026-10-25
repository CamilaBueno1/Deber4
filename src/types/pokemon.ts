export interface ItemPokemon { name: string; url: string }

export interface RespuestaPokemon {
  count: number; 
  next: string | null; 
  previous: string | null; 
  results: ItemPokemon[];
}

export interface Pokemon {
  id: number; 
  name: string; 
  height: number; 
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}