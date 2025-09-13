// Core Pokemon API types
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string | null;
    back_default?: string | null;
    front_shiny?: string | null;
    back_shiny?: string | null;
  };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
}

// Team analysis types
export interface PokemonTeam {
  pokemon: Pokemon[];
  name?: string;
}

export interface TeamAnalysis {
  teamSize: number;
  typeCoverage: string[];
  averageStats: Record<string, number>;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

// Chat and messaging types
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  result?: string;
}

// Tool system types
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      default?: any;
      items?: {
        type: string;
      };
    }>;
    required: string[];
  };
  execute: (args: any) => Promise<string>;
}

// All types are defined in this file