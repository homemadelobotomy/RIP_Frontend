export interface SolarPanelsRequestInfo {
  request_id: number;
  panels_in_request: number;
}

export interface SolarPanel {
    ID:number;
    Title:string;
    Type:string;
    Description:string;
    Power:number;
    Height:number;
    Width:number;
    Depth:number;
    Efficiency:string;
    Image:string;
    IsDelete:boolean;
}

const SOLARPANELS = [
        {
        "ID": 1,
        "Title": "Монокристаллическая панель",
        "Type": "Монокристаллическая",
        "Description": "Высокоэффективная панель из монокристаллов, подходящая для ограниченных пространств.",
        "Power": 50,
        "Height": 1640,
        "Width": 992,
        "Depth": 35,
        "Efficiency": "20-22",
        "Image": "",
        "IsDelete": false
    },
    {
        "ID": 2,
        "Title": "Поликристаллическая панель",
        "Type": "Поликристаллическая",
        "Description": "Надежная панель с хорошим соотношением цена/качество, широко используется.",
        "Power": 280,
        "Height": 1650,
        "Width": 998,
        "Depth": 35,
        "Efficiency": "18-20",
        "Image": "",
        "IsDelete": false
    },
    {
        "ID": 3,
        "Title": "Тонкопленочная панель",
        "Type": "Тонкопленочная",
        "Description": "Гибкая и легкая панель, эффективна при рассеянном солнечном свете.",
        "Power": 40,
        "Height": 1200,
        "Width": 600,
        "Depth": 6,
        "Efficiency": "12-15",
        "Image": "",
        "IsDelete": false
    },
    {
        "ID": 4,
        "Title": "Солнечная панель премиум",
        "Type": "Монокристаллическая",
        "Description": "Панель премиум-класса с повышенной эффективностью и долговечностью.",
        "Power": 60,
        "Height": 1740,
        "Width": 1000,
        "Depth": 40,
        "Efficiency": "21-23",
        "Image": "",
        "IsDelete": false
    },
    {
        "ID": 5,
        "Title": "Гибридная панель",
        "Type": "Гибридная",
        "Description": "Современная гибридная панель с высокой эффективностью.",
        "Power": 90,
        "Height": 1800,
        "Width": 1100,
        "Depth": 45,
        "Efficiency": "23-25",
        "Image": "",
        "IsDelete": false
    }
]

const API_URL = "/api";

async function FetchData<T>(url:string, mockData:T, options: RequestInit = {}):Promise<T> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type':'application/json',
                ...options.headers,
            },
        });
        if (!response.ok){
            throw new Error ('HTTP server error')
        }
        return await response.json();
    }catch (error) {
        return mockData;
    }
}

export async function getSolarPanels(begin?: string | null, end?: string | null): Promise<SolarPanel[]> {
  const params = new URLSearchParams();
  if (begin) params.set("start_value", begin);
  if (end) params.set("end_value", end);
  
  const url = `${API_URL}/panels?${params.toString()}`;
  
  let filteredMock = SOLARPANELS;
  if (begin || end) {
    const min = begin ? parseInt(begin) : 0;
    const max = end ? parseInt(end) : Infinity;
    filteredMock = SOLARPANELS.filter(p => p.Power >= min && p.Power <= max && !p.IsDelete);
  }
  
  return FetchData(url, filteredMock);
}


const DEFAULT_INFO: SolarPanelsRequestInfo = {
  request_id: 0,
  panels_in_request: -1
};
export async function getSolarPanelsRequestInfo():Promise<SolarPanelsRequestInfo> {
  const url = `${API_URL}/solarpanel-requests/info`;
  const result = await FetchData<SolarPanelsRequestInfo>(url, DEFAULT_INFO);
  return result;
}

export async function getPanelByID(ID:string|number):Promise<SolarPanel> {
  const url = `${API_URL}/panels/${ID}`;
  const mockPanel = SOLARPANELS.find(p => p.ID === parseInt(String(ID))) || SOLARPANELS[0];
  return FetchData<SolarPanel>(url, mockPanel);
}