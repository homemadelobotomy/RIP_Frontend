// src/api/api.ts
import axios from "axios";
import {type SolarPanel, MOCK_PANELS } from "./slices/dataSlice";
import { dest_api } from "./target_config";





export interface SolarPanelsRequestInfo {
  request_id: number;
  panels_in_request: number;
}

export async function getSolarPanels(
  start_value?: string | null,
  end_value?: string | null
): Promise<SolarPanel[]> {
  try {
    const params = new URLSearchParams();
    if (start_value) params.set("start_value", start_value);
    if (end_value) params.set("end_value", end_value);

    const response = await axios.get(`${dest_api}/panels?${params.toString()}`);
    return response.data;
  } catch (error) {
    
    let filtered = MOCK_PANELS;
    if (start_value || end_value) {
      const min = start_value ? parseInt(start_value) : 0;
      const max = end_value ? parseInt(end_value) : Infinity;
      filtered = MOCK_PANELS.filter((p) => p.Power >= min && p.Power <= max);
    }
    return filtered;
  }
}


export async function getSolarPanelsRequestInfo(): Promise<SolarPanelsRequestInfo> {
  try {
    const response = await axios.get(`${dest_api}/solarpanel-requests/info`);
    return response.data;
  } catch (error) {

    return {
      request_id: 0,
      panels_in_request: 0,
    };
  }
}

export async function getPanelByID(id: string | number): Promise<SolarPanel> {
  try {
    const response = await axios.get(`${dest_api}/panels/${id}`);
    return response.data;
  } catch (error) {
    const panel = MOCK_PANELS.find((p) => p.ID === parseInt(String(id)));
    if (!panel) throw new Error("Панель не найдена");
    return panel;
  }
}
