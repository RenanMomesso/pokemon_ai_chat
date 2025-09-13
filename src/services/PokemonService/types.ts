export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  base_experience: number;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
}

export interface PokemonType {
  id: number;
  name: string;
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonAbility {
  id: number;
  name: string;
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
    };
  }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}