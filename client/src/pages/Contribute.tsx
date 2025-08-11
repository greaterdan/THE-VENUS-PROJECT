import { useState, useEffect } from "react";
import hudElementData from "@/assets/hud-element-definition.json";

interface HUDControl {
  id: string;
  uiName: { strDB: Array<{ locale: number; str: string }> };
  type: number;
  default: number | number[];
  value: number | number[];
  min?: number;
  max?: number;
  canAnimate: boolean;
}

export default function Contribute() {
  const [controls, setControls] = useState<HUDControl[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load HUD element controls from JSON
    if (hudElementData.clientControls) {
      setControls(hudElementData.clientControls as HUDControl[]);
    }
    setIsLoading(false);
  }, []);

  const handleControlChange = (controlId: string, newValue: number | number[]) => {
    setControls(prev => 
      prev.map(control => 
        control.id === controlId 
          ? { ...control, value: newValue }
          : control
      )
    );
  };

  const formatColorValue = (colorArray: number[]) => {
    if (Array.isArray(colorArray) && colorArray.length >= 3) {
      const r = Math.round(colorArray[0] * 255);
      const g = Math.round(colorArray[1] * 255);
      const b = Math.round(colorArray[2] * 255);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return 'rgb(255, 255, 255)';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venus-lime mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HUD Element Controls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">{hudElementData.capsuleName}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Interactive HUD Element Control Panel - {hudElementData.apiVersion}
        </p>
      </div>

      {/* Element Info */}
      <div className="bg-white border border-venus-gray rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Element Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-500">Capsule ID</div>
            <div className="text-sm font-mono break-all">{hudElementData.capsuleID}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Frame Size</div>
            <div className="text-sm font-medium">
              {hudElementData.sourceInfo?.framesize?.size?.x} × {hudElementData.sourceInfo?.framesize?.size?.y}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Duration</div>
            <div className="text-sm font-medium">
              {((hudElementData.sourceInfo?.duration?.value || 0) / (hudElementData.sourceInfo?.duration?.scale || 1)).toFixed(2)}s
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Platform Support</div>
            <div className="text-sm font-medium">{hudElementData.platformSupport?.join(', ')}</div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="bg-white border border-venus-gray rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">HUD Element Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {controls.map((control) => {
            const controlName = control.uiName.strDB[0]?.str || 'Unknown Control';
            const isColorControl = control.type === 4;
            const isNumericControl = control.type === 2;

            return (
              <div key={control.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    {controlName}
                  </label>
                  {control.canAnimate && (
                    <span className="text-xs bg-venus-lime text-black px-2 py-1 rounded">
                      Animatable
                    </span>
                  )}
                </div>

                {isColorControl && Array.isArray(control.value) && (
                  <div className="space-y-3">
                    <div 
                      className="w-full h-12 border border-gray-300 rounded"
                      style={{ backgroundColor: formatColorValue(control.value) }}
                    ></div>
                    <div className="text-xs text-gray-500 font-mono">
                      RGB: {formatColorValue(control.value)}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      Values: [{(control.value as number[]).map(v => v.toFixed(3)).join(', ')}]
                    </div>
                  </div>
                )}

                {isNumericControl && typeof control.value === 'number' && (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={control.min || -1000}
                      max={control.max || 1000}
                      value={control.value}
                      onChange={(e) => handleControlChange(control.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{control.min || -1000}</span>
                      <span className="font-medium">{control.value}</span>
                      <span>{control.max || 1000}</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-400 font-mono">
                  ID: {control.id.substring(0, 8)}...
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw JSON Preview */}
      <div className="mt-8 bg-gray-900 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-venus-lime">JSON Preview</h3>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify({ 
            capsuleName: hudElementData.capsuleName,
            apiVersion: hudElementData.apiVersion,
            controls: controls.slice(0, 2) // Show first 2 controls to avoid clutter
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
