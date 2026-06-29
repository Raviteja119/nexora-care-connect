import logo from "@/assets/nexora-logo.jpeg";

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function Logo({ size = 40, withText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logo}
        alt="NeXora"
        style={{ width: size, height: size }}
        className="object-contain rounded-md mix-blend-multiply"
      />
      {withText && (
        <div className="leading-tight">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            NeXora
          </h1>
          <p className="text-[10px] text-muted-foreground -mt-0.5">Hospital Services</p>
        </div>
      )}
    </div>
  );
}