export interface Workspaces {
  id: string;
  username: string;
  name: string;
  allowedTaxIds: string[];
  status: string;
  organizationId: string;
  pictureUrl: string;
  created: string;
  host: string;
  role: string;
  theme: Theme;
}

interface Theme {
  actionColor: string;
  borderColor: string;
  inputColor: string;
  lineColor: string;
  menuBgColor: string;
  textColor: string;
  titleColor: string;
  viewBgColor: string;
}
export interface WorkspacesWithTransaction {
  total_de_paginas: number;
  resultados: Workspaces[];
}
