import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";


type ColorVariant = "emerald" | "purple" | "orange" | "golden";

interface GradientColors {
    dark: {
        border: string;
        overlay: string;
        accent: string;
        text: string;
        glow: string;
        textGlow: string;
        hover: string;
    };
    light: {
        border: string;
        base: string;
        overlay: string;
        accent: string;
        text: string;
        glow: string;
        hover: string;
    };
}

interface GradientButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    label?: string;
    className?: string;
    variant?: ColorVariant;
}

const gradientColors: Record<ColorVariant, GradientColors> = {
    emerald: {
        dark: {
            border: "from-[#336C4F] via-[#0C1F21] to-[#0D6437]",
            overlay: "from-[#347B52]/40 via-[#0C1F21] to-[#0D6437]/30",
            accent: "from-[#87F6B7]/10 via-[#0C1F21] to-[#17362A]/50",
            text: "from-[#8AEECA] to-[#73F8A8]",
            glow: "rgba(135,246,183,0.1)",
            textGlow: "rgba(135,246,183,0.4)",
            hover: "from-[#17362A]/20 via-[#87F6B7]/10 to-[#17362A]/20",
        },
        light: {
            border: "from-emerald-400 via-emerald-300 to-emerald-200",
            base: "from-emerald-50 via-emerald-50/80 to-emerald-50/90",
            overlay: "from-emerald-300/30 via-emerald-200/20 to-emerald-400/20",
            accent: "from-emerald-400/20 via-emerald-300/10 to-emerald-200/30",
            text: "from-emerald-700 to-emerald-600",
            glow: "rgba(52,211,153,0.2)",
            hover: "from-emerald-300/30 via-emerald-200/20 to-emerald-300/30",
        },
    },
    purple: {
        dark: {
            border: "from-[#6B46C1] via-[#0C1F21] to-[#553C9A]",
            overlay: "from-[#7E22CE]/40 via-[#0C1F21] to-[#6B46C1]/30",
            accent: "from-[#E9D8FD]/10 via-[#0C1F21] to-[#44337A]/50",
            text: "from-[#E9D8FD] to-[#D6BCFA]",
            glow: "rgba(159,122,234,0.1)",
            textGlow: "rgba(159,122,234,0.4)",
            hover: "from-[#44337A]/20 via-[#B794F4]/10 to-[#44337A]/20",
        },
        light: {
            border: "from-[#C77DFF] via-[#E0B0FF] to-[#F5D9FF]",
            base: "from-[#9333EA] via-[#A855F7] to-[#C084FC]",
            overlay: "from-[#A855F7]/90 via-[#C084FC]/85 to-[#D8B4FE]/80",
            accent: "from-[#C084FC]/60 via-[#D8B4FE]/50 to-[#E9D5FF]/45",
            text: "from-white via-gray-50 to-white",
            glow: "rgba(168,85,247,1)",
            hover: "from-[#A855F7]/80 via-[#C084FC]/75 to-[#D8B4FE]/70",
        },
    },
    orange: {
        dark: {
            border: "from-[#C05621] via-[#0C1F21] to-[#9C4221]",
            overlay: "from-[#DD6B20]/40 via-[#0C1F21] to-[#C05621]/30",
            accent: "from-[#FED7AA]/10 via-[#0C1F21] to-[#7B341E]/50",
            text: "from-[#FED7AA] to-[#FBD38D]",
            glow: "rgba(237,137,54,0.1)",
            textGlow: "rgba(237,137,54,0.4)",
            hover: "from-[#7B341E]/20 via-[#ED8936]/10 to-[#7B341E]/20",
        },
        light: {
            border: "from-orange-400 via-orange-300 to-orange-200",
            base: "from-orange-50 via-orange-50/80 to-orange-50/90",
            overlay: "from-orange-300/30 via-orange-200/20 to-orange-400/20",
            accent: "from-orange-400/20 via-orange-300/10 to-orange-200/30",
            text: "from-orange-700 to-orange-600",
            glow: "rgba(237,137,54,0.2)",
            hover: "from-orange-300/30 via-orange-200/20 to-orange-300/30",
        },
    },
    golden: {
        dark: {
            border: "from-[#D97706] via-[#0C1F21] to-[#B45309]",
            overlay: "from-[#F59E0B]/40 via-[#0C1F21] to-[#D97706]/30",
            accent: "from-[#FDE68A]/10 via-[#0C1F21] to-[#92400E]/50",
            text: "from-[#FDE68A] to-[#FCD34D]",
            glow: "rgba(245,158,11,0.1)",
            textGlow: "rgba(245,158,11,0.4)",
            hover: "from-[#92400E]/20 via-[#F59E0B]/10 to-[#92400E]/20",
        },
        light: {
            border: "from-[#FCD34D] via-[#FBBF24] to-[#F59E0B]",
            base: "from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D]",
            overlay: "from-[#F59E0B]/90 via-[#FBBF24]/85 to-[#FCD34D]/80",
            accent: "from-[#FBBF24]/60 via-[#FCD34D]/50 to-[#FDE68A]/45",
            text: "from-white via-gray-50 to-white",
            glow: "rgba(245,158,11,1)",
            hover: "from-[#F59E0B]/80 via-[#FBBF24]/75 to-[#FCD34D]/70",
        },
    },
};

export default function GradientButton({
    label = "Welcome",
    className,
    variant = "emerald",
    ...props
}: GradientButtonProps) {
    const colors = gradientColors[variant];

    return (
        <Button
            variant="ghost"
            className={cn(
                "group relative h-12 px-4 rounded-lg overflow-hidden transition-all duration-500",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "absolute inset-0 rounded-lg p-[2px] bg-linear-to-b",
                    "dark:bg-none",
                    colors.light.border,
                    colors.dark.border
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-lg opacity-90",
                        "bg-white/80",
                        "dark:bg-[#0C1F21]"
                    )}
                />
            </div>

            <div
                className={cn(
                    "absolute inset-[2px] rounded-lg opacity-95",
                    variant === "purple" ? "bg-gradient-to-br from-white/60 via-purple-100/40 to-white/60" : 
                    variant === "golden" ? "bg-gradient-to-br from-white/60 via-yellow-100/40 to-white/60" : "bg-white/80",
                    "dark:bg-[#0C1F21]"
                )}
            />

            <div
                className={cn(
                    "absolute inset-[2px] bg-linear-to-r rounded-lg",
                    variant === "purple" || variant === "golden" ? "opacity-100" : "opacity-90",
                    colors.light.base,
                    "dark:from-[#0C1F21] dark:via-[#0C1F21] dark:to-[#0C1F21]"
                )}
            />
            <div
                className={cn(
                    "absolute inset-[2px] bg-linear-to-b rounded-lg opacity-80",
                    colors.light.overlay,
                    colors.dark.overlay
                )}
            />
            <div
                className={cn(
                    "absolute inset-[2px] bg-linear-to-br rounded-lg",
                    variant === "purple" || variant === "golden" ? "opacity-100" : "",
                    colors.light.accent,
                    colors.dark.accent
                )}
            />
            {(variant === "purple" || variant === "golden") && (
                <div
                    className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60"
                />
            )}

            <div
                className={cn(
                    "absolute inset-[2px] rounded-lg",
                    variant === "purple" && "shadow-[inset_0_0_30px_rgba(168,85,247,0.8),inset_0_2px_10px_rgba(255,255,255,0.3),0_0_30px_rgba(168,85,247,0.6),0_0_50px_rgba(192,132,252,0.4)]",
                    variant === "golden" && "shadow-[inset_0_0_30px_rgba(245,158,11,0.8),inset_0_2px_10px_rgba(255,255,255,0.3),0_0_30px_rgba(245,158,11,0.6),0_0_50px_rgba(251,191,36,0.4)]",
                    variant !== "purple" && variant !== "golden" && `shadow-[inset_0_0_10px_${colors.light.glow}]`,
                    `dark:shadow-[inset_0_0_15px_${colors.dark.glow}]`
                )}
            />

            <div className="relative flex items-center justify-center gap-2">
                {props.children ? (
                    React.Children.map(props.children, (child) => {
                        if (React.isValidElement(child) && child.type === 'span') {
                            const childElement = child as React.ReactElement<{ className?: string }>
                            return React.cloneElement(childElement, {
                                className: cn(
                                    "bg-linear-to-b bg-clip-text text-transparent",
                                    colors.light.text,
                                    colors.dark.text,
                                    `dark:drop-shadow-[0_0_12px_${colors.dark.textGlow}]`,
                                    childElement.props.className
                                )
                            });
                        }
                        return child;
                    })
                ) : (
                    <span
                        className={cn(
                            "text-lg font-light bg-linear-to-b bg-clip-text text-transparent tracking-tighter",
                            colors.light.text,
                            colors.dark.text,
                            `dark:drop-shadow-[0_0_12px_${colors.dark.textGlow}]`
                        )}
                    >
                        {label}
                    </span>
                )}
            </div>

            <div
                className={cn(
                    "absolute inset-[2px] opacity-0 transition-opacity duration-300 bg-linear-to-r group-hover:opacity-100 rounded-lg",
                    colors.light.hover,
                    colors.dark.hover
                )}
            />
        </Button>
    );
}
