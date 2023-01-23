interface ProgressbarProps {
  progress: number;
}

function Progressbar(props: ProgressbarProps) {
  const progressStyles = {
    width: `${props.progress}%`,
  };
  return (
    <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      <div
        className="h-3 rounded-xl bg-violet-600 transition-all"
        aria-valuenow={75}
        role="progressbar"
        aria-label="Progresso de hábitos"
        style={progressStyles}
      ></div>
    </div>
  );
}

export default Progressbar;
