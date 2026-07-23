export interface Share2SellsTheme {
  colors: {
    orange: string;
    orangeLight: string;
    orangeDark: string;
    blue: string;
    blueLight: string;
    blueDark: string;
    green: string;
    greenLight: string;
    red: string;
    redLight: string;
    yellow: string;
    yellowLight: string;
    purple: string;
    purpleLight: string;
    bgApp: string;
    bgLayout: string;
    bgContainer: string;
    bgSidebar: string;
    bgCard: string;
    bgSubtle: string;
    bgHover: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    border: string;
    borderLight: string;
    borderFocus: string;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface ThemeConfig {
  token?: Record<string, any>;
  components?: {
    [key: string]: any;
  };
  algorithm?: any | any[];
}