/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @format int64 */
export enum TimeDuration {
  MinDuration = -9223372036854776000,
  MaxDuration = 9223372036854776000,
  Nanosecond = 1,
  Microsecond = 1000,
  Millisecond = 1000000,
  Second = 1000000000,
  Minute = 60000000000,
  Hour = 3600000000000,
  MinDuration1 = -9223372036854776000,
  MaxDuration2 = 9223372036854776000,
  Nanosecond3 = 1,
  Microsecond4 = 1000,
  Millisecond5 = 1000000,
  Second6 = 1000000000,
  Minute7 = 60000000000,
  Hour8 = 3600000000000,
  Nanosecond9 = 1,
  Microsecond10 = 1000,
  Millisecond11 = 1000000,
  Second12 = 1000000000,
  Minute13 = 60000000000,
  Hour14 = 3600000000000,
}

export interface LabInternalAppDTOAddSolarPanel {
  depth: number;
  description?: string;
  efficiency: string;
  height: number;
  power: number;
  title: string;
  type: string;
  width: number;
}

export interface LabInternalAppDTOChangeSolarPanel {
  depth?: number;
  description?: string;
  efficiency?: string;
  height?: number;
  power?: number;
  title?: string;
  type?: string;
  width?: number;
}

export interface LabInternalAppDTOChangeSolarPanelAreaRequest {
  area: number;
}

export interface LabInternalAppDTOChangeSolarPanelRequest {
  insolation: number;
}

export interface LabInternalAppDTOChangeUserData {
  login?: string;
}

export interface LabInternalAppDTOLoginReq {
  login?: string;
  password?: string;
}

export interface LabInternalAppDTOLoginRes {
  access_token?: string;
  expires_in?: TimeDuration;
  is_moderator?: boolean;
  token_type?: string;
}

export interface LabInternalAppDTOModeratorAction {
  action: string;
}

export interface LabInternalAppDTONumberOfPanelsResponse {
  panels_in_request?: number;
  request_id?: number;
}

export interface LabInternalAppDTOOneSolarPanelRequestResponse {
  id?: number;
  insolation?: number;
  solarpanels?: LabInternalAppDTOSolarPanelFromRequestResponse[];
  total_power?: number;
  status?: string;
}

export interface LabInternalAppDTOSolarPanelFromRequestResponse {
  area?: number;
  id?: number;
  image?: string;
  is_deleted?: boolean;
  power?: number;
  title?: string;
  type?: string;
}

export interface LabInternalAppDTOSolarPanelsRequestsResponse {
  created_at?: string;
  creator?: string;
  formated_at?: string;
  id?: number;
  insolation?: number;
  moderated_at?: string;
  moderator?: string;
  status?: string;
  total_power?: number;
}

export interface LabInternalAppDTOUserDataResposne {
  id?: number;
  login?: string;
}

export interface LabInternalAppDTOUserRegistration {
  login: string;
  password: string;
}

export interface LabInternalAppDsRequestPanels {
  area?: number;
  solarPanel?: LabInternalAppDsSolarPanel;
  solar_panel_id?: number;
  solar_panel_request_id?: number;
}

export interface LabInternalAppDsSolarPanel {
  depth?: number;
  description?: string;
  efficiency?: string;
  height?: number;
  id?: number;
  image?: string;
  isDelete?: boolean;
  power?: number;
  title?: string;
  type?: string;
  width?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//localhost:8001/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Solar Panels Power Calculator API
 * @version 1.0
 * @license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService http://swagger.io/terms/
 * @baseUrl //localhost:8001/api
 * @contact API Support <support@swagger.io> (http://www.swagger.io/support)
 *
 * API для управления солнечными панелями и расчета их мощности
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  login = {
    /**
     * @description Выполняет вход в систему и возвращает JWT токен
     *
     * @tags Users
     * @name LoginCreate
     * @summary Авторизация пользователя
     * @request POST:/login
     */
    loginCreate: (
      credentials: LabInternalAppDTOLoginReq,
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDTOLoginRes, Record<string, string>>({
        path: `/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description Добавляет JWT токен в черный список
     *
     * @tags Users
     * @name LogoutCreate
     * @summary Выход из системы
     * @request POST:/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  panels = {
    /**
     * @description Возвращает список всех солнечных панелей с возможностью фильтрации по мощности
     *
     * @tags SolarPanels
     * @name PanelsList
     * @summary Получить список солнечных панелей
     * @request GET:/panels
     */
    panelsList: (
      query?: {
        /** Минимальная мощность для фильтрации */
        start_value?: number;
        /** Максимальная мощность для фильтрации */
        end_value?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDsSolarPanel[], Record<string, string>>({
        path: `/panels`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую солнечную панель. Требуется роль модератора.
     *
     * @tags SolarPanels
     * @name PanelsCreate
     * @summary Добавить новую солнечную панель (Модератор)
     * @request POST:/panels
     * @secure
     */
    panelsAdd: (
      solarPanel: LabInternalAppDTOAddSolarPanel,
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDsSolarPanel, Record<string, string>>({
        path: `/panels`,
        method: "POST",
        body: solarPanel,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о конкретной солнечной панели
     *
     * @tags SolarPanels
     * @name PanelsDetail
     * @summary Получить солнечную панель по ID
     * @request GET:/panels/{id}
     */
    panelsDetail: (id: number, params: RequestParams = {}) =>
      this.request<LabInternalAppDsSolarPanel, Record<string, string>>({
        path: `/panels/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные существующей солнечной панели. Требуется роль модератора.
     *
     * @tags SolarPanels
     * @name PanelsUpdate
     * @summary Изменить солнечную панель (Модератор)
     * @request PUT:/panels/{id}
     * @secure
     */
    panelsUpdate: (
      id: number,
      solarPanel: LabInternalAppDTOChangeSolarPanel,
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDsSolarPanel, Record<string, string>>({
        path: `/panels/${id}`,
        method: "PUT",
        body: solarPanel,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет солнечную панель в текущую заявку пользователя (корзину)
     *
     * @tags SolarPanels
     * @name PanelsCreate2
     * @summary Добавить панель в корзину
     * @request POST:/panels/{id}
     * @originalName panelsCreate
     * @duplicate
     * @secure
     */
    addPanelToRequest: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/panels/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Помечает солнечную панель как удаленную. Требуется роль модератора.
     *
     * @tags SolarPanels
     * @name PanelsDelete
     * @summary Удалить солнечную панель (Модератор)
     * @request DELETE:/panels/{id}
     * @secure
     */
    panelsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/panels/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для солнечной панели. Требуется роль модератора.
     *
     * @tags SolarPanels
     * @name ImageCreate
     * @summary Загрузить изображение панели (Модератор)
     * @request POST:/panels/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDsSolarPanel, Record<string, string>>({
        path: `/panels/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  solarpanelRequests = {
    /**
     * @description Возвращает список заявок пользователя с фильтрацией по дате и статусу
     *
     * @tags SolarPanelRequests
     * @name SolarpanelRequestsList
     * @summary Получить отфильтрованные заявки
     * @request GET:/solarpanel-requests
     * @secure
     */
    solarpanelRequestsList: (
      query?: {
        /** Начальная дата (формат: dd-mm-yyyy hh:mm:ss) */
        start_date?: string;
        /** Конечная дата (формат: dd-mm-yyyy hh:mm:ss) */
        end_date?: string;
        /** Статус заявки (сформирован, завершен, отклонен) */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        LabInternalAppDTOSolarPanelsRequestsResponse[],
        Record<string, string>
      >({
        path: `/solarpanel-requests`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID текущей корзины и количество панелей в ней
     *
     * @tags SolarPanelRequests
     * @name InfoList
     * @summary Получить информацию о корзине
     * @request GET:/solarpanel-requests/info
     * @secure
     */
    infoList: (params: RequestParams = {}) =>
      this.request<
        LabInternalAppDTONumberOfPanelsResponse,
        Record<string, string>
      >({
        path: `/solarpanel-requests/info`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о заявке со списком панелей
     *
     * @tags SolarPanelRequests
     * @name SolarpanelRequestsDetail
     * @summary Получить заявку по ID
     * @request GET:/solarpanel-requests/{id}
     * @secure
     */
    solarpanelRequestsDetail: (id: number, params: RequestParams = {}) =>
      this.request<
        LabInternalAppDTOOneSolarPanelRequestResponse,
        Record<string, string>
      >({
        path: `/solarpanel-requests/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет значение инсоляции для заявки со статусом черновик
     *
     * @tags SolarPanelRequests
     * @name SolarpanelRequestsUpdate
     * @summary Изменить инсоляцию в заявке
     * @request PUT:/solarpanel-requests/{id}
     * @secure
     */
    solarpanelRequestsUpdate: (
      id: number,
      insolation: LabInternalAppDTOChangeSolarPanelRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        LabInternalAppDTOOneSolarPanelRequestResponse,
        Record<string, string>
      >({
        path: `/solarpanel-requests/${id}`,
        method: "PUT",
        body: insolation,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Помечает заявку как удаленную (доступно только для черновиков)
     *
     * @tags SolarPanelRequests
     * @name SolarpanelRequestsDelete
     * @summary Удалить заявку
     * @request DELETE:/solarpanel-requests/{id}
     * @secure
     */
    solarpanelRequestsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/solarpanel-requests/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит заявку из статуса черновик в статус сформирован
     *
     * @tags SolarPanelRequests
     * @name FormateUpdate
     * @summary Сформировать заявку
     * @request PUT:/solarpanel-requests/{id}/formate
     * @secure
     */
    formateUpdate: (id: number, params: RequestParams = {}) =>
      this.request<
        LabInternalAppDTOOneSolarPanelRequestResponse,
        Record<string, string>
      >({
        path: `/solarpanel-requests/${id}/formate`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Модератор завершает или отклоняет заявку. Требуется роль модератора.
     *
     * @tags SolarPanelRequests
     * @name ModerateUpdate
     * @summary Действие модератора (Модератор)
     * @request PUT:/solarpanel-requests/{id}/moderate
     * @secure
     */
    moderateUpdate: (
      id: number,
      action: LabInternalAppDTOModeratorAction,
      params: RequestParams = {},
    ) =>
      this.request<
        LabInternalAppDTOOneSolarPanelRequestResponse,
        Record<string, string>
      >({
        path: `/solarpanel-requests/${id}/moderate`,
        method: "PUT",
        body: action,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет значение площади для панели в заявке
     *
     * @tags RequestPanels
     * @name SolarpanelRequestsUpdate2
     * @summary Изменить площадь панели в заявке
     * @request PUT:/solarpanel-requests/{id}/{solarpanelId}
     * @originalName solarpanelRequestsUpdate
     * @duplicate
     * @secure
     */
    changeSolarpanelArea: (
      id: number,
      solarpanelId: number,
      area: LabInternalAppDTOChangeSolarPanelAreaRequest,
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDsRequestPanels, Record<string, string>>({
        path: `/solarpanel-requests/${id}/${solarpanelId}`,
        method: "PUT",
        body: area,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет солнечную панель из заявки пользователя
     *
     * @tags RequestPanels
     * @name SolarpanelRequestsDelete2
     * @summary Удалить панель из заявки
     * @request DELETE:/solarpanel-requests/{id}/{solarpanelId}
     * @originalName solarpanelRequestsDelete
     * @duplicate
     * @secure
     */
    deleteSolarPanelFromRequest: (
      id: number,
      solarpanelId: number,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/solarpanel-requests/${id}/${solarpanelId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * @description Обновляет данные текущего авторизованного пользователя
     *
     * @tags Users
     * @name UserUpdate
     * @summary Изменить данные пользователя
     * @request PUT:/user
     * @secure
     */
    userUpdate: (
      user: LabInternalAppDTOChangeUserData,
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDTOUserDataResposne, Record<string, string>>({
        path: `/user`,
        method: "PUT",
        body: user,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает нового пользователя в системе
     *
     * @tags Users
     * @name RegistrationCreate
     * @summary Регистрация пользователя
     * @request POST:/user/registration
     */
    registrationCreate: (
      user: LabInternalAppDTOUserRegistration,
      params: RequestParams = {},
    ) =>
      this.request<LabInternalAppDTOUserDataResposne, Record<string, string>>({
        path: `/user/registration`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о пользователе по ID
     *
     * @tags Users
     * @name UserDetail
     * @summary Получить данные пользователя
     * @request GET:/user/{id}
     * @secure
     */
    userDetail: (id: number, params: RequestParams = {}) =>
      this.request<LabInternalAppDTOUserDataResposne, Record<string, string>>({
        path: `/user/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
