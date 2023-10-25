export interface ToggleProps {
  labels: {
    firstLabel: string;
    secondLabel: string;
  };
  onToggle?: (value: number) => void;
}
