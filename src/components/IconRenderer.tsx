import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export default function IconRenderer({ iconName, className = "", size, style }: IconRendererProps) {
  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[iconName];
  
  // Fallback to a default icon if the specified icon doesn't exist
  if (!IconComponent) {
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback className={className} size={size} style={style} />;
  }
  
  return <IconComponent className={className} size={size} style={style} />;
}
