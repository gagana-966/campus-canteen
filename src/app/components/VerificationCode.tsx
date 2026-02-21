import { useState, useRef, useEffect } from "react";
import { UtensilsCrossed, ArrowLeft, Mail } from "lucide-react";

interface VerificationCodeProps {
  email: string;
  onVerify: (code: string) => void;
  onBack: () => void;
  userRole?: "customer" | "restaurant" | null;
}

export function VerificationCode({ email, onVerify, onBack, userRole }: VerificationCodeProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== "") && index === 5) {
      setTimeout(() => {
        onVerify(newCode.join(""));
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill("")).slice(0, 6);
    setCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (newCode.every(digit => digit !== "")) {
      setTimeout(() => {
        onVerify(newCode.join(""));
      }, 100);
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // Dynamic colors based on role
  const isRestaurant = userRole === "restaurant";
  const primaryColor = isRestaurant ? "blue" : "orange";
  const gradientFrom = isRestaurant ? "from-blue-400" : "from-orange-400";
  const gradientVia = isRestaurant ? "via-blue-500" : "via-orange-500";
  const gradientTo = isRestaurant ? "to-blue-600" : "to-orange-600";
  const iconColor = isRestaurant ? "text-blue-500" : "text-orange-500";
  const iconBgColor = isRestaurant ? "bg-blue-100" : "bg-orange-100";
  const textColor = isRestaurant ? "text-blue-600" : "text-orange-600";
  const buttonBg = isRestaurant ? "bg-blue-500" : "bg-orange-500";
  const buttonHover = isRestaurant ? "hover:bg-blue-600" : "hover:bg-orange-600";
  const ringColor = isRestaurant ? "focus:ring-blue-500" : "focus:ring-orange-500";
  const borderColor = isRestaurant ? "focus:border-blue-500" : "focus:border-orange-500";
  const hoverTextColor = isRestaurant ? "hover:text-blue-600" : "hover:text-orange-600";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <UtensilsCrossed size={48} className={iconColor} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Campus Canteen</h1>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`${iconBgColor} p-3 rounded-full`}>
                <Mail className={iconColor} size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className={`${textColor} font-semibold mt-1`}>{email}</p>
          </div>

          {/* Code Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter Verification Code
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${ringColor} ${borderColor} transition-all`}
                />
              ))}
            </div>
          </div>

          {/* Resend Section */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className={`${textColor} ${hoverTextColor} font-semibold text-sm`}
              >
                Resend Code
              </button>
            ) : (
              <p className="text-gray-600 text-sm">
                Resend code in <span className={`font-semibold ${textColor}`}>{timeLeft}s</span>
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => onVerify(code.join(""))}
            disabled={code.some(digit => digit === "")}
            className={`w-full ${buttonBg} ${buttonHover} disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg`}
          >
            Verify Code
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Didn't receive the code? Check your spam folder or try resending.
            </p>
          </div>
        </div>

        {/* Demo Code */}
        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
          <p className="font-semibold mb-1">Demo Verification Code:</p>
          <p className="text-lg font-bold">123456</p>
        </div>
      </div>
    </div>
  );
}