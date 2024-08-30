declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    description?: string;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    description?: string;
    message?: string;
  };

  type BaseResponseListUser_ = {
    code?: number;
    data?: User[];
    description?: string;
    message?: string;
  };

  type BaseResponseListUserVO_ = {
    code?: number;
    data?: UserVO[];
    description?: string;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    description?: string;
    message?: string;
  };

  type BaseResponsePageBatteryDataInfo_ = {
    code?: number;
    data?: PageBatteryDataInfo_;
    description?: string;
    message?: string;
  };

  type BaseResponsePageBatteryInfo_ = {
    code?: number;
    data?: PageBatteryInfo_;
    description?: string;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    description?: string;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    description?: string;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    description?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    description?: string;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    description?: string;
    message?: string;
  };

  type BatteryAddRequest = {
    batteryName?: string;
    batteryType?: string;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type BatteryDataInfo = {
    adjacentTimeDifference?: number;
    batteryCode?: string;
    capacity?: number;
    collectTime?: string;
    createTime?: string;
    current?: number;
    cycle?: number;
    id?: number;
    isDelete?: number;
    maxTemperature?: number;
    mileage?: number;
    minTemperature?: number;
    soc?: number;
    startTimeDifference?: number;
    updateTime?: string;
    voltage?: number;
  };

  type BatteryDeleteRequest = {
    id?: number;
  };

  type BatteryDownloadRequest = {
    batteryCode?: string;
    cycleRange?: string;
    filePath?: string;
    socRange?: string;
    timeRange?: string;
  };

  type BatteryInfo = {
    batteryCode?: string;
    batteryName?: string;
    batteryType?: string;
    createTime?: string;
    dataNum?: number;
    id?: number;
    isDelete?: number;
    updateTime?: string;
  };

  type BatteryQueryRequest = {
    batteryCode?: string;
    batteryName?: string;
    batteryType?: string;
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type BatteryUpdateRequest = {
    batteryCode?: string;
    batteryName?: string;
    batteryType?: string;
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type File = {
    absolute?: boolean;
    absoluteFile?: File;
    absolutePath?: string;
    canonicalFile?: File;
    canonicalPath?: string;
    directory?: boolean;
    file?: boolean;
    freeSpace?: number;
    hidden?: boolean;
    name?: string;
    parent?: string;
    parentFile?: File;
    path?: string;
    totalSpace?: number;
    usableSpace?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type IdRequest = {
    id?: number;
  };

  type InputStream = true;

  type listUserUsingGETParams = {
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageBatteryDataInfo_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: BatteryDataInfo[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageBatteryInfo_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: BatteryInfo[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Resource = {
    description?: string;
    file?: File;
    filename?: string;
    inputStream?: InputStream;
    open?: boolean;
    readable?: boolean;
    uri?: URI;
    url?: URL;
  };

  type searchUsersUsingGETParams = {
    /** userName */
    userName?: string;
  };

  type uploadCsvUsingPOSTParams = {
    /** batteryCode */
    batteryCode: string;
  };

  type URI = {
    absolute?: boolean;
    authority?: string;
    fragment?: string;
    host?: string;
    opaque?: boolean;
    path?: string;
    port?: number;
    query?: string;
    rawAuthority?: string;
    rawFragment?: string;
    rawPath?: string;
    rawQuery?: string;
    rawSchemeSpecificPart?: string;
    rawUserInfo?: string;
    scheme?: string;
    schemeSpecificPart?: string;
    userInfo?: string;
  };

  type URL = {
    authority?: string;
    content?: Record<string, any>;
    defaultPort?: number;
    file?: string;
    host?: string;
    path?: string;
    port?: number;
    protocol?: string;
    query?: string;
    ref?: string;
    userInfo?: string;
  };

  type User = {
    avatarUrl?: string;
    createTime?: string;
    email?: string;
    gender?: number;
    id?: number;
    isDelete?: number;
    phone?: string;
    updateTime?: string;
    userAccount?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userEmail?: string;
    userName?: string;
    userRole?: string;
  };
}
