interface IDeviceParams {
    rssi: number;
    ssid: string;
    bssid: string;
    mac: string;
    bindInfos: any;
    version: number;
    staMac: string;
    fwVersion: string;
    latestVersion: string;
    switch: string | {
        switch: {
            value: string;
        };
    } | boolean;
    state: string;
    switches: Array<{
        switch: string;
        outlet: number;
    }>;
    sledOnline: string;
    sledBright: number;
    startup: string;
    pulse: string;
    pulseWidth: number;
    pulses: Array<{
        pulse: string;
        width: number;
        outlet: number;
        switch?: string;
    }>;
    configure: Array<{
        startup: string;
        outlet: number;
        width?: number;
        enableDelay?: number;
    }>;
    pulseConfig: {
        pulse: string;
        pulseWidth: number;
        switch: string;
    };
    lock: number;
    setclose: number;
    deviceType: string;
    sensorType: string;
    currentHumidity: string;
    currentTemperature: string;
    mainSwitch: string;
    power: string | number;
    voltage: string | number;
    current: string | number;
    ltype: TLightSceneLType;
    white: IWifiLightBrCt;
    color: IWifiLightRGBScene | {
        temperature?: number;
        spectrumRGB?: number;
    };
    bright: IWifiLightBrCt | number;
    read: IWifiLightBrCt;
    computer: IWifiLightBrCt;
    nightLight: IWifiLightBrCt;
    goodNight: IWifiLightRGBScene;
    party: IWifiLightRGBScene;
    leisure: IWifiLightRGBScene;
    soft: IWifiLightRGBScene;
    colorful: IWifiLightRGBScene;
    colorMode: 'cct' | 'rgb' | number;
    brightness: number;
    cctBrightness: number;
    colorTemp: number;
    hue: number;
    saturation: number;
    rgbBrightness: number;
    capability: string;
    execParams: any;
    uiActive: number | {
        outlet: number;
        time: number;
    } | {
        all: number;
        time: number;
    };
    hundredDaysKwh: string;
    getKwh_00: number;
    getKwh_01: number;
    oneKwh: string;
    startTime: string;
    endTime: string;
    remoteCtrlList: Array<any>;
    lightScenes: Array<any>;
    subDevId: string;
    parentid: string;
    subDevices: {
        deviceid: string;
    }[];
    init: number;
    targets: any;
    timeZone: number;
    backlight: string;
    humidity: string;
    temperature: string | number;
    autoControl: any[];
    autoControlEnabled: number;
    tempUnit: number;
    battery: number;
    key: number;
    trigTime: string;
    channel0: string;
    channel1: string;
    channel2: string;
    channel3: string;
    channel4: string;
    zyx_mode: number;
    type: string | number;
    slowlyLit: number;
    slowlyDimmed: number;
    chipID: string;
    lastUpdateTime: string;
    actionTime: string;
    chipid: string;
    defense: number;
    colorR: number;
    colorG: number;
    colorB: number;
    light_type: number;
    mode: number | string;
    speed: number;
    senMode: Record<string, any>;
    savMode: Record<string, any>;
    alertMode: Record<string, any>;
    alert: number;
    offBrightness: number;
    motion: number;
    water: number;
    direction: number;
    record: number;
    microphone: number;
    sharpness: number;
    playType: number;
    motion_detect: number;
    supportPowConfig: number;
    ASYNC: number;
    demNextFetchTime: number;
    only_device: Record<string, any>;
    brightMin: number;
    brightMax: number;
    tempComfortLower: string;
    tempComfortUpper: string;
    humiComfortLower: string;
    humiComfortUpper: string;
    on: boolean;
    quickSwitch: number;
    dimming: number;
    normal: Record<string, any>;
    workMode: number | string;
    swMode_00: number;
    swMode_01: number;
    swReverse_00: number;
    swReverse_01: number;
    motorSwMode: number;
    motorSwReverse: number;
    outputReverse: number;
    motorTurn: number;
    calibState: number | boolean;
    currLocation: number;
    location: number;
    overload_00: Record<string, any>;
    overload_01: Record<string, any>;
    oneKwhState_00: number;
    startTime_00: string;
    endTime_00: string;
    oneKwhState_01: number;
    startTime_01: string;
    endTime_01: string;
    oneKwhData_00: number;
    oneKwhData_01: number;
    current_00: number;
    voltage_00: number;
    actPow_00: number;
    reactPow_00: number;
    apparentPow_00: number;
    current_01: number;
    voltage_01: number;
    actPow_01: number;
    reactPow_01: number;
    apparentPow_01: number;
    current_02: number;
    voltage_02: number;
    actPow_02: number;
    reactPow_02: number;
    apparentPow_02: number;
    current_03: number;
    voltage_03: number;
    actPow_03: number;
    reactPow_03: number;
    apparentPow_03: number;
    zyx_clear_timers: boolean;
    initSetting: number;
    calibration: number;
    op: number;
    per: number;
    set: number;
    statu: number;
    small_temperature: number;
    wind_speed: number;
    wind_swing_ud: string;
    wind_swing_lr: string;
    power_off_timer: string;
    power_off_time_value: number;
    power_on_timer: string;
    power_on_time_value: number;
    indoor_temperature: number;
    outdoor_temperature: number;
    buzzerAlarm: Record<string, any>;
    securityType: number;
    stopMode: number;
    impedeCurrent: number;
    motionCurrent: number;
    cmd: string;
    rfChl: number;
    targetTemp: number;
    volatility: number;
    childLock: string | boolean;
    tempScale: string;
    fault: number;
    workState: number | string;
    sysVersion: string;
    zigbeeVersion: string;
    rfList: {
        rfChl: number;
        rfVal: string;
    }[];
    dayKwh: number;
    monthKwh: number;
    appPower: string;
    reactPower: string;
    faultState: Record<string, any>;
    securitySetting1: Record<string, any>;
    securitySetting2: Record<string, any>;
    securitySetting3: Record<string, any>;
    zled: 'on' | 'off';
    getHoursKwh: {
        start: number;
        end: number;
    };
    tempCorrection: number;
    partnerDevice: any;
    bleAddr: string;
    outlet: number;
    count: number;
    locks: {
        enabled: number;
        outlets: number[];
    }[];
    startupDiy: any;
    rangeStart: number;
    rangeEnd: number;
    subOtaInfo: {
        state: number;
        stateTime: string;
    };
    brightAdjust: '+' | '-';
    ColourTempAdjust: '+' | '-';
    keyboard: {
        index: number;
        enable: boolean;
        sceneid: string;
        shortcut: string;
    }[];
    human: number;
    sensitivity: number;
    judgeTime: number;
    brState: string;
    sDeviceid: string;
    tempsource?: number;
    switchLevel: {
        level: {
            value: number;
            unit: string;
        };
    };
    colorControl: {
        saturation: {
            value: number;
        };
        color: any;
        hue: {
            value: number;
        };
    };
    colorTemperature: {
        colorTemperature: {
            value: number;
        };
    };
    commands: {
        component: 'main';
        capability: string;
        command: string;
        arguments: any[];
    }[];
    curTargetTemp: number;
    windowSwitch: boolean;
    ecoTargetTemp: number;
    autoTargetTemp: number;
    manTargetTemp: number;
    mon: string;
    tues: string;
    wed: string;
    thur: string;
    fri: string;
    sat: string;
    sun: string;
    detectInterval: number;
    wallPenetration: boolean;
    lightSwitch: string;
    lightMode: number;
    motorReversal: boolean;
    electromotor: number;
    percentageControl: number;
    disableSwipeGesture: boolean;
    timers: Array<any>;
    colorTempPhysicalMinMireds: number;
    colorTempPhysicalMaxMireds: number;
    colorTemperatureMireds: number;
    currentHue: number;
    currentSaturation: number;
    currentX: number;
    currentY: number;
    minLevel: number;
    maxLevel: number;
    currentLevel: number;
    doorsensors: Record<string, 'on' | 'off' | 'uninstalled'>;
    source: 'app' | 'voice';
    NO_SAVE_DB: boolean;
    ASYN_RESP: {
        sequence?: string;
    };
    realIrrigationVolume: number;
    realIrrigationVolumeGal: number;
    lastIrrigationTime: string;
    endIrrigationTime: string;
    hasException: boolean;
    todayWaterUsage: number;
    todayWaterUsageGal: number;
    exceptionReport: number[];
    controlMode: string;
    autoAction: {
        option: string;
        time?: {
            type: string;
            total: string;
            times?: number;
            intervals?: string;
        };
        volume?: {
            type: string;
            value?: number;
            valueGal?: number;
            times?: number;
            intervals?: string;
        };
    };
    alarm: boolean;
    getHistory: string;
    infraredSetting: number;
}
export interface IWifiLightBrCt {
    br: number;
    ct: number;
}
export interface IWifiLightRGBScene {
    r: number;
    g: number;
    b: number;
    br: number;
    tf?: number;
    sp?: number;
}
export type TLightSceneLType = 'normal' | 'white' | 'color' | 'bright' | 'read' | 'computer' | 'nightLight' | 'goodNight' | 'nightLight' | 'party' | 'leisure' | 'soft' | 'colorful' | 'partyRGB' | 'leisureRGB' | 'softRGB' | 'colorfulRGB' | 'lightshipWhite' | 'colorfuls' | 'colorfulGRA' | 'colorfulBRE' | 'RGBSTR' | 'RGBGRA' | 'RGBPUL' | 'RGBBRE' | 'DIYGRA' | 'DIYPUL' | 'DIYBRE' | 'DIYSTR' | 'notSupportScene';
export { IDeviceParams };
