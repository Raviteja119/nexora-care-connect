import logo from "@/assets/nexora-logo.jpeg";

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function Logo({ size = 40, withText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      <img
        src={logo}
        alt="NeXora"
        style={{ width: size, height: size }}
        className="object-contain rounded-md mix-blend-multiply shrink-0"
      />
      {withText && (
        <div className="leading-tight min-w-0">
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent truncate">
            NeXora
          </h1>
          <p className="text-[9px] text-muted-foreground -mt-0.5 truncate">Hospital Services</p>
        </div>
      )}
    </div>
  );
}