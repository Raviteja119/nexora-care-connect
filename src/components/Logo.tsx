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
        className="object-contain rounded-lg mix-blend-multiply shrink-0 ring-2 ring-primary/20"
      />
      {withText && (
        <div className="leading-tight min-w-0">
          <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent truncate tracking-tight">
            NeXora
          </h1>
          <p className="text-[10px] text-muted-foreground -mt-0.5 truncate">Hospital Services</p>
        </div>
      )}
    </div>
  );
}