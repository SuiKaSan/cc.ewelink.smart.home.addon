import { TLightSceneLType } from './IDeviceParams';
export interface IControlDeviceParams {
    outlet: number | 'all';
    switch: 'on' | 'off' | 'pause';
    pulse: string;
    pulseState: string;
    width: number;
    startup: string;
    lock: boolean;
    configure: Array<{
        startup: string;
        outlet: number;
    }>;
    pulses: Array<{
        pulse: string;
        width: number;
        outlet: number;
        switch?: string;
    }>;
    targetTemp: number;
    workMode: number;
    childLock: 'on' | 'off';
    stopMode: number;
    securityType: number;
    wind_speed: number;
    wind_swing_ud: 'on' | 'off';
    wind_swing_lr: 'on' | 'off';
    mediaMode: 'heat' | 'cool' | 'auto' | 'dry' | 'fan';
    start: number;
    end: number;
    brightness: number;
    colorTemp: number;
    hue: number;
    saturation: number;
    colorMode: 'cct' | 'rgb' | 'white';
    backlight: string;
    slowlyLit: number;
    slowlyDimmed: number;
    dimming: number;
    quickSwitch: number;
    brightAdjust: '+' | '-';
    ColourTempAdjust: '+' | '-';
    sceneType: TLightSceneLType;
    setclose: number;
    fanMode: 'low' | 'mid' | 'high';
    rfChl: number;
    rangeStart: number;
    rangeEnd: number;
    sensitivity: number;
    duration: number;
    oneKwh: 'start' | 'end' | 'get';
    startTime: string;
    endTime: string;
    mode: 'rgb' | 'cct' | 'white' | number;
    fileName: string;
    volume: number;
    test: boolean;
}