interface SensorReading {
  label: string;
  average: number;
  current: number;
  unit: string;
  lowThreshold: number;
  highThreshold: number;
  criticalLowThreshold: number;
  criticalHighThreshold: number;
}

interface SensorReadingBarProps {
  reading: SensorReading;
}

export function SensorReadingBar({ reading }: SensorReadingBarProps) {
  const { label, average, current, unit, lowThreshold, highThreshold, criticalLowThreshold, criticalHighThreshold } = reading;

  // Determine status and color
  const getStatus = () => {
    if (current <= criticalLowThreshold || current >= criticalHighThreshold) {
      return { status: 'critical', color: 'bg-red-600', textColor: 'text-red-900', bgColor: 'bg-red-50' };
    } else if (current < lowThreshold || current > highThreshold) {
      return { status: 'warning', color: 'bg-yellow-500', textColor: 'text-yellow-900', bgColor: 'bg-yellow-50' };
    }
    return { status: 'normal', color: 'bg-green-600', textColor: 'text-green-900', bgColor: 'bg-green-50' };
  };

  const { status, color, textColor, bgColor } = getStatus();

  // Calculate position percentage for visual indicator
  const min = criticalLowThreshold * 0.7;
  const max = criticalHighThreshold * 1.3;
  const range = max - min;
  const currentPosition = ((current - min) / range) * 100;
  const averagePosition = ((average - min) / range) * 100;

  return (
    <div className={`p-4 rounded-lg border-2 ${bgColor} ${status === 'critical' ? 'border-red-300' : status === 'warning' ? 'border-yellow-300' : 'border-green-300'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{label}</span>
        <span className={`text-lg font-bold ${textColor}`}>
          {current} {unit}
        </span>
      </div>

      {/* Visual bar indicator */}
      <div className="relative h-12 bg-gradient-to-r from-red-200 via-green-200 to-red-200 rounded-lg overflow-hidden mb-2">
        {/* Average marker */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-gray-800 z-10" 
          style={{ left: `${averagePosition}%` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-800 whitespace-nowrap">
            Avg: {average}
          </div>
        </div>

        {/* Current reading marker */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${color} rounded-full border-2 border-white shadow-lg z-20`}
          style={{ left: `${currentPosition}%`, marginLeft: '-8px' }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-600">
        <span className="text-red-600 font-medium">Low</span>
        <span className="text-green-600 font-medium">Normal</span>
        <span className="text-red-600 font-medium">High</span>
      </div>

      {/* Status message */}
      {status === 'critical' && (
        <div className="mt-2 text-xs text-red-700 font-medium">
          ⚠️ CRITICAL - Emergency alert triggered!
        </div>
      )}
      {status === 'warning' && (
        <div className="mt-2 text-xs text-yellow-700 font-medium">
          ⚠ Warning - Monitor closely
        </div>
      )}
      {status === 'normal' && (
        <div className="mt-2 text-xs text-green-700 font-medium">
          ✓ Normal range
        </div>
      )}
    </div>
  );
}
